defmodule AnvilOps.Services.AnvilTest do
  alias AnvilOps.Services.{Anvil, HttpPortManager}
  use ExUnit.Case, async: false

  setup_all do
    Process.flag(:trap_exit, true)
    pid = start_link_supervised!({HttpPortManager, range: 7000..8000})

    {:ok, port_manager: pid}
  end

  test "creates an anvil process", %{port_manager: port_manager} do
    anvil = start_link_supervised!({Anvil, port_manager: port_manager})

    url = Anvil.url(anvil)

    url
    |> AnvilClient.new()
    |> AnvilClient.rpc_request("anvil_nodeInfo", [])
  end

  test "creates multiple anvil processes", %{port_manager: port_manager} do
    anvils =
      for i <- 1..1 do
        {:ok, pid} = Anvil.start_link(port_manager: port_manager, name: :"anvil_#{i}")

        Process.monitor(pid)

        pid
      end

    Process.sleep(100)

    for anvil <- anvils do
      url = Anvil.url(anvil)

      url
      |> AnvilClient.new()
      |> AnvilClient.rpc_request("anvil_nodeInfo", [])
    end

    for anvil <- anvils do
      Anvil.stop(anvil)
      assert_receive {:DOWN, _ref, :process, ^anvil, :normal}
    end

    Process.sleep(15_000)
  end
end
