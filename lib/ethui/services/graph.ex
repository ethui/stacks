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

  def handle_info(:boot, state) do
    create_db(state)
    {:ok, proc} = boot_graph_node(state)

    {:noreply, %{state | proc: proc}}
  end

  @impl GenServer
  def handle_info({:EXIT, _pid, exit_status}, state) do
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

  defp create_db(%{slug: slug, hash: hash} = state) do
    {:ok, pg} =
      Postgrex.start_link(pg_config())

    create_db_sql = "CREATE DATABASE #{db_name(state)}"
    Postgrex.query(pg, create_db_sql, []) |> IO.inspect()
    Process.exit(pg, :normal)
  end

  defp boot_graph_node(%{slug: slug, hash: hash} = state) do
    pg_config = pg_config()

    pid = self()
    cmd = "docker"
    config = pg_config()
    db_name = db_name(state)

    # TODO make the postgres_host macos compatible
    args =
      "run --network=ethui-stacks --name ethui-stacks-#{slug}-graph --rm -p 8000:8000 -p 8001:8001 -p 8020:8020 -p 8030:8030 -p 8040:8040 -e postgres_host=172.17.0.1 -e postgres_port=#{pg_config[:port]} -e postgres_user=#{pg_config[:username]} -e postgres_pass=#{pg_config[:password]} -e postgres_db=#{db_name} -e ipfs=ethui-stacks-ipfs:5001 -e GRAPH_LOG=info -e ETHEREUM_REORG_THRESHOLD=1 -e ETHEREUM_ACESTOR_COUNT=1 -e ethereum=anvil:http://localhost:4000/stacks/#{slug} graphprotocol/graph-node"
      |> String.split(" ")

    MuonTrap.Daemon.start_link(cmd, args,
      logger_fun: fn f -> GenServer.cast(pid, {:log, f}) end,
      stderr_to_stdout: true,
      exit_status_to_reason: & &1
    )
  end

  defp pg_config do
    Application.get_env(:ethui, Ethui.Repo)
  end

  defp db_name(%{slug: slug, hash: hash}) do
    db_name = "ethui_stack_#{slug}_#{hash}"
  end
end
