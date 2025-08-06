defmodule Ethui.Services.AnvilTest do
  use Ethui.DataCase, async: false

  alias Exth.Rpc
  alias Ethui.Services.Anvil
  alias Ethui.Stacks.{Stack, Server, HttpPorts}

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

  test "creates an anvil process" do
    {:ok, anvil} = Anvil.start_link(ports: HttpPorts, slug: "slug123", hash: "hash")
    Process.sleep(1000)

    client = Rpc.new_client(:http, rpc_url: Anvil.url(anvil))

    resp =
      Rpc.request("anvil_nodeInfo", [])
      |> Rpc.send(client)

    assert {:ok, _} = resp

    Anvil.stop(anvil)
    Process.sleep(100)

    err =
      Rpc.request("anvil_nodeInfo", [])
      |> Rpc.send(client)

    assert {:error, %{reason: :econnrefused}} = err
  end

  test "create an anvil process with optional argument" do
    {:ok, anvil} =
      Anvil.start_link(
        ports: HttpPorts,
        slug: "opt123",
        hash: "hash",
        anvil_opts: %{"fork_url" => "wss://mainnet.gateway.tenderly.co"}
      )

    Process.sleep(10_000)

    client = Rpc.new_client(:http, rpc_url: Anvil.url(anvil))

    {:ok,
     %Exth.Rpc.Response.Success{
       result: %{"forkConfig" => %{"forkBlockNumber" => forkBlockNumber}}
     }} =
      Rpc.request("anvil_nodeInfo", [])
      |> Rpc.send(client)

    assert forkBlockNumber

    Anvil.stop(anvil)
    Process.sleep(100)

    err =
      Rpc.request("anvil_nodeInfo", [])
      |> Rpc.send(client)

    assert {:error, %{reason: :econnrefused}} = err
  end

  test "creates multiple anvil processes" do
    anvils =
      for i <- 1..10 do
        {:ok, pid} = Anvil.start_link(ports: HttpPorts, slug: :"anvil_#{i}", hash: "hash")
        Process.monitor(pid)
        pid
      end

    Process.sleep(100)

    for anvil <- anvils do
      client =
        Rpc.new_client(:http, rpc_url: Anvil.url(anvil))

      Rpc.request("anvil_nodeInfo", [])
      |> Rpc.send(client)
    end

    for anvil <- anvils do
      Anvil.stop(anvil)
      assert_receive {:DOWN, _ref, :process, ^anvil, :normal}
    end
  end

  # test "logs/1", %{ports: ports} do
  #   {:ok, anvil} = Anvil.start_link(ports: ports)
  #   Process.sleep(100)
  #
  #   logs = Anvil.logs(anvil)
  #   assert is_list(logs)
  #   assert length(logs) > 0
  # end
end
