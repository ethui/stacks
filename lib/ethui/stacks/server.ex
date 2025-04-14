defmodule Ethui.Stacks.Server do
  @moduledoc """
  GenServer that manages a collection of stacks

  # TODO: A stack is currently composed of a single entity: an `anvil` process, but should eventually hold more
  """

  use GenServer
  require Logger

  alias Ethui.Stacks.{Stack, ServicesSupervisor}

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
    :ok = EctoWatch.subscribe({Stack, :inserted})
    :ok = EctoWatch.subscribe({Stack, :updated})
    :ok = EctoWatch.subscribe({Stack, :deleted})

    {:ok,
     %{
       supervisor: opts[:supervisor],
       ports: opts[:ports],
       registry: opts[:registry],
       instances: Map.new()
     }}
  end

  @impl GenServer
  def handle_call({:start_stack, opts}, _from, state) do
    {:ok, name, pid, new_state} =
      start_stack(opts, state)

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
        ServicesSupervisor.stop_stack(sup, pid)
        {:reply, :ok, %{state | instances: Map.delete(instances, slug)}}

      :error ->
        {:reply, {:error, :not_found}, state}
    end
  end

  @impl GenServer
  def handle_call(:list, _from, %{instances: instances} = state) do
    {:reply, Map.keys(instances), state}
  end

  @impl GenServer
  def handle_info({{Stack, :inserted}, stack}, state) do
    case start_stack(stack, state) do
      {:ok, _name, _pid, new_state} ->
        {:noreply, new_state}

      error ->
        Logger.error(error)
        {:noreply, state}
    end
  end

  @impl GenServer
  def handle_info({{Stack, :updated}, _stack}, state) do
    {:noreply, state}
  end

  @impl GenServer
  def handle_info({{Stack, :deleted}, stack}, state) do
    case stop_stack(stack, state) do
      {:ok, new_state} ->
        {:noreply, new_state}

      error ->
        Logger.error(error)
        {:noreply, state}
    end
  end

  @spec start_stack(map, t) :: {:ok, name, pid, t}
  defp start_stack(
         %{slug: slug},
         %{supervisor: sup, ports: ports, registry: registry, instances: instances} = state
       ) do
    name = {:via, Registry, {registry, slug}}
    full_opts = [ports: ports, name: name]
    # TODO: can this fail?
    {:ok, pid} = ServicesSupervisor.start_stack(sup, full_opts)

    {:ok, name, pid, %{state | instances: Map.put(instances, slug, pid)}}
  end

  @spec stop_stack(map, map) :: {:ok, t} | {:error, :not_found}
  defp stop_stack(
         %{slug: slug},
         %{supervisor: sup, instances: instances} = state
       ) do
    case Map.fetch(instances, slug) do
      {:ok, pid} ->
        ServicesSupervisor.stop_stack(sup, pid)
        {:ok, %{state | instances: Map.delete(instances, slug)}}

      :error ->
        {:error, :not_found}
    end
  end

  # extract the slug from what may be a {:via, ...} registry name
  # allows the internal API to deal with either direct slugs or registry names
  defp to_slug({:via, _, {_, slug}}), do: slug
  defp to_slug(slug) when is_binary(slug), do: slug
end
