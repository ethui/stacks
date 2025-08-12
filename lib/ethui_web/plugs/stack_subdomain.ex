defmodule EthuiWeb.Plugs.StackSubdomain do
  @moduledoc """
    Extracts the subdomain components from the request host for a stack reverse proxy

  e.g.: "graph.my-stack.stacks.lvh.me" -> %{proxy: %{slug: "my-stack", component: "graph"}}
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

  defp get_proxy_from_subdomain(%Conn{host: host}) do
    root_host = get_root_host()

    host
    |> IO.inspect(label: "host")
    |> extract_subdomain_parts(root_host)
    |> IO.inspect(label: "2")
    |> parse_proxy_info()
    |> IO.inspect(label: "parse proxy")
  end

  defp get_root_host() do
    if config()[:is_saas?] do
      String.replace(host(), ~r/stacks\./, "")
    else
      host()
    end
  end

  defp extract_subdomain_parts(host, root_host) do
    cond do
      is_local_host?(host, root_host) ->
        []

      true ->
        host
        |> String.replace(~r/.?#{Regex.escape(root_host)}/, "")
        |> String.split(".")
        |> Enum.reject(&(&1 == ""))
    end
  end

  defp is_local_host?(host, root_host) do
    host in [root_host, "localhost", "127.0.0.1", "0.0.0.0"]
  end

  # Parse subdomain components into proxy information
  # tenant.local -> %{slug: "tenant", component: nil}  
  # api-tenant.stacks -> %{slug: "tenant", component: "api"}
  defp parse_proxy_info(parts) do
    IO.inspect(parts, label: "parts")

    case parts do
      [slug_part, env] when env in ["local", "stacks"] ->
        parse_slug_and_component(slug_part)

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
