defmodule Ethui.Services.Anvil do
  @moduledoc """
  GenServer that manages a single `anvil` instace

  Requires the pid of a PortManager process, which is used to reserve an HTTP port
  """

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

  #
  # Client

  @spec url(pid()) :: String.t()
  def url(pid) do
    GenServer.call(pid, :url)
  end

  @spec stop(pid()) :: :ok
  def stop(pid) do
    GenServer.cast(pid, :stop)
  end

  #
  # Server
  #

  @impl GenServer
  def init(opts) do
    Process.flag(:trap_exit, true)

    # reserve a port
    {:ok, port} =
      Ethui.Services.HttpPortManager.claim(opts[:port_manager])

    {:ok, proc} = MuonTrap.Daemon.start_link("anvil", ["--port", to_string(port)])

    {:ok, %{port: port, proc: proc}}
  end

  @impl GenServer
  def handle_call(:url, _from, %{port: port} = state) do
    {:reply, "http://localhost:#{port}", state}
  end

  @impl GenServer
  def handle_cast(:stop, %{proc: proc} = state) do
    GenServer.stop(proc)
    {:stop, :normal, state}
  end
end
