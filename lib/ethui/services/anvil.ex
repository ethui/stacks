defmodule Ethui.Services.Anvil do
  @moduledoc """
  GenServer that manages a single `anvil` instace

  Requires the pid of a PortManager process, which is used to reserve an HTTP port
  This wraps a MuontipTrap Daemon
  """

  use GenServer
  require Logger

  @log_max_size 10_000

  @type id :: pid | atom | {:via, atom, term}

  @type opts :: [
          # the HttpPort manager process to use
          ports: id,
          id: String.t() | nil
        ]

  @doc "Start an anvil instance"
  @spec start_link(opts) :: GenServer.on_start()
  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: opts[:name])
  end

  #
  # Client

  @doc "Get the URL of an anvil instance"
  @spec url(id) :: String.t()
  def url(id) do
    GenServer.call(id, :url)
  end

  @doc "Get the logs of an anvil instance"
  @spec logs(id) :: String.t()
  def logs(id) do
    GenServer.call(id, :logs)
  end

  @doc "Stop an anvil instance"
  @spec stop(id) :: :ok
  def stop(id) do
    GenServer.cast(id, :stop)
  end

  #
  # Server
  #

  @impl GenServer
  def init(opts) do
    Process.flag(:trap_exit, true)

    {:ok, port} =
      Ethui.Stacks.HttpPorts.claim(opts[:ports])

    send(self(), :boot)

    {:ok, %{port: port, proc: nil, logs: :queue.new()}}
  end

  @impl GenServer
  def handle_info(:boot, %{port: port} = state) do
    pid = self()

    {:ok, proc} =
      MuonTrap.Daemon.start_link("anvil", ["--port", to_string(port)],
        logger_fun: fn f -> GenServer.cast(pid, {:log, f}) end,
        # TODO maybe patch muontrap to have a separate stream for stderr
        stderr_to_stdout: true,
        exit_status_to_reason: & &1
      )

    {:noreply, %{state | proc: proc}}
  end

  @impl GenServer
  def handle_info({:EXIT, _pid, exit_status}, state) do
    case exit_status do
      0 ->
        {:stop, :normal, state}

      exit_code ->
        Logger.error("anvil exited with code #{inspect(exit_code)}")
        {:stop, :normal, state}
    end
  end

  @impl GenServer
  def handle_call(:url, _from, %{port: port} = state) do
    {:reply, "http://localhost:#{port}", state}
  end

  @impl GenServer
  def handle_call(:logs, _from, %{logs: logs} = state) do
    {:reply, logs |> :queue.to_list(), state}
  end

  @impl GenServer
  def handle_cast(:stop, %{proc: proc} = state) do
    GenServer.stop(proc)
    {:stop, :normal, state}
  end

  @impl GenServer
  def handle_cast({:log, f}, %{logs: logs} = state) do
    # TODO prefix a unique identifier for this process
    # Logger.warn(f)
    logs = :queue.in(f, logs) |> trim()
    {:noreply, %{state | logs: :queue.in(f, logs)}}
  end

  defp trim(q) do
    if :queue.len(q) > @log_max_size do
      {{:value, _}, q} = :queue.out(q)
      trim(q)
    else
      q
    end
  end
end
