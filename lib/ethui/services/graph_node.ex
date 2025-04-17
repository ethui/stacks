defmodule Ethui.Services.GraphNode do
  use GenServer
  require Logger

  @type opts :: [
          slug: String.t(),
          hash: String.t(),
          name: id | nil
        ]

  @type t :: %{
          # muontrap process
          proc: pid | nil,
          logs: :queue.queue(),
          slug: String.t(),
          log_subscribers: MapSet.t()
        }

  #
  # Client
  #

  @spec start_link(opts) :: GenServer.on_start()
  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: opts[:name])
  end

  #
  # Server
  #

  @spec init(opts) :: {:ok, t}
  def init(opts) do
    Process.flag(:trap_exit, true)

    send(self(), :boot)

    {:ok, %{slug: opts[:slug], proc: nil}}
  end

  def handle_info(:boot, state) do
    pid = self()

    {:ok, proc} =
      MuonTrap.Daemon.start_link("sleep", ["1000"],
        logger_fun: fn f -> GenServer.cast(pid, {:log, f}) end,
        stderr_to_stdout: true,
        exit_status_to_reason: & &1
      )
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
end
