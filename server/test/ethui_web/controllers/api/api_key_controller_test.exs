defmodule EthuiWeb.Api.ApiKeyControllerTest do
  use EthuiWeb.ConnCase, async: false

  setup do
    # Ensure auth is enabled for all tests
    original_config = Application.get_env(:ethui, EthuiWeb.Plugs.Authenticate, [])
    Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, enabled: true)

    on_exit(fn ->
      Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, original_config)
    end)

    :ok
  end

  defp create_authenticated_conn(email \\ nil) do
    email = email || "test-#{System.unique_integer([:positive])}@example.com"
    {:ok, user} = Ethui.Accounts.send_verification_code(email)
    {:ok, token} = Ethui.Accounts.generate_token(user)

    Phoenix.ConnTest.build_conn(:post, "http://api.lvh.me", nil)
    |> Plug.Conn.put_req_header("authorization", "Bearer #{token}")
  end

  defp create_stack_conn(slug) do
    create_authenticated_conn()
    |> post(~p"/stacks", %{slug: slug})
  end

  describe "show/2" do
    test "show api key for stack" do
      slug = "slug"

      conn =
        create_stack_conn(slug)

      conn =
        conn
        |> get(~p"/stacks/#{slug}/api-keys")

      res = json_response(conn, 200)
      assert res["data"]["token"] != nil
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

  describe "update/2" do
    test "rotates api key for stack" do
      slug = "slug"

      conn =
        create_stack_conn(slug)

      # fetch old token
      old_token =
        conn
        |> get(~p"/stacks/#{slug}/api-keys")
        |> json_response(200)
        |> get_in(["data", "token"])

      # rotate key
      conn =
        conn
        |> patch(~p"/stacks/#{slug}/api-keys")

      res = json_response(conn, 200)
      new_token = res["data"]["token"]

      assert new_token != nil
      assert new_token != old_token
    end

    test "returns 404 if stack does not exist" do
      conn =
        create_authenticated_conn()
        |> patch(~p"/stacks/WRONG/api-keys")

      assert response(conn, 404)
    end

    test "returns 404 if stack belongs to another user" do
      slug = "slug"

      create_stack_conn(slug)

      conn =
        create_authenticated_conn("other@email.com")
        |> patch(~p"/stacks/#{slug}/api-keys")

      assert response(conn, 404)
    end

    test "returns 404 if api key does not exist" do
      slug = "slug"

      create_stack_conn(slug)

      conn =
        create_authenticated_conn()
        |> patch(~p"/stacks/#{slug}/api-keys")

      assert response(conn, 404)
    end
  end
end
