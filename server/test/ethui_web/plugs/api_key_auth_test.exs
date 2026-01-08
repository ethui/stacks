defmodule EthuiWeb.Plugs.ApiKeyAuthTest do
  use EthuiWeb.ConnCase, async: false

  import Plug.Test

  alias EthuiWeb.Plugs.{ApiKeyAuth, Authenticate, StackSubdomain}
  alias Ethui.Repo
  alias Ethui.Accounts
  alias Ethui.Stacks.Stack

  describe "Api key auth plug when enabled" do
    setup do
      # Ensure auth is enabled for these tests
      original_config_auth = Application.get_env(:ethui, Authenticate, [])
      original_config_api_key = Application.get_env(:ethui, ApiKeyAuth, [])
      Application.put_env(:ethui, Authenticate, enabled: true)
      Application.put_env(:ethui, ApiKeyAuth, enabled: true)

      on_exit(fn ->
        Application.put_env(:ethui, Authenticate, original_config_auth)
        Application.put_env(:ethui, ApiKeyAuth, original_config_api_key)
      end)

      email = "auth-plug-test@example.com"
      {:ok, _user} = Accounts.send_verification_code(email)
      user = Accounts.get_user_by_email(email)

      slug = "example"
      {:ok, token} = Accounts.verify_code_and_generate_token(email, user.verification_code)
      {:ok, stack} = Stack.create_changeset(%{user_id: user.id, slug: slug}) |> Repo.insert()
      {:ok, api_key} = Accounts.create_api_key(user, stack.slug)

      %{user: user, token: token, email: email, slug: slug, api_key: api_key.token}
    end

    test "allows request with valid api token", %{
      token: token,
      slug: slug,
      api_key: api_key
    } do
      conn =
        conn(:get, "/#{api_key}/execute")
        |> Map.put(:host, "#{slug}.lvh.me")
        |> put_req_header("authorization", "Bearer #{token}")
        |> StackSubdomain.call(StackSubdomain.init([]))
        |> ApiKeyAuth.call(ApiKeyAuth.init([]))

      assert conn.assigns[:proxy].slug == slug
      assert conn.path_info == ["execute"]
      refute conn.halted
    end
  end

  describe "Api key auth plug when disabled " do
    setup do
      # Ensure auth is enabled for these tests
      original_config_auth = Application.get_env(:ethui, Authenticate, [])
      original_config_api_key = Application.get_env(:ethui, ApiKeyAuth, [])
      Application.put_env(:ethui, Authenticate, enabled: false)
      Application.put_env(:ethui, ApiKeyAuth, enabled: false)

      on_exit(fn ->
        Application.put_env(:ethui, Authenticate, original_config_auth)
        Application.put_env(:ethui, ApiKeyAuth, original_config_api_key)
      end)

      # Create a user and get a valid token
      email = "auth-plug-test@example.com"
      {:ok, _user} = Accounts.send_verification_code(email)
      user = Accounts.get_user_by_email(email)

      slug = "example"
      {:ok, token} = Accounts.verify_code_and_generate_token(email, user.verification_code)
      {:ok, stack} = Stack.create_changeset(%{user_id: user.id, slug: slug}) |> Repo.insert()
      {:ok, api_key} = Accounts.create_api_key(user, stack.slug)

      %{user: user, token: token, email: email, slug: slug, api_key: api_key.token}
    end

    test "allows request with valid api token", %{
      token: token,
      slug: slug,
      api_key: api_key
    } do
      conn =
        conn(:get, "/#{api_key}/execute")
        |> Map.put(:host, "#{slug}.lvh.me")
        |> put_req_header("authorization", "Bearer #{token}")
        |> StackSubdomain.call(StackSubdomain.init([]))
        |> ApiKeyAuth.call(ApiKeyAuth.init([]))

      assert conn.assigns[:proxy].slug == slug
      assert conn.path_info == [api_key, "execute"]
      refute conn.halted
    end
  end
end
