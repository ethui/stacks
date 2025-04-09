defmodule Ethui.Services.MultiAnvil do
  alias Ethui.Services.{Anvil, MultiAnvilSupervisor}
  use GenServer

  @type opts() :: [
          supervisor: pid(),
          ports: pid(),
          name: String.t() | nil
        ]

  @type t() :: %{
          supervisor: pid(),
          ports: pid(),
          instances: %{atom() => pid()}
        }

  @spec start_link(opts()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: opts[:name])
  end

  #
  # Client
  #

  def start_anvil(pid, opts) do
    GenServer.call(pid, {:start_anvil, opts})
  end

  def stop_anvil(pid, anvil) do
    GenServer.call(pid, {:stop_anvil, anvil})
  end

  def list(pid) do
    GenServer.call(pid, :list_anvils)
  end

  #
  # Server
  #

  @impl GenServer
  def init(opts) do
    {:ok, %{supervisor: opts[:supervisor], ports: opts[:ports], instances: Map.new()}}
  end

  @impl GenServer
  def handle_call(
        {:start_anvil, opts},
        _from,
        %{supervisor: sup, ports: ports, instances: instances} = state
      ) do
    full_opts = [ports: ports, name: opts[:name]]
    {:ok, pid} = MultiAnvilSupervisor.start_anvil(sup, full_opts)
    {:reply, {:ok, pid}, %{state | instances: Map.put(instances, opts[:name], pid)}}
  end

  @impl GenServer
  def handle_call({:stop_anvil, name}, _from, %{supervisor: sup, instances: instances} = state) do
    case Map.fetch(instances, name) do
      {:ok, pid} ->
        MultiAnvilSupervisor.stop_anvil(sup, pid)
        {:reply, :ok, %{state | instances: Map.delete(instances, name)}}

      :error ->
        {:reply, {:error, :not_found}, state}
    end
  end

  @impl GenServer
  def handle_call(:list, _from, %{instances: instances} = state) do
    {:reply, Map.keys(instances), state}
  end
end

defmodule Ethui.Services.MultiAnvilSupervisor do
  alias Ethui.Services.Anvil
  use DynamicSupervisor

  def start_link(opts \\ []) do
    DynamicSupervisor.start_link(__MODULE__, opts, name: opts[:name])
  end

  @impl DynamicSupervisor
  def init(_opts) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def start_anvil(pid, opts) do
    spec = {Anvil, opts}
    DynamicSupervisor.start_child(pid, spec)
  end

  def stop_anvil(pid, anvil) do
    DynamicSupervisor.terminate_child(pid, anvil)
  end
end
