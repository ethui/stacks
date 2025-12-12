defmodule Ethui.Stacks.HttpPortsTest do
  alias Ethui.Stacks.HttpPorts
  use ExUnit.Case

  test "claimed ports remain claimed" do
    {:ok, port} = HttpPorts.claim()
    assert HttpPorts.claimed?(port)
    HttpPorts.free(port)
    refute HttpPorts.claimed?(port)
  end
end
