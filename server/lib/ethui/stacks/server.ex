defmodule Ethui.Stacks.Server do
  @moduledoc """
    GenServer that manages a collection of stacks
    # TODO: A stack is currently composed of a single entity: an `anvil` process, but should eventually hold more
  """

  use GenServer
  require Logger

  alias Ethui.Stacks.{Stack, MultiStackSupervisor}
  alias Ethui.Stacks
  alias Ethui.Services.{Anvil, Graph}

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

  # create
  def create(%Stack{} = stack) do
    GenServer.call(__MODULE__, {:create, stack})
  end

  def create_async(%Stack{} = stack) do
    GenServer.cast(__MODULE__, {:create_async, stack})
  end

  def destroy(%Stack{} = stack) do
    GenServer.call(__MODULE__, {:destroy, stack})
  end

  def suspend(%Stack{} = stack) do
    GenServer.call(__MODULE__, {:suspend, stack})
  end

  def resume(%Stack{} = stack) do
    GenServer.call(__MODULE__, {:destroy, stack})
  end

  # adicionar public api aqui, nao queromos interagir com o anvil diretamente 

  def anvil_url(slug) do
    with [{pid, _}] <- Registry.lookup(Ethui.Stacks.Registry, {slug, :anvil}),
         :ok <- Anvil.ensure_running(pid),
         url when not is_nil(url) <- Anvil.url(pid) do
      {:ok, url}
    else
      _ ->
        {:error, "Stack not found"}
    end
  end

  def graph_ip_from_slug(proxied_path, slug, target_port) do
    case Graph.ip_from_slug(slug) do
      {:ok, ip} -> {:ok, "http://#{ip}:#{target_port}/#{Enum.join(proxied_path, "/")}"}
      _ -> {:error, "Stack not found"}
    end
  end

  def subscribe_logs(id) do
    GenServer.cast(id, {:subscribe_logs, self()})
  end

  def unsubscribe_logs(id) do
    GenServer.cast(id, {:unsubscribe_logs, self()})
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
  def handle_call({:create, opts}, _from, state) do
    case create_stack(opts, state) do
      {:ok, pid, new_state} ->
        {:reply, {:ok, pid}, new_state}

      error ->
        Logger.error(inspect(error))
        {:reply, error, state}
    end
  end

  @impl GenServer
  def handle_call(
        {:destroy, stack},
        _from,
        state
      ) do
    case destroy_stack(stack, state) do
      {:ok, new_state} ->
        {:reply, :ok, new_state}

      error ->
        Logger.error(inspect(error))
        {:reply, {:error, :not_found}, state}
    end
  end

  @impl GenServer
  def handle_call(:list, _from, %{instances: instances} = state) do
    {:reply, Map.keys(instances), state}
  end

  @impl GenServer
  def handle_cast({:create_async, stack}, state) do
    case create_stack(stack, state) do
      {:ok, _pid, new_state} ->
        {:noreply, new_state}

      error ->
        Logger.error(inspect(error))
        {:noreply, state}
    end
  end

  @impl GenServer
  def handle_cast({:stop, stack}, state) do
    case destroy_stack(stack, state) do
      {:ok, new_state} ->
        {:noreply, new_state}

      error ->
        Logger.error(inspect(error))
        {:noreply, state}
    end
  end

  @spec create_stack(map, t) :: {:ok, pid, t} | {:error, any}
  defp create_stack(
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
    Logger.info("creating stack #{slug}")

    case MultiStackSupervisor.create_stack(full_opts) do
      {:ok, pid} ->
        {:ok, pid, %{state | instances: Map.put(instances, slug, pid)}}

      error ->
        error
    end
  end

  @spec destroy_stack(map, map) :: {:ok, t} | {:error, :not_found}
  defp destroy_stack(
         %{slug: slug},
         %{instances: instances} = state
       ) do
    case Map.fetch(instances, slug) do
      {:ok, pid} ->
        Logger.info("Destroying stack #{slug} #{inspect(pid)}")
        MultiStackSupervisor.destroy_stack(pid)
        {:ok, %{state | instances: Map.delete(instances, slug)}}

      :error ->
        {:error, :not_found}
    end
  end

  defp start_all do
    Stacks.list_stacks()
    |> Enum.each(fn stack ->
      # this function starts all the stacks on the init function , we can't use 
      # a sync call because the process calling itself and it creates a deadlock.
      # We also don't want to create it directly on the init since we would block
      # the the supervisor for this process (i think).
      create_async(stack)
    end)
  end

  # extract the slug from what may be a {:via, ...} registry name
  # allows the internal API to deal with either direct slugs or registry names
  defp to_slug({:via, _, {_, slug}}), do: slug
  defp to_slug(slug) when is_binary(slug), do: slug
end
