defmodule Ethui.Services.AnvilTest do
  alias Ethui.Services.{HttpPortManager}
  alias Ethui.Services.Anvil, as: Anvil
  use ExUnit.Case, async: false

  setup_all do
    Process.flag(:trap_exit, true)
    pid = start_link_supervised!({HttpPortManager, range: 7000..8000, name: :port_manager})

    {:ok, port_manager: pid}
  end

  test "creates an anvil process", %{port_manager: port_manager} do
    {:ok, anvil} = Anvil.start_link(port_manager: port_manager)
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

  test "creates multiple anvil processes", %{port_manager: port_manager} do
    anvils =
      for i <- 1..10 do
        {:ok, pid} = Anvil.start_link(port_manager: port_manager, name: :"anvil_#{i}")
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
    {:ok, port_manager1} =
      HttpPortManager.start_link(range: 7000..7000, name: :port_manager_1)

    {:ok, port_manager2} =
      HttpPortManager.start_link(range: 7000..7000, name: :port_manager_2)

    {:ok, _anvil1} = GenServer.start_link(Anvil, port_manager: port_manager1, name: :anvil_1)

    # give enough time to not cause a race condition, and ensure the 2nd anvil is the one that crashes
    Process.sleep(100)

    {:ok, anvil2} = GenServer.start_link(Anvil, port_manager: port_manager2, name: :anvil_1)

    Process.monitor(anvil2)
    assert_receive {:DOWN, _, _, ^anvil2, _}, 2_000
  end
end
