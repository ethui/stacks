defmodule EthuiWeb.ProxyController do
  use EthuiWeb, :controller

  alias Ethui.Proxy

  action_fallback EthuiWeb.FallbackController

  def reverse_proxy(
        %Plug.Conn{assigns: %{proxy: proxy}} = conn,
        params
      ) do
    Proxy.handle(conn, proxy, params)
  end

  def reverse_proxy(conn, _params),
    do: send_resp(conn, :not_found, "Not found")
end
