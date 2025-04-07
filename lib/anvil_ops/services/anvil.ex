defmodule AnvilOps.Services.Anvil do
  use GenServer
  require Logger

  @type opts() :: [
          # the port manager process to use
          port_manager: pid(),
          name: String.t() | nil
        ]

  @spec start_link(opts()) :: GenServer.on_start()
  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: opts[:name])
  end

  # Client

  def url(pid) do
    GenServer.call(pid, :url)
  end

  def stop(pid) do
    GenServer.cast(pid, :stop)
  end

  # Server

  def init(opts) do
    Process.flag(:trap_exit, true)

    # reserve a port
    {:ok, port} =
      AnvilOps.Services.HttpPortManager.claim(opts[:port_manager])

    {:ok, proc} = MuonTrap.Daemon.start_link("anvil", ["--port", to_string(port)])

    {:ok, %{port: port, proc: proc}}
  end

  def handle_call(:url, _from, %{port: port} = state) do
    {:reply, "http://localhost:#{port}", state}
  end

  def handle_cast(:stop, %{proc: proc} = state) do
    GenServer.stop(proc)
    {:stop, :normal, state}
  end
end
