defmodule Ethui.Services.AnvilTest do
  use Ethui.DataCase, async: false

  alias Exth.Rpc
  alias Ethui.Services.Anvil
  alias Ethui.Stacks.{Stack, Server, HttpPorts}

  setup do
    Ecto.Adapters.SQL.Sandbox.checkout(Ethui.Repo, sandbox: false)
    cleanup()
    :ok
  end

  defp cleanup do
    Repo.delete_all(Stack)

    assert_eventually(fn ->
      Server |> Server.list() |> length == 0
    end)
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

  @tag capture_log: true
  test "conflicting ports" do
    # start two conflicting port managers
    {:ok, ports1} =
      HttpPorts.start_link(range: 10_000..10_000, name: :ports_1)

    {:ok, ports2} =
      HttpPorts.start_link(range: 10_000..10_000, name: :ports_2)

    {:ok, _anvil1} = GenServer.start_link(Anvil, ports: ports1, slug: :anvil_1, hash: "hash")

    # give enough time to not cause a race condition, and ensure the 2nd anvil is the one that crashes
    Process.sleep(100)

    {:ok, anvil2} = GenServer.start_link(Anvil, ports: ports2, slug: :anvil_1, hash: "hash")

    Process.monitor(anvil2)
    assert_receive {:DOWN, _, _, ^anvil2, _}, 2_000
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
