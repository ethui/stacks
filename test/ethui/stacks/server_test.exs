defmodule Ethui.StacksTest do
  alias Ethui.Stacks
  alias Ethui.Services.{Anvil, HttpPorts}
  use ExUnit.Case

  setup_all do
    ports = start_link_supervised!({HttpPorts, range: 7000..8000})
    start_supervised!({Registry, keys: :unique, name: __MODULE__.Registry})

    {:ok, ports: ports, registry: __MODULE__.Registry}
  end

  test "can orchestrate multiple anvils", %{ports: ports, registry: registry} do
    {:ok, mult_anvil_supervisor} = Stacks.Supervisor.start_link()

    {:ok, server} =
      Stacks.Server.start_link(
        supervisor: mult_anvil_supervisor,
        ports: ports,
        registry: registry
      )

    {:ok, anvil1, _pid1} = Stacks.Server.start_stack(server, id: "anvil1")
    {:ok, anvil2, pid2} = Stacks.Server.start_stack(server, id: "anvil2")

    assert Anvil.url(anvil1) != Anvil.url(anvil2)

    Process.monitor(pid2)
    Stacks.Server.stop_stack(server, "anvil2")
    assert_receive {:DOWN, _, _, ^pid2, _}
  end
end
