defmodule Ethui.Proxy do
  alias Ethui.Proxy.Router
  alias Ethui.Proxy.Http
  alias Ethui.Proxy.WebSocket

  def handle(conn, proxy, params) do
    with {:ok, url} <- Router.resolve(proxy, params) do
      dispatch(conn, url)
    end
  end

  def dispatch(conn, url) do
    if websocket_upgrade?(conn) do
      websocket(conn, url)
    else
      http(conn, url)
    end
  end

  defp websocket_upgrade?(conn) do
    conn
    |> Plug.Conn.get_req_header("upgrade")
    |> Enum.any?(&(String.downcase(&1) == "websocket"))
  end

  defp websocket(conn, url) do
    WebSockAdapter.upgrade(
      conn,
      WebSocket,
      %{target_url: url},
      timeout: 60_000
    )
  end

  defp http(conn, url) do
    Http.forward(conn, url)
  end
end
