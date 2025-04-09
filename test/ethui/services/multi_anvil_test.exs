defmodule Ethui.Services.MultiAnvilTest do
  alias Ethui.Services.{MultiAnvilSupervisor, MultiAnvil, Anvil, HttpPorts}
  use ExUnit.Case

  setup_all do
    ports = start_link_supervised!({HttpPorts, range: 7000..8000})
    start_supervised!({Registry, keys: :unique, name: __MODULE__.Registry})

    {:ok, ports: ports, registry: __MODULE__.Registry}
  end

  test "can orchestrate multiple anvils", %{ports: ports, registry: registry} do
    {:ok, mult_anvil_supervisor} = MultiAnvilSupervisor.start_link()

    {:ok, multi_anvil} =
      MultiAnvil.start_link(
        supervisor: mult_anvil_supervisor,
        ports: ports,
        registry: __MODULE__.Registry
      )

    {:ok, anvil1, _pid1} = MultiAnvil.start_anvil(multi_anvil, id: "anvil1")
    {:ok, anvil2, pid2} = MultiAnvil.start_anvil(multi_anvil, id: "anvil2")

    assert Anvil.url(anvil1) != Anvil.url(anvil2)

    Process.monitor(pid2)
    MultiAnvil.stop_anvil(multi_anvil, "anvil2")
    assert_receive {:DOWN, _, _, ^pid2, _}
  end
end
