defmodule EthuiWeb.StackControllerTest do
  use EthuiWeb.ConnCase, async: true

  setup do
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end

  describe "create/2" do
    test "creates a stack", %{conn: conn} do
      slug = "slug"
      conn = conn |> post(~p"/api/stacks", %{slug: slug})
      assert %{"slug" => ^slug, "anvil" => %{"url" => url}} = json_response(conn, 201)
      assert is_binary(url)
    end
  end

  describe "delete/2" do
    test "deletes a stack", %{conn: conn} do
      slug = "slug2"
      conn = conn |> post(~p"/api/stacks", %{slug: slug})
      assert %{"slug" => ^slug, "anvil" => %{"url" => _}} = json_response(conn, 201)

      conn = conn |> delete(~p"/api/stacks/#{slug}")
      assert conn.status == 204
    end
  end
end
