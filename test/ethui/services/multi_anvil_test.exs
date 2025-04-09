defmodule Ethui.Services.MultiAnvilTest do
  alias Ethui.Services.{MultiAnvil, Anvil, HttpPorts}
  use ExUnit.Case

  setup_all do
    pid = start_link_supervised!({HttpPorts, range: 7000..8000})

    {:ok, ports: pid}
  end

  test "can orchestrate multiple anvils", %{ports: ports} do
    {:ok, multi_anvil} = MultiAnvil.start_link()

    {:ok, anvil1} = MultiAnvil.start_anvil(multi_anvil, ports: ports)
    {:ok, anvil2} = MultiAnvil.start_anvil(multi_anvil, ports: ports)

    assert Anvil.url(anvil1) != Anvil.url(anvil2)

    Process.monitor(anvil1)
    MultiAnvil.stop_anvil(multi_anvil, anvil1)

    assert_receive {:DOWN, _, _, ^anvil1, _}
  end
end
