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
      Server.destroy(%Stack{slug: slug})
    end)

    :ok
  end

  test "creates an anvil process" do
    {:ok, anvil} = Anvil.start_link(ports: HttpPorts, slug: "slug123", hash: "hash", id: 1)
    Anvil.ensure_running(anvil)
    Process.sleep(1000)

    client = Rpc.new_client(:http, rpc_url: Anvil.url(anvil))

    resp =
      Rpc.request("anvil_nodeInfo", [])
      |> Rpc.send(client)

    assert {:ok, _} = resp

    Anvil.destroy(anvil)
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
        anvil_opts: %{"fork_url" => "wss://mainnet.gateway.tenderly.co"},
        id: 1
      )

    Anvil.ensure_running(anvil)
    Process.sleep(10_000)

    client = Rpc.new_client(:http, rpc_url: Anvil.url(anvil))

    {:ok,
     %Exth.Rpc.Response.Success{
       result: %{"forkConfig" => %{"forkBlockNumber" => fork_block_number}}
     }} =
      Rpc.request("anvil_nodeInfo", [])
      |> Rpc.send(client)

    assert fork_block_number

    Anvil.destroy(anvil)
    Process.sleep(100)

    err =
      Rpc.request("anvil_nodeInfo", [])
      |> Rpc.send(client)

    assert {:error, %{reason: :econnrefused}} = err
  end

  test "boots with mining, finality and history options" do
    {:ok, anvil} =
      Anvil.start_link(
        ports: HttpPorts,
        slug: "opts456",
        hash: "hash",
        anvil_opts: %{
          "accounts" => 15,
          "disable_block_gas_limit" => true,
          "slots_in_an_epoch" => 2,
          "block_time" => 12,
          "mixed_mining" => true,
          "state_interval" => 60,
          "transaction_block_keeper" => 20_000
        },
        id: 1
      )

    Anvil.ensure_running(anvil)

    client = Rpc.new_client(:http, rpc_url: Anvil.url(anvil))

    {:ok, %Exth.Rpc.Response.Success{result: accounts}} =
      Rpc.request("eth_accounts", []) |> Rpc.send(client)

    assert length(accounts) == 15

    Anvil.destroy(anvil)
  end

  test "ignores server-managed flags handed in as anvil options" do
    {:ok, anvil} =
      Anvil.start_link(
        ports: HttpPorts,
        slug: "managed",
        hash: "hash",
        # anvil would exit 2 on the repeated flags if these reached the command
        anvil_opts: %{"port" => 1, "host" => "10.0.0.1", "chain_id" => 5},
        id: 1
      )

    assert :ok = Anvil.ensure_running(anvil)

    client = Rpc.new_client(:http, rpc_url: Anvil.url(anvil))
    assert {:ok, _} = Rpc.request("anvil_nodeInfo", []) |> Rpc.send(client)

    Anvil.destroy(anvil)
  end

  test "reports a boot failure instead of retrying it forever" do
    {:ok, anvil} =
      Anvil.start_link(
        ports: HttpPorts,
        slug: "badopts",
        hash: "hash",
        # anvil refuses a fork block number with no fork url, and exits 2
        # before it ever opens the rpc port
        anvil_opts: %{"fork_block_number" => 100},
        id: 1
      )

    assert {:error, {:exit, 2}} = Anvil.ensure_running(anvil)

    # the second call answers from the recorded failure, without waiting on
    # another boot
    assert {:error, {:exit, 2}} = Anvil.ensure_running(anvil, :timer.seconds(1))
    assert Process.alive?(anvil)

    Anvil.destroy(anvil)
  end

  test "keeps the same port across suspend and resume" do
    {:ok, anvil} = Anvil.start_link(ports: HttpPorts, slug: "resumed", hash: "hash", id: 1)
    :ok = Anvil.ensure_running(anvil)
    url = Anvil.url(anvil)

    send(anvil, :suspend)
    Process.sleep(200)

    :ok = Anvil.ensure_running(anvil)
    assert Anvil.url(anvil) == url

    client = Rpc.new_client(:http, rpc_url: url)
    assert {:ok, _} = Rpc.request("anvil_nodeInfo", []) |> Rpc.send(client)

    Anvil.destroy(anvil)
  end

  test "creates multiple anvil processes" do
    anvils =
      for i <- 1..10 do
        {:ok, pid} = Anvil.start_link(ports: HttpPorts, slug: :"anvil_#{i}", hash: "hash", id: 1)

        Process.monitor(pid)
        pid
      end

    Process.sleep(100)

    for anvil <- anvils do
      Anvil.ensure_running(anvil)

      client =
        Rpc.new_client(:http, rpc_url: Anvil.url(anvil))

      Rpc.request("anvil_nodeInfo", [])
      |> Rpc.send(client)
    end

    for anvil <- anvils do
      Anvil.destroy(anvil)
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
