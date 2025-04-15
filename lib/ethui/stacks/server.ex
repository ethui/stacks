defmodule Ethui.Stacks.Server do
  @moduledoc """
  GenServer that manages a collection of stacks

  # TODO: A stack is currently composed of a single entity: an `anvil` process, but should eventually hold more
  """

  use GenServer
  require Logger

  alias Ethui.Stacks.{Stack, ServicesSupervisor}
  alias Ethui.Repo

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

    start_all()

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
    case start_stack(opts, state) do
      {:ok, name, pid, new_state} ->
        {:reply, {:ok, name, pid}, new_state}

      error ->
        {:reply, error, state}
    end
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
        Logger.error(inspect(error))
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
        Logger.error(inspect(error))
        {:noreply, state}
    end
  end

  @spec start_stack(map, t) :: {:ok, name, pid, t} | {:error, any}
  defp start_stack(
         %{slug: slug, inserted_at: inserted_at},
         %{supervisor: sup, ports: ports, registry: registry, instances: instances} = state
       ) do
    name = {:via, Registry, {registry, slug}}
    hash = :crypto.hash(:sha256, slug <> to_string(inserted_at)) |> to_string() |> IO.inspect()
    full_opts = [ports: ports, slug: slug, name: name, hash: hash]
    Logger.info("Starting stack #{inspect(name)}")

    case ServicesSupervisor.start_stack(sup, full_opts) do
      {:ok, pid} ->
        {:ok, name, pid, %{state | instances: Map.put(instances, slug, pid)}}

      error ->
        error
    end
  end

  @spec stop_stack(map, map) :: {:ok, t} | {:error, :not_found}
  defp stop_stack(
         %{slug: slug},
         %{supervisor: sup, instances: instances} = state
       ) do
    case Map.fetch(instances, slug) do
      {:ok, pid} ->
        Logger.info("Stopping stack #{inspect(pid)}")
        ServicesSupervisor.stop_stack(sup, pid)
        {:ok, %{state | instances: Map.delete(instances, slug)}}

      :error ->
        {:error, :not_found}
    end
  end

  defp start_all() do
    Stack
    |> Repo.all()
    |> Enum.each(fn stack ->
      send(self(), {{Stack, :inserted}, stack})
    end)
  end

  # extract the slug from what may be a {:via, ...} registry name
  # allows the internal API to deal with either direct slugs or registry names
  defp to_slug({:via, _, {_, slug}}), do: slug
  defp to_slug(slug) when is_binary(slug), do: slug
end
