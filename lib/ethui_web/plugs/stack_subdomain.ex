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
    root_host = Endpoint.config(:url)[:host]

    # in the hosted case, we want to keep `stacks` as part of the component. see the matching below
    if root_host == "stacks.ethui.dev" do
      root_host = "ethui.dev"
    end

    components =
      if host in [root_host, "localhost", "127.0.0.1", "0.0.0.0"] do
        []
      else
        host |> String.replace(~r/.?#{root_host}/, "") |> String.split(".") |> Enum.reverse()
      end

    Logger.debug("subdomain components: #{inspect(components)}")

    case components do
      ["stacks", slug] ->
        %{slug: slug, component: nil}

      ["stacks", slug, component] ->
        %{slug: slug, component: component}

      ["local", slug] ->
        %{slug: slug, component: nil}

      ["local", slug, component] ->
        %{slug: slug, component: component}

      _ ->
        nil
    end
  end
end
