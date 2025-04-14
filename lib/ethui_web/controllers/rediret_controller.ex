defmodule EthuiWeb.RedirectController do
  use EthuiWeb, :controller

  def redirect_to_stacks(conn, _params) do
    conn
    |> redirect(to: ~p"/admin/stacks")
    |> Plug.Conn.halt()
  end

  def redirect_to_admin(conn, _params) do
    conn
    |> redirect(to: ~p"/admin")
    |> Plug.Conn.halt()
  end
end
