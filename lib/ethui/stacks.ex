defmodule Ethui.Stacks do
  @moduledoc """
  Stacks context module
  """

  alias EthuiWeb.Endpoint

  def get_urls(stack) do
    urls = %{
      rpc_url: rpc_url(stack.slug),
      ipfs_url: ipfs_url(stack.slug),
      explorer_url: explorer_url(stack.slug),
      graph_url: graph_url(stack.slug),
      graph_rpc_url: graph_rpc_url(stack.slug)
    }

    if !!stack.graph_opts["enabled"] do
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
    slug <> subdomain() <> host()
  end

  def subdomain do
    if config()[:is_saas?] do
      ".stacks."
    else
      ".local."
    end
  end

  def host do
    Endpoint.config(:url)[:host]
  end

  defp config, do: Application.get_env(:ethui, Ethui.Stacks)
end
