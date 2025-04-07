defmodule AnvilOps.Services.Anvil do
  alias Porcelain.Process, as: Proc
  use GenServer
  require Logger

  @type opts() :: [
          # the port manager process to use
          port_manager: pid()
        ]

  @type t() :: %{
          # the port assigned to this instance
          port: pos_integer(),
          # the external anvil process
          proc: Proc.t()
        }

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
    {:ok, port} =
      AnvilOps.Services.HttpPortManager.claim(opts[:port_manager])

    proc = Porcelain.spawn("anvil", ["--port", to_string(port)], out: :stream)
    # TODO: detect early failures

    {:ok, %{port: port, proc: proc}}
  end

  def handle_call(:url, _from, %{port: port} = state) do
    {:reply, "http://localhost:#{port}", state}
  end

  def handle_cast(:stop, state) do
    {:stop, :normal, state}
  end

  def terminate(_, %{proc: proc}) do
    IO.inspect(proc)
    # :os.cmd("kill -SIGINT #{proc.pid}")
    Proc.stop(proc) |> IO.inspect()
    :ok
  end
end
