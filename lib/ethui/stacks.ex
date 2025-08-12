defmodule Ethui.Stacks do
  alias Ethui.Stacks.{Server, Stack}
  alias Ethui.Repo
  import Ecto.Query, only: [from: 2]
  alias EthuiWeb.Endpoint

  def get_stack(user_id \\ nil, slug) do
    query =
      if user_id do
        from(s in Stack, where: s.slug == ^slug and s.user_id == ^user_id)
      else
        from(s in Stack, where: s.slug == ^slug)
      end

    Repo.one(query)
  end

  def list_stacks(user_id \\ nil) do
    query =
      if user_id do
        from(s in Stack, where: s.user_id == ^user_id)
      else
        Stack
      end

    Repo.all(query)
  end

  def get_urls(stack) do
    urls = %{
      rpc_url: rpc_url(stack.slug),
      ipfs_url: ipfs_url(stack.slug),
      explorer_url: explorer_url(stack.slug),
      graph_url: graph_url(stack.slug),
      graph_rpc_url: graph_rpc_url(stack.slug)
    }

    IO.inspect(stack)

    a = !stack.graph_opts["disabled"]

    IO.inspect(a, label: "Graph enabled?")

    if a do
      urls
      |> Map.put(:graph_url, graph_url(stack.slug))
      |> Map.put(:graph_rpc_url, graph_rpc_url(stack.slug))
    end

    urls
  end

  def rpc_url(slug) do
    base_url(slug)
  end

  def graph_url(slug) do
    "graph-" <> base_url(slug)
  end

  def graph_rpc_url(slug) do
    "graph-rpc-" <> base_url(slug)
  end

  def ipfs_url(slug) do
    "ipfs-" <> base_url(slug)
  end

  def explorer_url(slug) do
    base_url(slug)
  end

  def base_url(slug) do
    slug <> "." <> host()
  end

  def host do
    Endpoint.config(:url)[:host]
  end
end
