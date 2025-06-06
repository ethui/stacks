defmodule EthuiWeb.Api.AuthControllerTest do
  use EthuiWeb.ConnCase, async: false

  import Swoosh.TestAssertions

  alias Ethui.Accounts

  setup do
    # Ensure auth is enabled for all tests unless overridden
    original_config = Application.get_env(:ethui, EthuiWeb.Plugs.Authenticate, [])
    Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, enabled: true)
    
    on_exit(fn ->
      Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, original_config)
    end)

    :ok
  end

  test "successful sign up flow", %{api_conn: api_conn} do
    email = "newuser@example.com"

    # Step 1: Send verification code
    conn = post(api_conn, "/auth/send-code", %{email: email})
    assert %{"message" => "Verification code sent"} = json_response(conn, 200)

    # Verify user was created in database
    user = Accounts.get_user_by_email(email)
    assert user.email == email
    assert user.verification_code
    assert String.length(user.verification_code) == 6
    assert Regex.match?(~r/^\d{6}$/, user.verification_code)
    assert user.verification_code_sent_at
    refute user.verified_at

    # Verify email was sent
    assert_email_sent(
      to: email,
      subject: "Your verification code"
    )

    # Step 2: Verify code and get JWT token
    code = user.verification_code
    conn = post(api_conn, "/auth/verify-code", %{email: email, code: code})
    assert %{"token" => token} = json_response(conn, 200)

    # Verify token is valid
    assert is_binary(token)
    assert String.length(token) > 50
    assert {:ok, verified_user} = Accounts.verify_token(token)
    assert verified_user.id == user.id
    assert verified_user.email == email

    # Verify user is now marked as verified
    updated_user = Accounts.get_user_by_email(email)
    assert updated_user.verified_at
    refute updated_user.verification_code
    refute updated_user.verification_code_sent_at

    # Step 3: Use token to access protected endpoint
    conn = api_conn
    |> put_req_header("authorization", "Bearer #{token}")
    |> get("/stacks")

    # Should return successful response (not authentication error)
    assert conn.status == 200
    assert json_response(conn, 200)
  end

  test "successful sign up with case insensitive email", %{api_conn: api_conn} do
    email_mixed = "TestUser@Example.COM"
    email_lower = String.downcase(email_mixed)

    # Step 1: Send verification code with mixed case email
    conn = post(api_conn, "/auth/send-code", %{email: email_mixed})
    assert %{"message" => "Verification code sent"} = json_response(conn, 200)

    # Verify email was normalized to lowercase
    user = Accounts.get_user_by_email(email_mixed)
    assert user.email == email_lower

    # Step 2: Verify code using different case
    code = user.verification_code
    conn = post(api_conn, "/auth/verify-code", %{email: String.upcase(email_mixed), code: code})
    assert %{"token" => token} = json_response(conn, 200)

    # Step 3: Verify token works regardless of email case used
    assert {:ok, verified_user} = Accounts.verify_token(token)
    assert verified_user.email == email_lower
  end

  test "invalid JWT results in 401", %{api_conn: api_conn} do
    invalid_tokens = [
      "invalid.token.here",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature",
      "",
      "not-a-jwt-at-all",
      "Bearer token-without-bearer-prefix"
    ]

    for invalid_token <- invalid_tokens do
      conn = api_conn
      |> put_req_header("authorization", "Bearer #{invalid_token}")
      |> get("/stacks")

      assert %{"error" => "Invalid token"} = json_response(conn, 401)
    end
  end

  test "missing authorization header results in 401", %{api_conn: api_conn} do
    conn = api_conn |> get("/stacks")

    assert %{"error" => "Authorization header missing"} = json_response(conn, 401)
  end

  test "malformed authorization header results in 401", %{api_conn: api_conn} do
    malformed_headers = [
      "InvalidFormat token",
      "Basic dXNlcjpwYXNzd29yZA==",  # Basic auth instead of Bearer
      "Bearer",  # Bearer without token
      "Bearer "  # Bearer with just space
    ]

    for header <- malformed_headers do
      conn = api_conn
      |> put_req_header("authorization", header)
      |> get("/stacks")

      assert %{"error" => _} = json_response(conn, 401)
    end
  end

  test "token with invalid signature results in 401", %{api_conn: api_conn} do
    # Create a token with wrong signature (using different secret)
    wrong_signer = Joken.Signer.create("HS256", "wrong-secret-key")

    claims = %{
      "sub" => 1,
      "email" => "test@example.com",
      "exp" => System.system_time(:second) + 3600  # Valid expiration
    }

    {:ok, invalid_token, _claims} = Joken.generate_and_sign(%{}, claims, wrong_signer)

    conn = api_conn
    |> put_req_header("authorization", "Bearer #{invalid_token}")
    |> get("/stacks")

    assert %{"error" => "Invalid token"} = json_response(conn, 401)
  end

  describe "disabled authentication" do
    setup do
      # Disable auth for these tests
      original_config = Application.get_env(:ethui, EthuiWeb.Plugs.Authenticate, [])
      Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, enabled: false)
      
      on_exit(fn ->
        Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, original_config)
      end)

      :ok
    end

    test "can access protected endpoints without authentication when disabled", %{api_conn: api_conn} do
      # Try to access protected endpoint without any authentication
      conn = api_conn |> get("/stacks")

      # Should succeed (not return 401)
      assert conn.status == 200
      assert json_response(conn, 200)
    end

    test "can access protected endpoints with invalid token when disabled", %{api_conn: api_conn} do
      # Try to access protected endpoint with invalid token
      conn = api_conn
      |> put_req_header("authorization", "Bearer invalid.token")
      |> get("/stacks")

      # Should succeed (not return 401)
      assert conn.status == 200
      assert json_response(conn, 200)
    end

    test "can access protected endpoints with malformed auth header when disabled", %{api_conn: api_conn} do
      # Try to access protected endpoint with malformed auth header
      conn = api_conn
      |> put_req_header("authorization", "NotBearer token")
      |> get("/stacks")

      # Should succeed (not return 401)
      assert conn.status == 200
      assert json_response(conn, 200)
    end
  end
end
