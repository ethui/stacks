defmodule EthuiWeb.Plugs.StackSubdomain do
  @moduledoc """
    Extracts the subdomain components from the request host for a stack reverse proxy

  e.g.: "graph-my-stack.stacks.lvh.me" -> %{proxy: %{slug: "my-stack", component: "graph"}}
  e.g.: "my-stack.stacks.lvh.me" -> %{proxy: %{slug: "my-stack", component: nil}}
  """

  import Plug.Conn
  require Logger

  alias Plug.Conn
  alias EthuiWeb.Endpoint

  def init(_opts \\ []), do: nil

  def call(conn, _opts) do
    conn
    |> assign(:proxy, get_proxy_from_subdomain(conn))
  end

  def get_proxy_from_subdomain(%Conn{host: request_host}) do
    request_host
    |> extract_subdomain_parts()
    |> parse_proxy_info()
  end

  defp extract_subdomain_parts(request_host) do
    root_domain = get_root_domain()

    cond do
      is_root_or_localhost?(request_host, root_domain) ->
        []

      String.ends_with?(request_host, root_domain) ->
        request_host
        |> String.replace(~r/\.#{Regex.escape(root_domain)}$/, "")
        |> String.split(".")

      true ->
        []
    end
  end

  defp get_root_domain do
    configured_host = host()

    if config()[:is_saas?] do
      String.replace(configured_host, ~r/^stacks\./, "")
    else
      configured_host
    end
  end

  defp is_root_or_localhost?(host, root_domain) do
    host in [root_domain, "localhost", "127.0.0.1", "0.0.0.0"]
  end

  defp parse_proxy_info(subdomain_parts) do
    case subdomain_parts do
      [slug, subdomain] when subdomain in ["stacks", "local"] ->
        parse_slug_and_component(slug)

      _ ->
        nil
    end
  end

  defp parse_slug_and_component(slug_part) do
    case String.split(slug_part, "-", parts: 2) do
      [slug] ->
        %{slug: slug, component: nil}

      [component, slug] ->
        %{slug: slug, component: component}
    end
  end

  defp host, do: Endpoint.config(:url)[:host]

  defp config, do: Application.get_env(:ethui, Ethui.Stacks)
end
