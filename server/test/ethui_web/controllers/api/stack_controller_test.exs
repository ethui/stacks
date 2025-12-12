defmodule EthuiWeb.Api.StackControllerTest do
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

  describe "create/2" do
    test "creates a stack" do
      slug = "slug"

      conn =
        create_authenticated_conn()
        |> post(~p"/stacks", %{slug: slug})

      assert response(conn, 201)
    end

    test "creates a stack with optional arguments" do
      slug = "slug"

      conn =
        create_authenticated_conn()
        |> post(~p"/stacks", %{
          slug: slug,
          anvil_opts: %{"fork_url" => "wss://mainnet.gateway.tenderly.co"},
          graph_opts: %{"enabled" => true}
        })

      assert response(conn, 201)
    end

    test "creates a stack and returns urls" do
      slug = "slug"

      conn =
        create_authenticated_conn()
        |> post(~p"/stacks", %{slug: slug})

      assert json_response(conn, 201)["data"]["urls"] != nil
    end

    test "returns 404 when stacks uses invalid slug" do
      slugs = ["graph-test", "graph-rpc-test", "rpc-test", "ipfs-test"]

      conn = create_authenticated_conn()

      slugs
      |> Enum.map(fn slug ->
        conn = conn |> post(~p"/stacks", %{slug: slug})

        assert json_response(conn, 422)["error"] ==
                 "[slug: {\"has invalid format\", [validation: :format]}]"
      end)
    end
  end

  describe "delete/2" do
    test "deletes a stack owned by the authenticated user" do
      conn = create_authenticated_conn()
      slug = "slug2"

      conn = conn |> post(~p"/stacks", %{slug: slug})
      assert response(conn, 201)

      conn = conn |> delete(~p"/stacks/#{slug}")
      assert conn.status == 204
    end

    test "returns 403 when trying to delete a stack owned by another user" do
      # Create a stack with first user
      conn1 = create_authenticated_conn("user1@example.com")
      slug = "slug3"
      conn1 |> post(~p"/stacks", %{slug: slug})

      # Try to delete with second user
      conn2 = create_authenticated_conn("user2@example.com")
      conn2 = conn2 |> delete(~p"/stacks/#{slug}")
      assert conn2.status == 403
      assert json_response(conn2, 403)["error"] == "unauthorized"
    end

    test "returns 404 when stack does not exist" do
      conn = create_authenticated_conn()
      conn = conn |> delete(~p"/stacks/nonexistent")
      assert conn.status == 404
    end
  end

  describe "index/2" do
    test "only shows stacks owned by the authenticated user" do
      # Create stacks with first user
      conn1 = create_authenticated_conn("user1@example.com")
      conn1 |> post(~p"/stacks", %{slug: "user1-stack1"})
      conn1 |> post(~p"/stacks", %{slug: "user1-stack2"})

      # Create stack with second user
      conn2 = create_authenticated_conn("user2@example.com")
      conn2 |> post(~p"/stacks", %{slug: "user2-stack1"})

      # First user should only see their stacks
      conn1 = conn1 |> get(~p"/stacks")
      assert conn1.status == 200
      response_data = json_response(conn1, 200)["data"]
      stack_slugs = Enum.map(response_data, & &1["slug"])
      assert "user1-stack1" in stack_slugs
      assert "user1-stack2" in stack_slugs
      refute "user2-stack1" in stack_slugs

      # Second user should only see their stack
      conn2 = conn2 |> get(~p"/stacks")
      assert conn2.status == 200
      response_data = json_response(conn2, 200)["data"]
      stack_slugs = Enum.map(response_data, & &1["slug"])
      assert "user2-stack1" in stack_slugs
      refute "user1-stack1" in stack_slugs
      refute "user1-stack2" in stack_slugs
    end
  end

  describe "backward compatibility when authentication is disabled" do
    setup do
      # Disable auth for these tests
      original_config = Application.get_env(:ethui, EthuiWeb.Plugs.Authenticate, [])
      Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, enabled: false)

      on_exit(fn ->
        Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, original_config)
      end)

      :ok
    end

    test "allows creating stacks without authentication" do
      conn = Phoenix.ConnTest.build_conn(:post, "http://api.lvh.me", nil)
      slug = "no-auth-stack"

      conn = conn |> post(~p"/stacks", %{slug: slug})
      assert response(conn, 201)

      # Verify stack was created without user_id
      stack = Repo.get_by(Stack, slug: slug)
      assert stack.user_id == nil
    end

    test "allows deleting any stack without authentication" do
      # Create a stack first
      conn = Phoenix.ConnTest.build_conn(:post, "http://api.lvh.me", nil)
      slug = "delete-no-auth"
      conn |> post(~p"/stacks", %{slug: slug})

      # Delete the stack
      conn = conn |> delete(~p"/stacks/#{slug}")
      assert conn.status == 204
    end

    test "shows all stacks when not authenticated" do
      # Create multiple stacks
      conn = Phoenix.ConnTest.build_conn(:post, "http://api.lvh.me", nil)
      conn |> post(~p"/stacks", %{slug: "public-stack1"})
      conn |> post(~p"/stacks", %{slug: "public-stack2"})

      # List all stacks
      conn = conn |> get(~p"/stacks")
      assert conn.status == 200
      response_data = json_response(conn, 200)["data"]
      stack_slugs = Enum.map(response_data, & &1["slug"])
      assert "public-stack1" in stack_slugs
      assert "public-stack2" in stack_slugs
    end
  end

  describe "stacks/:slug" do
    test "returns a stack", %{conn: conn} do
      stack = %Stack{id: 1, slug: "test-stack"}
      Server.start(stack)

      conn = conn |> get(~p"/stacks/#{stack.slug}")
      assert conn.status == 200
      response_data = json_response(conn, 200)["data"]
      assert response_data["slug"] == stack.slug
    end
  end
end
