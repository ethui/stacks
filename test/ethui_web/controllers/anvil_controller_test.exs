defmodule EthuiWeb.AnvilControllerTest do
  use EthuiWeb.ConnCase, async: true

  setup do
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end

  test "creates an anvil", %{conn: conn} do
    conn = conn |> post(~p"/api/anvil")
    assert %{"id" => id, "url" => url} = json_response(conn, 201)
    assert is_binary(id)
    assert is_binary(url)
  end

  test "deletes an anvil", %{conn: conn} do
    conn = conn |> post(~p"/api/anvil")
    assert %{"id" => id, "url" => url} = json_response(conn, 201)
    assert is_binary(id)
    assert is_binary(url)

    conn = conn |> delete(~p"/api/anvil/#{id}")
    assert conn.status == 204
  end
end
