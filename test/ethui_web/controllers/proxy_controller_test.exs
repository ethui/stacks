defmodule EthuiWeb.ProxyControllerTest do
  use EthuiWeb.ConnCase, async: false

  alias Ethui.Repo
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

      s = %Stack{slug: slug}
      Server.start(s)

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
end
