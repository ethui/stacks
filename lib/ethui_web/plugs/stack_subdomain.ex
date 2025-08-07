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
    # in the hosted case, we want to keep `stacks` as part of the component. see the matching below
    root_host =
      if config()[:is_saas?] do
        host() |> String.replace(~r/stacks\./, "")
      else
        host()
      end

    components =
      if host in [root_host, "localhost", "127.0.0.1", "0.0.0.0"] do
        []
      else
        host |> String.replace(~r/.?#{root_host}/, "") |> String.split(".")
      end

    case components do
      [slug, subdomain] when subdomain in ["local", "stacks"] ->
        %{slug: slug, component: nil}

      [component, slug, subdomain] when subdomain in ["local", "stacks"] ->
        %{slug: slug, component: component}

      _ ->
        nil
    end
  end

  defp host, do: Endpoint.config(:url)[:host]

  defp config, do: Application.get_env(Ethui.Stacks)
end
