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
  @reserved ~w(rpc)

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
      rpc_url: rpc_url(stack.slug, stack.api_key),
      ipfs_url: ipfs_url(stack.slug, stack.api_key),
      explorer_url: explorer_url(stack.slug, stack.api_key)
    }

    if graph_enabled?(stack) do
      Map.merge(base_urls, %{
        graph_url: graph_url(stack.slug, stack.api_key),
        graph_rpc_url: graph_rpc_url(stack.slug, stack.api_key),
        graph_status: graph_status(stack.slug, stack.api_key)
      })
    else
      base_urls
    end
  end

  def rpc_url(slug, api_key), do: build_url(slug, api_key)
  def graph_url(slug, api_key), do: build_url("graph", slug, api_key)
  def graph_rpc_url(slug, api_key), do: build_url("graph-rpc", slug, api_key)
  def graph_status(slug, api_key), do: build_url("graph-status", slug, api_key)
  def ipfs_url(slug, api_key), do: build_url("ipfs", slug, api_key)
  def explorer_url(slug, api_key), do: build_url(slug, api_key)

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

  def create_stack(nil, params) do
    Stack.create_changeset(params)
    |> Repo.insert()
  end

  def create_stack(user, params) do
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

  defp build_url(slug, %ApiKey{} = api_key) do
    "#{http_protocol()}#{slug}.#{host()}/#{api_key.token}"
  end

  defp build_url(slug, _) do
    "#{http_protocol()}#{slug}.#{host()}"
  end

  defp build_url(component, slug, %ApiKey{} = api_key) do
    "#{http_protocol()}#{component}-#{slug}.#{host()}/#{api_key.token}"
  end

  defp build_url(component, slug, _) do
    "#{http_protocol()}#{component}-#{slug}.#{host()}"
  end

  defp graph_enabled?(stack) do
    !!stack.graph_opts["enabled"]
  end

  defp anvil_opts?(stack) do
    map_size(stack.anvil_opts) > 0
  end

  defp http_protocol do
    if saas?(), do: "https://", else: "http://"
  end

  defp host do
    Endpoint.config(:url)[:host]
  end

  defp saas? do
    config()[:is_saas?] || false
  end

  defp config, do: Application.get_env(:ethui, Ethui.Stacks)
end
