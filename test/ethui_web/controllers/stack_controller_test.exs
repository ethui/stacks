defmodule EthuiWeb.StackControllerTest do
  use EthuiWeb.ConnCase, async: true

  alias Ethui.Repo
  alias Ethui.Stacks.Stack

  setup do
    Ecto.Adapters.SQL.Sandbox.checkout(Repo, sandbox: false)

    cleanup()

    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end

  defp cleanup do
    Repo.delete_all(Stack)
  end

  describe "create/2" do
    test "creates a stack", %{conn: conn} do
      slug = "slug"
      conn = conn |> post(~p"/api/stacks", %{slug: slug})
      assert json_response(conn, 201)
    end
  end

  describe "delete/2" do
    test "deletes a stack", %{conn: conn} do
      slug = "slug2"
      conn = conn |> post(~p"/api/stacks", %{slug: slug})
      assert json_response(conn, 201)

      conn = conn |> delete(~p"/api/stacks/#{slug}")
      assert conn.status == 204
    end
  end
end
