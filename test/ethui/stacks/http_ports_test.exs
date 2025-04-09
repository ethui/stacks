defmodule Ethui.Stacks.HttpPortsTest do
  alias Ethui.Stacks.HttpPorts
  use ExUnit.Case

  setup_all do
    pid = start_link_supervised!({HttpPorts, range: [1..100]})

    {:ok, pid: pid}
  end

  test "claimed ports remain claimed", %{pid: pid} do
    {:ok, port} = HttpPorts.claim(pid)
    assert HttpPorts.claimed?(pid, port)
    HttpPorts.free(pid, port)
    refute HttpPorts.claimed?(pid, port)
  end
end
