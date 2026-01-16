defmodule Ethui.Services.Anvil do
  @moduledoc """
  GenServer that manages a single `anvil` instance

  This wraps a MuonTrap Daemon
  """

  use GenServer
  require Logger
  alias Ethui.Stacks

  @idle_timeout :timer.minutes(10)
  @log_max_size 10_000

  @type id :: pid | atom | {:via, atom, term}

  @type opts_value :: String.t() | number()
  @type opts_map :: %{optional(String.t()) => opts_value()}

  @type opts :: [
          slug: String.t(),
          hash: String.t(),
          anvil_opts: opts_map,
          id: integer()
        ]

  @type t :: %{
          # http port
          port: pos_integer,
          # muontrap process
          proc: pid | nil,
          logs: :queue.queue(),
          slug: String.t(),
          # directory where state and IPC socket is stored
          dir: String.t(),
          log_subscribers: MapSet.t(),
          chain_id: String.t(),
          # idle timer
          idle_timer: :timer.time(),
          status: atom(),
          last_used: integer
        }

  @doc "Start an anvil instance"
  @spec start_link(opts) :: GenServer.on_start()
  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: name(opts[:slug]))
  end

  def name(slug) do
    {:via, Registry, {Ethui.Stacks.Registry, {slug, :anvil}}}
  end

  #
  # Client

  @doc "Get the URL of an anvil instance"
  @spec url(id) :: String.t()
  def url(id) do
    GenServer.call(id, :url)
  end

  @spec ensure_running(id) :: String.t()
  def ensure_running(id) do
    GenServer.call(id, :ensure_running)
  end

  @doc """
    Subscribes to logs of an anvil instance.
    An immediate message is sent with all current log history, followed by messages as future logs are read"
  """
  @spec subscribe_logs(id) :: :ok
  def subscribe_logs(id) do
    GenServer.cast(id, {:subscribe_logs, self()})
  end

  @doc """
  Unsubscribes from receiving logs
  """
  @spec unsubscribe_logs(id) :: :ok
  def unsubscribe_logs(id) do
    GenServer.cast(id, {:unsubscribe_logs, self()})
  end

  @doc "Stops an anvil instance and deletes the state file"
  @spec destroy(id) :: :ok
  def destroy(id) do
    GenServer.cast(id, :destroy)
  end

  #
  # Server
  #

  @spec init(opts) :: {:ok, t}
  @impl GenServer
  def init(opts) do
    Process.flag(:trap_exit, true)

    with {:ok, dir} <- data_dir(opts[:slug], opts[:hash]),
         :ok <- File.mkdir_p!(dir),
         {:ok, port} <-
           Ethui.Stacks.HttpPorts.claim() do
      {:ok,
       %{
         port: port,
         proc: nil,
         logs: :queue.new(),
         dir: dir,
         slug: opts[:slug],
         log_subscribers: MapSet.new(),
         chain_id: Stacks.chain_id(opts[:id]),
         args: opts_to_args(opts[:anvil_opts]),
         idle_timer: nil,
         status: :suspended,
         last_used: nil
       }}
    else
      error -> error
    end
  end

  @impl GenServer
  def handle_info({:EXIT, _pid, exit_status}, %{port: port} = state) do
    Ethui.Stacks.HttpPorts.free(port)

    case exit_status do
      0 ->
        {:stop, :normal, state}

      :killed ->
        {:noreply, state}

      exit_code ->
        Logger.error("anvil exited with code #{inspect(exit_code)}")
        {:stop, :normal, state}
    end
  end

  def handle_info(
        :suspend,
        %{status: :running, proc: proc, last_used: last_used} = state
      ) do
    Logger.info("Suspending #{state.slug}: #{last_used}")

    Process.exit(proc, :kill)

    {:noreply, %{state | port: nil, proc: nil, status: :suspended, idle_timer: nil}}
  end

  @impl GenServer
  def handle_call(:url, _from, %{port: port} = state) do
    {:reply, "http://localhost:#{port}", touch(state)}
  end

  @impl GenServer
  def handle_call(:logs, _from, %{logs: logs} = state) do
    {:reply, logs |> :queue.to_list(), touch(state)}
  end

  def handle_call(
        :ensure_running,
        _from,
        %{slug: slug, status: status} = state
      ) do
    state =
      case status do
        :running ->
          state

        :suspended ->
          Logger.info("restarting slug: #{slug}")

          start_anvil(state)
      end

    {:reply, :ok, state}
  end

  @impl GenServer
  def handle_cast(:destroy, %{proc: proc, port: port} = state) do
    remove_dir(state)
    GenServer.stop(proc)
    {:stop, :normal, state}
  end

  @impl GenServer
  def handle_cast({:log, line}, %{logs: logs, log_subscribers: subs} = state) do
    for s <- subs do
      send(s, {:logs, :anvil, state.slug, [line]})
    end

    new_logs = :queue.in(line, logs) |> trim()

    {:noreply, %{state | logs: new_logs}}
  end

  @impl GenServer
  def handle_cast(
        {:subscribe_logs, pid},
        %{slug: slug, logs: logs, log_subscribers: subs} = state
      ) do
    send(pid, {:logs, :anvil, slug, :queue.to_list(logs)})
    {:noreply, %{state | log_subscribers: MapSet.put(subs, pid)}}
  end

  @impl GenServer
  def handle_cast({:unsubscribe_logs, pid}, %{log_subscribers: subs} = state) do
    {:noreply, %{touch(state) | log_subscribers: MapSet.delete(subs, pid)}}
  end

  ## aux 

  defp remove_dir(state) do
    case File.rm_rf(state.dir) do
      {:ok, _files} ->
        :ok

      {:error, reason, _} ->
        Logger.error("Failed to cleanup resource for slug #{state.slug}: #{inspect(reason)}")
        {:error, reason}
    end
  end

  defp trim(q) do
    if :queue.len(q) > @log_max_size do
      {{:value, _}, q} = :queue.out(q)
      trim(q)
    else
      q
    end
  end

  #
  # env
  #

  defp data_dir(nil, _), do: {:error, :no_slug}
  defp data_dir(_, nil), do: {:error, :no_slug}

  defp data_dir(slug, hash) do
    root = config() |> Keyword.fetch!(:data_dir_root)
    {:ok, "#{root}/#{slug}.#{hash}/anvil"}
  end

  defp anvil_bin do
    config() |> Keyword.fetch!(:anvil_bin)
  end

  defp config do
    Application.get_env(:ethui, Ethui.Stacks)
  end

  defp idle_timeout() do
    @idle_timeout
  end

  #
  # utils
  #

  defp opts_to_args(nil), do: []

  defp opts_to_args(opts) when is_map(opts) do
    opts
    |> Enum.flat_map(fn {key, val} ->
      ["--" <> dashify(key), to_string(val)]
    end)
  end

  defp dashify(key) when is_binary(key), do: String.replace(key, "_", "-")

  defp touch(state) do
    if state.idle_timer, do: Process.cancel_timer(state.idle_timer)

    timer =
      Process.send_after(self(), :suspend, idle_timeout())

    %{state | last_used: System.system_time(:second), idle_timer: timer}
  end

  defp wait_until_ready(port, attempts \\ 100)

  defp wait_until_ready(_port, 0), do: {:error, :timeout}

  defp wait_until_ready(port, attempts) do
    url = "http://127.0.0.1:#{port}"

    body =
      Jason.encode!(%{
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1
      })

    case :httpc.request(
           :post,
           {String.to_charlist(url), [], 'application/json', body},
           [],
           [{:body_format, :binary}]
         ) do
      {:ok, {{_, 200, _}, _, _}} ->
        :ok

      _ ->
        Process.sleep(100)
        wait_until_ready(port, attempts - 1)
    end
  end

  defp start_anvil(%{dir: dir, chain_id: chain_id, args: args, slug: slug} = state) do
    {:ok, port} = Ethui.Stacks.HttpPorts.claim()

    pid = self()

    anvil_args =
      [
        "--port",
        to_string(port),
        "--state",
        "#{dir}/state.json",
        "--host",
        "0.0.0.0",
        "--chain-id",
        to_string(chain_id)
      ] ++ args

    case MuonTrap.Daemon.start_link(
           anvil_bin(),
           anvil_args,
           logger_fun: fn f -> GenServer.cast(pid, {:log, f}) end,
           # TODO maybe patch muontrap to have a separate stream for stderr
           stderr_to_stdout: true,
           exit_status_to_reason: & &1
         ) do
      {:ok, proc} ->
        Logger.info("restarting slug with port: #{slug} #{port}")
        wait_until_ready(port)

        %{state | proc: proc, status: :running, port: port} |> touch()

      {:error, reason} ->
        Logger.error("Failed to start anvil: #{inspect(reason)}")
        state
    end
  end
end
