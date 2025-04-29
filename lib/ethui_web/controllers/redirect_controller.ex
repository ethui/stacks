defmodule EthuiWeb.RedirectController do
  use EthuiWeb, :controller

  def redirect_to_stacks(conn, _params) do
    conn
    |> redirect(to: ~p"/stacks")
    |> Plug.Conn.halt()
  end
end
