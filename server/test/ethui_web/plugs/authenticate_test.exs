defmodule EthuiWeb.Plugs.AuthenticateTest do
  use EthuiWeb.ConnCase, async: false

  alias EthuiWeb.Plugs.Authenticate
  alias Ethui.Accounts

  describe "Authenticate plug when enabled" do
    setup do
      # Ensure auth is enabled for these tests
      original_config = Application.get_env(:ethui, Authenticate, [])
      Application.put_env(:ethui, Authenticate, enabled: true)

      on_exit(fn ->
        Application.put_env(:ethui, Authenticate, original_config)
      end)

      # Create a user and get a valid token
      email = "auth-plug-test@example.com"
      {:ok, _user} = Accounts.send_verification_code(email)
      user = Accounts.get_user_by_email(email)
      {:ok, token} = Accounts.verify_code_and_generate_token(email, user.verification_code)

      %{user: user, token: token, email: email}
    end

    test "allows request with valid Bearer token", %{conn: conn, token: token, user: user} do
      conn =
        conn
        |> put_req_header("authorization", "Bearer #{token}")
        |> Authenticate.call([])

      assert conn.assigns[:current_user].id == user.id
      assert conn.assigns[:current_user].email == user.email
      refute conn.halted
    end

    test "rejects request with invalid token", %{conn: conn} do
      conn =
        conn
        |> put_req_header("authorization", "Bearer invalid.token.here")
        |> Authenticate.call([])

      assert %{"error" => "Invalid token"} = json_response(conn, 401)
      assert conn.halted
    end

    test "rejects request with missing authorization header", %{conn: conn} do
      conn = Authenticate.call(conn, [])

      assert %{"error" => "Authorization header missing"} = json_response(conn, 401)
      assert conn.halted
    end

    test "rejects request with malformed authorization header", %{conn: conn} do
      conn =
        conn
        |> put_req_header("authorization", "NotBearer token")
        |> Authenticate.call([])

      assert %{"error" => "Authorization header missing"} = json_response(conn, 401)
      assert conn.halted
    end
  end

  describe "Authenticate plug when disabled" do
    setup do
      # Disable auth for these tests
      original_config = Application.get_env(:ethui, Authenticate, [])
      Application.put_env(:ethui, Authenticate, enabled: false)

      on_exit(fn ->
        Application.put_env(:ethui, Authenticate, original_config)
      end)

      :ok
    end

    test "allows request without authorization header when auth is disabled", %{conn: conn} do
      conn = Authenticate.call(conn, [])

      refute conn.halted
      refute conn.assigns[:current_user]
    end

    test "allows request with invalid token when auth is disabled", %{conn: conn} do
      conn =
        conn
        |> put_req_header("authorization", "Bearer invalid.token")
        |> Authenticate.call([])

      refute conn.halted
      refute conn.assigns[:current_user]
    end

    test "allows request with malformed authorization header when auth is disabled", %{conn: conn} do
      conn =
        conn
        |> put_req_header("authorization", "NotBearer token")
        |> Authenticate.call([])

      refute conn.halted
      refute conn.assigns[:current_user]
    end

    test "allows request with no headers when auth is disabled", %{conn: conn} do
      conn = Authenticate.call(conn, [])

      refute conn.halted
      refute conn.assigns[:current_user]
    end
  end

  describe "enabled?/0 function" do
    test "returns true when auth is enabled" do
      original_config = Application.get_env(:ethui, Authenticate, [])
      Application.put_env(:ethui, Authenticate, enabled: true)

      assert Authenticate.enabled?()

      Application.put_env(:ethui, Authenticate, original_config)
    end

    test "returns false when auth is disabled" do
      original_config = Application.get_env(:ethui, Authenticate, [])
      Application.put_env(:ethui, Authenticate, enabled: false)

      refute Authenticate.enabled?()

      Application.put_env(:ethui, Authenticate, original_config)
    end

    test "returns nil when auth config is not set" do
      original_config = Application.get_env(:ethui, Authenticate, [])
      Application.put_env(:ethui, Authenticate, [])

      refute Authenticate.enabled?()

      Application.put_env(:ethui, Authenticate, original_config)
    end
  end

  describe "init/1" do
    test "returns options unchanged" do
      opts = [some: :option]
      assert Authenticate.init(opts) == opts
    end

    test "returns empty list unchanged" do
      assert Authenticate.init([]) == []
    end
  end
end
