defmodule EthuiWeb.Api.ApiKeyControllerTest do
  use EthuiWeb.ConnCase, async: true

  alias Ethui.Repo
  alias Ethui.Stacks.Stack
  alias Ethui.Accounts.User

  setup do
    Ecto.Adapters.SQL.Sandbox.checkout(Repo, sandbox: false)
    cleanup()

    # Ensure auth is enabled for all tests
    original_config = Application.get_env(:ethui, EthuiWeb.Plugs.Authenticate, [])
    Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, enabled: true)

    on_exit(fn ->
      Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, original_config)
    end)

    :ok
  end

  defp cleanup do
    Repo.delete_all(Stack)
    Repo.delete_all(User)
  end

  defp create_authenticated_conn(email \\ nil) do
    email = email || "test-#{System.unique_integer([:positive])}@example.com"
    {:ok, user} = Ethui.Accounts.send_verification_code(email)
    {:ok, token} = Ethui.Accounts.generate_token(user)

    Phoenix.ConnTest.build_conn(:post, "http://api.lvh.me", nil)
    |> Plug.Conn.put_req_header("authorization", "Bearer #{token}")
  end

  defp create_stack_conn(slug \\ "slug") do
    create_authenticated_conn()
    |> post(~p"/stacks", %{slug: slug})
  end

  describe "create/2" do
    test "creates api key for stack" do
      conn =
        create_stack_conn()
        |> post(~p"/stacks/slug/api-keys", %{})

      assert response(conn, 201)
    end

    test "return already existing key if its already created" do
      conn =
        create_stack_conn()
        |> post(~p"/stacks/slug/api-keys", %{})

      res = json_response(conn, 201)

      conn
      |> post(~p"/stacks/slug/api-keys", %{})

      res2 = json_response(conn, 201)

      assert res["data"]["token"] == res2["data"]["token"]
    end

    test "return 404 if stack is from other user" do
      slug = "demo"
      create_stack_conn(slug)

      conn =
        create_authenticated_conn("other@email.com")
        |> post(~p"/stacks/#{slug}/api-keys", %{})

      assert response(conn, 404)
    end

    test "return 404 if stack doesn't exist" do
      conn =
        create_authenticated_conn("other@email.com")
        |> post(~p"/stacks/WRONG/api-keys", %{})

      assert response(conn, 404)
    end
  end

  describe "show/2" do
    test "show api key for stack" do
      slug = "slug"

      conn =
        create_stack_conn(slug)
        |> post(~p"/stacks/#{slug}/api-keys", %{})

      res = json_response(conn, 201)
      token = res["data"]["token"]

      conn =
        conn
        |> get(~p"/stacks/#{slug}/api-keys")

      res = json_response(conn, 200)
      assert res["data"]["token"] == token
    end

    test "return 404 if api key doesn't exist" do
      slug = "slug"

      create_stack_conn(slug)

      conn =
        create_authenticated_conn()
        |> get(~p"/stacks/#{slug}/api-keys")

      assert response(conn, 404)
    end

    test "return 404 if stack is from other user" do
      slug = "slug"

      create_stack_conn(slug)
      |> post(~p"/stacks/#{slug}/api-keys", %{})

      conn =
        create_authenticated_conn("other@email.com")
        |> get(~p"/stacks/#{slug}/api-keys")

      assert response(conn, 404)
    end

    test "return 404 if stack doesn't exist" do
      conn =
        create_authenticated_conn()
        |> get(~p"/stacks/WRONG/api-keys")

      assert response(conn, 404)
    end
  end

  describe "delete/2" do
    test "delete api key for stack" do
      slug = "slug"

      conn =
        create_stack_conn(slug)
        |> post(~p"/stacks/#{slug}/api-keys", %{})

      assert response(conn, 201)

      conn =
        create_authenticated_conn()
        |> delete(~p"/stacks/#{slug}/api-keys")

      assert response(conn, 404)

      conn =
        create_authenticated_conn()
        |> get(~p"/stacks/#{slug}/api-keys")

      assert response(conn, 404)
    end

    test "return 404 if api key doesn't exist" do
      slug = "slug"

      create_stack_conn(slug)

      conn =
        create_authenticated_conn()
        |> delete(~p"/stacks/#{slug}/api-keys")

      assert response(conn, 404)
    end

    test "return 404 if stack is from other user" do
      slug = "slug"

      create_stack_conn(slug)
      |> post(~p"/stacks/#{slug}/api-keys", %{})

      conn =
        create_authenticated_conn("other@email.com")
        |> delete(~p"/stacks/#{slug}/api-keys")

      assert response(conn, 404)
    end

    test "return 404 if stack doesn't exist" do
      conn =
        create_authenticated_conn()
        |> delete(~p"/stacks/WRONG/api-keys")

      assert response(conn, 404)
    end
  end
end
