defmodule Ethui.Services.AnvilTest do
  alias Ethui.Services.Anvil
  alias Ethui.Stacks.HttpPorts
  use ExUnit.Case

  # setup_all do
  #   Process.flag(:trap_exit, true)
  #   pid = start_link_supervised!({HttpPorts, range: 7000..8000})
  #
  #   {:ok, ports: pid}
  # end

  test "creates an anvil process" do
    {:ok, anvil} = Anvil.start_link(ports: HttpPorts)
    Process.sleep(100)

    url = Anvil.url(anvil)

    resp =
      url
      |> AnvilClient.new()
      |> AnvilClient.rpc_request("anvil_nodeInfo", [])

    assert {:ok, _} = resp

    Anvil.stop(anvil)
    Process.sleep(100)

    err =
      url
      |> AnvilClient.new()
      |> AnvilClient.rpc_request("anvil_nodeInfo", [])

    assert {:error, :econnrefused} = err
  end

  test "creates multiple anvil processes" do
    anvils =
      for i <- 1..10 do
        {:ok, pid} = Anvil.start_link(ports: HttpPorts, name: :"anvil_#{i}")
        Process.monitor(pid)
        pid
      end

    Process.sleep(100)

    for anvil <- anvils do
      anvil
      |> Anvil.url()
      |> AnvilClient.new()
      |> AnvilClient.rpc_request("anvil_nodeInfo", [])
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

    {:ok, _anvil1} = GenServer.start_link(Anvil, ports: ports1, name: :anvil_1)

    # give enough time to not cause a race condition, and ensure the 2nd anvil is the one that crashes
    Process.sleep(100)

    {:ok, anvil2} = GenServer.start_link(Anvil, ports: ports2, name: :anvil_1)

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
