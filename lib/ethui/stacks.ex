defmodule Ethui.Stacks do
  @moduledoc """
  Stacks context module
  """
  alias EthuiWeb.Endpoint

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

  def get_urls(stack) do
    base_urls = %{
      rpc_url: rpc_url(stack.slug),
      ipfs_url: ipfs_url(stack.slug),
      explorer_url: explorer_url(stack.slug)
    }

    if graph_enabled?(stack) do
      Map.merge(base_urls, %{
        graph_url: graph_url(stack.slug),
        graph_rpc_url: graph_rpc_url(stack.slug),
        graph_status: graph_status(stack.slug)
      })
    else
      base_urls
    end
  end

  def rpc_url(slug), do: build_url(slug)
  def graph_url(slug), do: build_url("graph", slug)
  def graph_rpc_url(slug), do: build_url("graph-rpc", slug)
  def graph_status(slug), do: build_url("graph-status", slug)
  def ipfs_url(slug), do: build_url("ipfs", slug)
  def explorer_url(slug), do: build_url(slug)

  defp build_url(slug) do
    "#{http_protocol()}#{slug}.#{host()}"
  end

  defp build_url(component, slug) do
    "#{http_protocol()}#{component}-#{slug}.#{host()}"
  end

  defp graph_enabled?(stack) do
    !!stack.graph_opts["enabled"]
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
