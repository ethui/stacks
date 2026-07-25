defmodule EthuiWeb.MCPTest do
  use EthuiWeb.ConnCase, async: false

  alias Ethui.Accounts

  @protocol_version "2025-06-18"

  setup do
    # The app-level server stays idle in tests, since no endpoint is serving
    start_supervised!({Ethui.MCP.Server, transport: {:streamable_http, start: true}})

    original = Application.get_env(:ethui, EthuiWeb.Plugs.Authenticate, [])
    Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, enabled: true)
    on_exit(fn -> Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, original) end)

    {:ok, user} =
      Accounts.send_verification_code(
        "mcp-http-#{System.unique_integer([:positive])}@example.com"
      )

    {:ok, token} = Accounts.generate_token(user)
    auth = [authorization: "Bearer #{token}"]

    {:ok, auth: auth, session: initialize(auth)}
  end

  test "lists every tool", %{session: session, auth: auth} do
    assert %{"result" => %{"tools" => tools}} = request(session, "tools/list", %{}, auth)

    names = Enum.map(tools, & &1["name"])

    assert "create_stack" in names
    assert "execute" in names
    assert "set_block_timestamp" in names
    assert length(names) == 15
  end

  test "refuses to open a session without a token" do
    assert post_mcp(initialize_body(), []).status == 401
  end

  test "runs a tool for an authenticated caller", %{session: session, auth: auth} do
    assert %{"result" => result} =
             request(session, "tools/call", %{"name" => "list_stacks", "arguments" => %{}}, auth)

    refute result["isError"]
    assert [%{"text" => "[]"}] = result["content"]
  end

  test "reports unknown tools as protocol errors", %{session: session, auth: auth} do
    assert %{"error" => error} =
             request(session, "tools/call", %{"name" => "nope", "arguments" => %{}}, auth)

    assert error["message"] =~ "not found" or error["code"]
  end

  defp initialize(headers) do
    conn = post_mcp(initialize_body(), headers)

    assert conn.status == 200
    [session_id] = Plug.Conn.get_resp_header(conn, "mcp-session-id")

    post_mcp(
      %{"jsonrpc" => "2.0", "method" => "notifications/initialized"},
      Keyword.put(headers, :"mcp-session-id", session_id)
    )

    session_id
  end

  defp initialize_body do
    %{
      "jsonrpc" => "2.0",
      "id" => 1,
      "method" => "initialize",
      "params" => %{
        "protocolVersion" => @protocol_version,
        "clientInfo" => %{"name" => "test", "version" => "1.0.0"},
        "capabilities" => %{}
      }
    }
  end

  defp request(session, method, params, headers) do
    conn =
      post_mcp(
        %{
          "jsonrpc" => "2.0",
          "id" => System.unique_integer([:positive]),
          "method" => method,
          "params" => params
        },
        Keyword.put(headers, :"mcp-session-id", session)
      )

    assert conn.status == 200
    decode(conn.resp_body)
  end

  # Responses come back as a single SSE event when the client accepts a stream
  defp decode("event:" <> _ = body) do
    body
    |> String.split("\n", trim: true)
    |> Enum.find_value(fn
      "data:" <> payload -> Jason.decode!(String.trim(payload))
      _ -> nil
    end)
  end

  defp decode(body), do: Jason.decode!(body)

  defp post_mcp(body, headers) do
    :post
    |> Phoenix.ConnTest.build_conn("http://api.lvh.me/mcp", nil)
    |> Plug.Conn.put_req_header("content-type", "application/json")
    |> Plug.Conn.put_req_header("accept", "application/json, text/event-stream")
    |> then(fn conn ->
      Enum.reduce(headers, conn, fn {key, value}, acc ->
        Plug.Conn.put_req_header(acc, to_string(key), value)
      end)
    end)
    |> Phoenix.ConnTest.dispatch(@endpoint, :post, "http://api.lvh.me/mcp", Jason.encode!(body))
  end
end
