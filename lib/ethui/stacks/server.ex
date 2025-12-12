defmodule Ethui.Stacks.Server do
  @moduledoc """
    GenServer that manages a collection of stacks
    # TODO: A stack is currently composed of a single entity: an `anvil` process, but should eventually hold more
  """

  use GenServer
  require Logger

  alias Ethui.Stacks.{Stack, MultiStackSupervisor}
  alias Ethui.Repo

  # state
  @type t :: %{
          instances: %{slug => pid}
        }

  # the slug of an individual anvil instance
  @type slug :: String.t()
  # the registered name of the anvil GenServer
  @type name :: {:via, atom, {atom, slug}}

  @spec start_link([]) :: GenServer.on_start()
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  #
  # Client
  #

  @doc "List all stacks"
  @spec list :: [slug]
  def list do
    GenServer.call(__MODULE__, :list)
  end

  @doc "Check if a stack with the given slug is running"
  @spec is_slug_running?(slug) :: boolean
  def is_slug_running?(slug) do
    GenServer.call(__MODULE__, {:is_slug_running, slug})
  end

  def start(%Stack{} = stack) do
    GenServer.cast(__MODULE__, {:start, stack})
  end

  def stop(%Stack{} = stack) do
    GenServer.cast(__MODULE__, {:stop, stack})
  end

  #
  # Server
  #

  @spec init([]) :: {:ok, t}
  @impl GenServer
  def init(_) do
    start_all()

    {:ok,
     %{
       instances: Map.new()
     }}
  end

  @impl GenServer
  def handle_call({:start_stack, opts}, _from, state) do
    case start_stack(opts, state) do
      {:ok, pid, new_state} ->
        {:reply, {:ok, pid}, new_state}

      error ->
        {:reply, error, state}
    end
  end

  @impl GenServer
  def handle_call(
        {:stop_stack, slug_or_name},
        _from,
        %{instances: instances} = state
      ) do
    slug = to_slug(slug_or_name)

    case Map.fetch(instances, slug) do
      {:ok, pid} ->
        MultiStackSupervisor.stop_stack(pid)
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
  def handle_call({:is_slug_running, slug}, _from, %{instances: instances} = state) do
    {:reply, Map.has_key?(instances, slug), state}
  end

  @impl GenServer
  def handle_cast({:start, stack}, state) do
    case start_stack(stack, state) do
      {:ok, _pid, new_state} ->
        {:noreply, new_state}

      error ->
        Logger.error(inspect(error))
        {:noreply, state}
    end
  end

  @impl GenServer
  def handle_cast({:stop, stack}, state) do
    case stop_stack(stack, state) do
      {:ok, new_state} ->
        {:noreply, new_state}

      error ->
        Logger.error(inspect(error))
        {:noreply, state}
    end
  end

  @spec start_stack(map, t) :: {:ok, pid, t} | {:error, any}
  defp start_stack(
         %{
           id: id,
           slug: slug,
           anvil_opts: anvil_opts,
           graph_opts: graph_opts,
           inserted_at: inserted_at
         },
         %{instances: instances} = state
       ) do
    hash =
      :crypto.hash(:sha256, slug <> to_string(inserted_at))
      |> Base.encode16()
      |> binary_part(0, 8)
      |> String.downcase()

    full_opts = [id: id, slug: slug, hash: hash, anvil_opts: anvil_opts, graph_opts: graph_opts]
    Logger.info("Starting stack #{slug}")

    case MultiStackSupervisor.start_stack(full_opts) do
      {:ok, pid} ->
        {:ok, pid, %{state | instances: Map.put(instances, slug, pid)}}

      error ->
        error
    end
  end

  @spec stop_stack(map, map) :: {:ok, t} | {:error, :not_found}
  defp stop_stack(
         %{slug: slug},
         %{instances: instances} = state
       ) do
    case Map.fetch(instances, slug) do
      {:ok, pid} ->
        Logger.info("Stopping stack #{inspect(pid)}")
        MultiStackSupervisor.stop_stack(pid)
        {:ok, %{state | instances: Map.delete(instances, slug)}}

      :error ->
        {:error, :not_found}
    end
  end

  defp start_all do
    Stack
    |> Repo.all()
    |> Enum.each(fn stack ->
      start(stack)
    end)
  end

  # extract the slug from what may be a {:via, ...} registry name
  # allows the internal API to deal with either direct slugs or registry names
  defp to_slug({:via, _, {_, slug}}), do: slug
  defp to_slug(slug) when is_binary(slug), do: slug
end
