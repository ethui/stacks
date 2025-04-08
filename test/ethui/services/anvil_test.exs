defmodule Ethui.Services.AnvilTest do
  alias Ethui.Services.{Anvil, HttpPortManager}
  use ExUnit.Case, async: false

  setup_all do
    Process.flag(:trap_exit, true)
    pid = start_link_supervised!({HttpPortManager, range: 7000..8000})

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
end
