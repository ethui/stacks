defmodule Ethui.Stacks.Server do
  @moduledoc """
  GenServer that manages a collection of stacks

  # TODO: A stack is currently composed of a single entity: an `anvil` process, but should eventually hold more
  """

  alias Ethui.Stacks
  use GenServer

  @type opts() :: [
          supervisor: pid(),
          ports: pid(),
          registry: atom(),
          name: String.t() | nil
        ]

  @type t() :: %{
          supervisor: pid(),
          ports: pid(),
          registry: pid(),
          instances: %{atom() => pid()}
        }

  # the ID of an individual anvil instance
  @type id() :: String.t()
  # the registered name of the anvil GenServer
  @type name() :: {:via, atom(), {atom(), id()}}

  @spec start_link(opts()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: opts[:name])
  end

  #
  # Client
  #

  def start_stack(pid, opts) do
    GenServer.call(pid, {:start_stack, opts})
  end

  def stop_stack(pid, anvil) do
    GenServer.call(pid, {:stop_stack, anvil})
  end

  def list(pid) do
    GenServer.call(pid, :list_anvils)
  end

  #
  # Server
  #

  @impl GenServer
  def init(opts) do
    {:ok,
     %{
       supervisor: opts[:supervisor],
       ports: opts[:ports],
       registry: opts[:registry],
       instances: Map.new()
     }}
  end

  @impl GenServer
  def handle_call(
        {:start_stack, opts},
        _from,
        %{supervisor: sup, ports: ports, registry: registry, instances: instances} = state
      ) do
    id = opts[:id]
    name = {:via, Registry, {registry, id}}
    full_opts = [ports: ports, name: name]
    {:ok, pid} = Stacks.Supervisor.start_stack(sup, full_opts)

    new_state = %{state | instances: Map.put(instances, id, pid)}
    {:reply, {:ok, name, pid}, new_state}
  end

  @impl GenServer
  def handle_call(
        {:stop_stack, id_or_name},
        _from,
        %{supervisor: sup, instances: instances} = state
      ) do
    id = to_id(id_or_name)

    case Map.fetch(instances, id) do
      {:ok, pid} ->
        Stacks.Supervisor.stop_stack(sup, pid)
        {:reply, :ok, %{state | instances: Map.delete(instances, id)}}

      :error ->
        {:reply, {:error, :not_found}, state}
    end
  end

  @impl GenServer
  def handle_call(:list, _from, %{instances: instances} = state) do
    {:reply, Map.keys(instances), state}
  end

  # extract the ID from what may be a {:via, ...} registry name
  # allows the internal API to deal with either direct IDs or registry names
  def to_id({:via, _, {_, id}}), do: id
  def to_id(id) when is_binary(id), do: id
end
