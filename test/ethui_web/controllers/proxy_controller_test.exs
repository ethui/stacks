defmodule EthuiWeb.ProxyControllerTest do
  use EthuiWeb.ConnCase, async: false

  alias Ethui.Repo
  alias Ethui.Stacks.{Server, Stack}

  setup do
    Ecto.Adapters.SQL.Sandbox.checkout(Repo, sandbox: false)

    cleanup()

    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end

  defp cleanup do
    Repo.delete_all(Stack)
  end

  describe "proxy/2" do
    @tag :skip
    test "proxies to anvil", %{conn: conn} do
      slug = "slug"
      {:ok, _name1, _pid1} = GenServer.call(Server, {:start_stack, %{slug: slug}})
      Process.sleep(100)

      conn =
        conn
        |> post(~p"/stacks/#{slug}", %{
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1
        })

      json_response(conn, 200)

      assert conn.status == 200
    end
  end
end
