defmodule Ethui.Stacks.Server do
  @moduledoc """
  GenServer that manages a collection of stacks

  # TODO: A stack is currently composed of a single entity: an `anvil` process, but should eventually hold more
  """

  alias Ethui.Stacks
  use GenServer

  @type opts :: [
          supervisor: pid,
          ports: pid,
          registry: atom,
          name: atom | nil
        ]

  # state
  @type t :: %{
          supervisor: pid,
          ports: pid,
          registry: pid,
          instances: %{slug => pid}
        }

  # the slug of an individual anvil instance
  @type slug :: String.t()
  # the registered name of the anvil GenServer
  @type name :: {:via, atom, {atom, slug}}

  @spec start_link(opts) :: GenServer.on_start()
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: opts[:name])
  end

  #
  # Client
  #

  @doc "Starts a new stack with a given slug"
  @spec start_stack(atom, slug: slug) :: {:ok, name, pid} | {:error, any}
  def start_stack(pid, opts) do
    GenServer.call(pid, {:start_stack, opts})
  end

  @doc "Stops a stack"
  @spec stop_stack(atom, slug | name) :: :ok | {:error, :not_found}
  def stop_stack(pid, anvil) do
    GenServer.call(pid, {:stop_stack, anvil})
  end

  @doc "List all stacks"
  @spec list(atom) :: [slug]
  def list(pid) do
    GenServer.call(pid, :list)
  end

  #
  # Server
  #

  @spec init(opts) :: {:ok, t}
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
    slug = opts[:slug]
    name = {:via, Registry, {registry, slug}}
    full_opts = [ports: ports, name: name]
    {:ok, pid} = Stacks.ServicesSupervisor.start_stack(sup, full_opts)

    new_state = %{state | instances: Map.put(instances, slug, pid)}
    {:reply, {:ok, name, pid}, new_state}
  end

  @impl GenServer
  def handle_call(
        {:stop_stack, slug_or_name},
        _from,
        %{supervisor: sup, instances: instances} = state
      ) do
    slug = to_slug(slug_or_name)

    case Map.fetch(instances, slug) do
      {:ok, pid} ->
        Stacks.ServicesSupervisor.stop_stack(sup, pid)
        {:reply, :ok, %{state | instances: Map.delete(instances, slug)}}

      :error ->
        {:reply, {:error, :not_found}, state}
    end
  end

  @impl GenServer
  def handle_call(:list, _from, %{instances: instances} = state) do
    {:reply, Map.keys(instances), state}
  end

  # extract the slug from what may be a {:via, ...} registry name
  # allows the internal API to deal with either direct slugs or registry names
  def to_slug({:via, _, {_, slug}}), do: slug
  def to_slug(slug) when is_binary(slug), do: slug
end
