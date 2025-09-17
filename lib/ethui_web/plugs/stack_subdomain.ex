defmodule EthuiWeb.Plugs.StackSubdomain do
  @moduledoc """
    Extracts the subdomain components from the request host for a stack reverse proxy

  e.g.: "graph-my-stack.lvh.me" -> %{proxy: %{slug: "my-stack", component: "graph"}}
  e.g.: "my-stack.lvh.me" -> %{proxy: %{slug: "my-stack", component: nil}}
  """

  import Plug.Conn
  alias EthuiWeb.Endpoint
  alias Ethui.Stacks

  def init(_opts \\ []), do: nil

  def call(conn, _opts) do
    conn
    |> assign(:proxy, extract_slug_part(conn.host) |> Stacks.parse_slug_and_component())
  end

  defp extract_slug_part(request_host) do
    root_host = host()

    cond do
      request_host in [root_host, "localhost", "127.0.0.1", "0.0.0.0"] ->
        nil

      String.ends_with?(request_host, root_host) ->
        String.replace_suffix(request_host, "." <> root_host, "")

      true ->
        nil
    end
  end

  defp host, do: Endpoint.config(:url)[:host]
end
