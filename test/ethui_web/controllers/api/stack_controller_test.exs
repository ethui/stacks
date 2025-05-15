defmodule EthuiWeb.Api.StackControllerTest do
  use EthuiWeb.ConnCase, async: true

  alias Ethui.Repo
  alias Ethui.Stacks.Stack

  setup do
    Ecto.Adapters.SQL.Sandbox.checkout(Repo, sandbox: false)
    cleanup()
    :ok
  end

  defp cleanup do
    Repo.delete_all(Stack)
  end

  describe "create/2" do
    test "creates a stack" do
      slug = "slug"

      conn =
        api_conn()
        |> post(~p"/stacks", %{slug: slug})

      IO.inspect(conn)
      assert response(conn, 201)
    end
  end

  describe "delete/2" do
    test "deletes a stack" do
      conn = api_conn()
      slug = "slug2"

      conn = conn |> post(~p"/stacks", %{slug: slug})
      assert response(conn, 201)

      conn = conn |> delete(~p"/stacks/#{slug}")
      assert conn.status == 204
    end
  end
end
