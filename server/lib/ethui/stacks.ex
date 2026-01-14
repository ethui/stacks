defmodule Ethui.Stacks do
  @moduledoc """
  Stacks context module
  """
  alias EthuiWeb.Endpoint
  alias Ethui.Stacks.Server
  alias Ethui.Stacks.Stack
  alias Ethui.Accounts
  alias Ethui.Accounts.User
  alias Ethui.Accounts.ApiKey

  alias Ethui.Repo
  import Ecto.Query, only: [from: 2]

  @components ~w(graph graph-rpc graph-status ipfs)
  @reserved ~w(rpc api)
  @max_stacks_per_user 5
  @max_total_stacks 250

  def components, do: @components

  # prevents slugs starting with rpc that would break the subdmonain for the graph component to link to graph-rpc*
  def reserved_slug_prefixes, do: Enum.uniq(@components ++ @reserved)

  def reserved_slug_prefixes_regex do
    prefixes =
      reserved_slug_prefixes()
      |> Enum.map_join("-|", &Regex.escape/1)

    Regex.compile!("^(?!(" <> prefixes <> "-)).*$")
  end

  def parse_slug_and_component(nil),
    do: %{slug: nil, component: nil}

  def parse_slug_and_component(slug_part) when is_binary(slug_part) do
    case String.split(slug_part, "-", parts: 2) do
      # We need this check so slugs with a dash in them don't enter here incorrectly
      [maybe_component, rest] when maybe_component in @components ->
        %{slug: rest, component: maybe_component}

      _other ->
        %{slug: slug_part, component: nil}
    end
  end

  def get_info(stack) do
    running_slugs = Server.list()

    urls = get_urls(stack)

    info =
      Map.merge(
        %{
          slug: stack.slug,
          status: if(stack.slug in running_slugs, do: "running", else: "stopped"),
          chain_id: chain_id(stack.id),
          inserted_at: stack.inserted_at |> DateTime.to_unix(),
          updated_at: stack.updated_at |> DateTime.to_unix()
        },
        urls
      )

    if anvil_opts?(stack) do
      Map.merge(info, %{anvil_opts: stack.anvil_opts})
    else
      info
    end
  end

  def get_urls(stack) do
    base_urls = %{
      # deprecated
      rpc_url: http_rpc_url(stack),
      ipfs_url: ipfs_url(stack),
      explorer_url: explorer_url(stack),

      # new ones
      http_rpc: http_rpc_url(stack),
      ws_rpc: ws_rpc_url(stack),
      explorer: explorer_url(stack)
    }

    if graph_enabled?(stack) do
      Map.merge(base_urls, %{
        graph_url: graph_url(stack),
        graph_rpc_url: graph_rpc_url(stack),
        graph_status: graph_status(stack)
      })
    else
      base_urls
    end
  end

  def http_rpc_url(stack), do: build_url(http(), stack)
  def ws_rpc_url(stack), do: build_url(ws(), stack)
  def graph_url(stack), do: build_url(http(), "graph", stack)
  def graph_rpc_url(stack), do: build_url(http(), "graph-rpc", stack)
  def graph_status(stack), do: build_url(http(), "graph-status", stack)
  def ipfs_url(stack), do: build_url(http(), "ipfs", stack)
  def explorer_url(stack), do: build_url(http(), stack)

  def chain_id(id) do
    prefix = config() |> Keyword.fetch!(:chain_id_prefix)
    <<val::32>> = <<prefix::16, id::16>>

    val
  end

  @doc "Gets a stack by ID"
  def get_stack(id) do
    Repo.get(Stack, id)
  end

  def get_stack_by_slug(slug) do
    Repo.get_by(Stack, slug: slug)
    |> Repo.preload(:api_key)
  end

  def list_stacks(user) do
    if user do
      Repo.all(from(s in Stack, where: s.user_id == ^user.id))
      |> Repo.preload(:api_key)
    else
      Repo.all(Stack)
    end
  end

  def create_stack(user, params) do
    with :ok <- check_user_limit(user.id),
         :ok <- check_global_limit() do
      params = Map.put(params, "user_id", user.id)

      Ecto.Multi.new()
      |> Ecto.Multi.insert(
        :stack,
        Stack.create_changeset(params)
      )
      |> Ecto.Multi.run(:api_key, fn _repo, %{stack: stack} ->
        Accounts.create_api_key(stack)
      end)
      |> Ecto.Multi.run(:stack_with_api_key, fn repo, %{stack: stack} ->
        {:ok, repo.preload(stack, :api_key)}
      end)
      |> Repo.transaction()
      |> case do
        {:ok, %{stack: stack}} ->
          {:ok, stack}

        {:error, _, changeset, _} ->
          {:error, changeset}
      end
    end
  end

  def get_user_stack_by_slug(nil, slug) do
    Repo.get_by(Stack, slug: slug)
    |> Repo.preload(:api_key)
  end

  def get_user_stack_by_slug(%User{id: user_id}, slug) do
    get_user_stack_by_slug(user_id, slug)
  end

  def get_user_stack_by_slug(user_id, slug) do
    Repo.get_by(Stack, slug: slug, user_id: user_id)
    |> Repo.preload(:api_key)
  end

  def delete_stack(stack) do
    Repo.delete(stack)
  end

  defp build_url(proto, %Stack{slug: slug, api_key: %ApiKey{token: token}}) do
    "#{proto}#{slug}.#{host()}/#{token}"
  end

  defp build_url(proto, %Stack{slug: slug}) do
    "#{proto}#{slug}.#{host()}"
  end

  defp build_url(proto, component, %Stack{slug: slug, api_key: %ApiKey{token: token}}) do
    "#{proto}#{component}-#{slug}.#{host()}/#{token}"
  end

  defp build_url(proto, component, %Stack{slug: slug}) do
    "#{proto}#{component}-#{slug}.#{host()}"
  end

  defp check_user_limit(user_id) do
    if count_user_stacks(user_id) >= @max_stacks_per_user do
      {:error, :user_limit_exceeded}
    else
      :ok
    end
  end

  defp check_global_limit do
    if count_total_stacks() >= @max_total_stacks do
      {:error, :global_limit_exceeded}
    else
      :ok
    end
  end

  def create_stack(nil, params) do
    with :ok <- check_global_limit() do
      Stack.create_changeset(params)
      |> Repo.insert()
    end
  end

  defp count_user_stacks(user_id) do
    from(s in Stack, where: s.user_id == ^user_id, select: count(s.id))
    |> Repo.one()
  end

  defp count_total_stacks do
    from(s in Stack, select: count(s.id))
    |> Repo.one()
  end

  defp graph_enabled?(stack) do
    !!stack.graph_opts["enabled"]
  end

  defp anvil_opts?(stack) do
    map_size(stack.anvil_opts) > 0
  end

  defp http do
    if saas?(), do: "https://", else: "http://"
  end

  defp ws do
    if saas?(), do: "wss://", else: "ws://"
  end

  defp host do
    Endpoint.config(:url)[:host]
  end

  defp saas? do
    config()[:is_saas?] || false
  end

  defp config, do: Application.get_env(:ethui, Ethui.Stacks)
end
