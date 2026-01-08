defmodule EthuiWeb.ProxyControllerTest do
  use EthuiWeb.ConnCase, async: false

  alias Ethui.Stacks.{Stack, Server}

  setup do
    cleanup()
    :ok
  end

  defp cleanup do
    Server.list()
    |> Enum.each(fn slug ->
      Server.stop(%Stack{slug: slug})
    end)

    :ok
  end

  describe "proxy/2" do
    test "proxies to anvil" do
      slug = "slug10"

      s = %Stack{slug: slug, id: 1}
      Server.start(s)
      Process.sleep(100)

      conn =
        anvil_conn(slug)
        |> post(~p"/", %{
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1
        })

      json_response(conn, 200)

      assert conn.status == 200
    end
  end

  describe "proxy/2 websocket" do
    @endpoint EthuiWeb.Endpoint

    setup do
      original_config = Application.get_env(:ethui, @endpoint)

      Application.put_env(:ethui, @endpoint, Keyword.put(original_config, :server, true))

      Supervisor.terminate_child(Ethui.Supervisor, @endpoint)
      start_supervised!(@endpoint)

      on_exit(fn ->
        Application.put_env(:ethui, @endpoint, original_config)
        Supervisor.terminate_child(Ethui.Supervisor, @endpoint)
        Supervisor.restart_child(Ethui.Supervisor, @endpoint)
      end)

      :ok
    end

    test "proxies websocket to anvil" do
      slug = "slug10"
      s = %Stack{slug: slug, id: 1}
      Server.start(s)
      Process.sleep(1000)

      port = @endpoint.config(:http)[:port]
      subdomain_host = "#{slug}.lvh.me"

      {:ok, conn_pid} = :gun.open(~c"localhost", port, %{protocols: [:http]})
      {:ok, :http} = :gun.await_up(conn_pid, 10_000)

      headers = [{"host", subdomain_host}]
      stream_ref = :gun.ws_upgrade(conn_pid, "/", headers)

      assert_receive {:gun_upgrade, ^conn_pid, ^stream_ref, ["websocket"], _headers}, 1_000

      request =
        Jason.encode!(%{
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1
        })

      :gun.ws_send(conn_pid, stream_ref, {:text, request})

      assert_receive {:gun_ws, ^conn_pid, ^stream_ref, {:text, response}}, 5_000

      decoded = Jason.decode!(response)
      assert decoded["jsonrpc"] == "2.0"
      assert decoded["id"] == 1
      assert Map.has_key?(decoded, "result")

      :gun.ws_send(conn_pid, stream_ref, :close)
      :gun.close(conn_pid)
    end

    test "proxies multiple websocket messages to anvil" do
      slug = "slug11"
      s = %Stack{slug: slug, id: 1}
      Server.start(s)
      Process.sleep(1000)

      port = @endpoint.config(:http)[:port]
      subdomain_host = "#{slug}.lvh.me"

      {:ok, conn_pid} = :gun.open(~c"localhost", port, %{protocols: [:http]})
      {:ok, :http} = :gun.await_up(conn_pid, 10_000)

      headers = [{"host", subdomain_host}]
      stream_ref = :gun.ws_upgrade(conn_pid, "/", headers)
      assert_receive {:gun_upgrade, ^conn_pid, ^stream_ref, ["websocket"], _headers}, 1_000

      request1 =
        Jason.encode!(%{
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1
        })

      :gun.ws_send(conn_pid, stream_ref, {:text, request1})

      assert_receive {:gun_ws, ^conn_pid, ^stream_ref, {:text, response1}}, 5_000
      decoded1 = Jason.decode!(response1)
      assert decoded1["id"] == 1

      request2 =
        Jason.encode!(%{
          jsonrpc: "2.0",
          method: "eth_chainId",
          params: [],
          id: 2
        })

      :gun.ws_send(conn_pid, stream_ref, {:text, request2})

      assert_receive {:gun_ws, ^conn_pid, ^stream_ref, {:text, response2}}, 5_000
      decoded2 = Jason.decode!(response2)
      assert decoded2["id"] == 2

      :gun.ws_send(conn_pid, stream_ref, :close)
      :gun.close(conn_pid)
    end

    test "handles websocket connection failure gracefully" do
      slug = "nonexistent-slug"
      port = @endpoint.config(:http)[:port]
      subdomain_host = "#{slug}.lvh.me"

      {:ok, conn_pid} = :gun.open(~c"localhost", port, %{protocols: [:http]})
      {:ok, :http} = :gun.await_up(conn_pid, 10_000)

      headers = [{"host", subdomain_host}]
      stream_ref = :gun.ws_upgrade(conn_pid, "/", headers)

      receive do
        {:gun_upgrade, ^conn_pid, ^stream_ref, ["websocket"], _headers} ->
          flunk("Should not successfully upgrade for non-existent stack")

        {:gun_response, ^conn_pid, ^stream_ref, _fin, status, _headers} ->
          assert status == 404

        {:gun_error, ^conn_pid, ^stream_ref, _reason} ->
          assert true
      after
        1_000 -> flunk("Expected response but timed out")
      end

      :gun.close(conn_pid)
    end
  end
end
