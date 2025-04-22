defmodule Ethui.Services.Graph do
  use GenServer
  require Logger

  @type opts :: [
          slug: String.t(),
          hash: String.t()
        ]

  @type t :: %{
          # muontrap process
          proc: pid | nil,
          logs: :queue.queue(),
          slug: String.t(),
          hash: String.t(),
          log_subscribers: MapSet.t()
        }

  @log_max_size 10_000

  #
  # Client
  #

  @spec start_link(opts) :: GenServer.on_start()
  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: name(opts[:slug]))
  end

  def name(slug) do
    {:via, Registry, {Ethui.Stacks.Registry, {slug, :graph}}}
  end

  #
  # Server
  #

  @spec init(opts) :: {:ok, t}
  @impl GenServer
  def init(opts) do
    Process.flag(:trap_exit, true)

    send(self(), :boot)

    {:ok,
     %{
       slug: opts[:slug],
       hash: opts[:hash],
       proc: nil,
       logs: :queue.new(),
       log_subscribers: MapSet.new()
     }}
  end

  @impl GenServer
  def handle_info(:boot, state) do
    create_db(state)
    {:ok, proc} = boot_graph_node(state)

    {:noreply, %{state | proc: proc}}
  end

  @impl GenServer
  def handle_info({:EXIT, _pid, exit_status}, state) do
    IO.inspect("here")

    case exit_status do
      0 ->
        {:stop, :normal, state}

      exit_code ->
        Logger.error("sleep exited with code #{inspect(exit_code)}")
        {:stop, :normal, state}
    end
  end

  @impl GenServer
  def handle_cast({:log, line}, %{logs: logs, log_subscribers: subs} = state) do
    Logger.debug(line)

    for s <- subs do
      send(s, {:logs, :anvil, state.slug, [line]})
    end

    new_logs = :queue.in(line, logs) |> trim()

    {:noreply, %{state | logs: new_logs}}
  end

  defp trim(q) do
    if :queue.len(q) > @log_max_size do
      {{:value, _}, q} = :queue.out(q)
      trim(q)
    else
      q
    end
  end

  defp create_db(state) do
    {:ok, pg} =
      Postgrex.start_link(pg_config())

    sql = "CREATE DATABASE #{db_name(state)}"

    case Postgrex.query(pg, sql, []) do
      {:ok, _} -> Logger.info("Database #{db_name(state)} created")
      # database already exists, silently ignore
      {:error, %Postgrex.Error{postgres: %{code: :duplicate_database}}} -> nil
      # other errors
      error -> Logger.error("Error creating database #{db_name(state)}: #{inspect(error)}")
    end

    Process.exit(pg, :normal)
  end

  defp boot_graph_node(%{slug: slug} = state) do
    pg_config = pg_config()

    pid = self()
    cmd = "docker"
    db_name = db_name(state)
    # TODO make this configurable
    # this is the docker host IP on linux. it's currently not compatible with macos
    # and it should change if we ever run graph-node directly on the host
    host = "172.17.0.1"

    env =
      [
        postgres_host: host,
        postgres_port: pg_config[:port],
        postgres_user: pg_config[:username],
        postgres_pass: pg_config[:password],
        postgres_db: db_name,
        ipfs: "ethui-stacks-ipfs:5001",
        GRAPH_LOG: "info",
        ETHEREUM_REORG_THRESHOLD: "1",
        ETHEREUM_ACESTOR_COUNT: "1",
        ethereum: "anvil:http://#{host}:4000/stacks/#{slug}"
      ]

    ports =
      [
        "8000:8000",
        "8001:8001",
        "8020:8020",
        "8030:8030",
        "8040:8040"
      ]

    named_args =
      [
        network: "ethui-stacks",
        name: "ethui-stacks-#{slug}-graph"
      ]

    flags = [
      # forces the container to be deleted after stopping, prevent issues with duplicate container named_args
      "rm",
      # makes sure signals are forwarded to the graph node, so that shutdowns work properly
      "init"
    ]

    args = format_docker_args(env, ports, named_args, flags)

    MuonTrap.Daemon.start_link(cmd, args,
      logger_fun: fn f -> GenServer.cast(pid, {:log, f}) end,
      stderr_to_stdout: true,
      exit_status_to_reason: & &1
    )
  end

  defp pg_config do
    config()[:pg]
  end

  defp config do
    Application.get_env(:ethui, __MODULE__)
  end

  defp db_name(%{slug: slug, hash: hash}) do
    "ethui_stack_#{slug}_#{hash}"
  end

  defp format_docker_args(env, ports, named_args, flags) do
    env =
      Enum.map(env, fn {k, v} -> "--env #{k}=#{v}" end) |> Enum.join(" ")

    ports = Enum.map(ports, fn p -> "-p #{p}" end) |> Enum.join(" ")
    named_args = Enum.map(named_args, fn {k, v} -> "--#{k} #{v}" end) |> Enum.join(" ")
    flags = Enum.map(flags, fn f -> "--#{f}" end) |> Enum.join(" ")

    "run #{named_args} #{ports} #{env} #{flags} graphprotocol/graph-node"
    |> IO.inspect()
    |> String.split(" ")
  end
end
