defmodule Ethui.Services.MultiAnvilTest do
  alias Ethui.Services.{MultiAnvilSupervisor, MultiAnvil, Anvil, HttpPorts}
  use ExUnit.Case

  setup_all do
    pid = start_link_supervised!({HttpPorts, range: 7000..8000})

    {:ok, ports: pid}
  end

  test "can orchestrate multiple anvils", %{ports: ports} do
    {:ok, mult_anvil_supervisor} = MultiAnvilSupervisor.start_link()
    {:ok, multi_anvil} = MultiAnvil.start_link(supervisor: mult_anvil_supervisor, ports: ports)

    {:ok, anvil1} = MultiAnvil.start_anvil(multi_anvil, name: :anvil1)
    {:ok, _anvil2} = MultiAnvil.start_anvil(multi_anvil, name: :anvil2)

    assert Anvil.url(:anvil1) != Anvil.url(:anvil2)

    Process.monitor(anvil1)
    MultiAnvil.stop_anvil(multi_anvil, :anvil1)
    assert_receive {:DOWN, _, _, ^anvil1, _}
  end
end
