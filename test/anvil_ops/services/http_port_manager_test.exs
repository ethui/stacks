defmodule AnvilOps.Services.HttpPortManagerTest do
  alias AnvilOps.Services.HttpPortManager
  use ExUnit.Case

  setup do
    pid = start_link_supervised!({HttpPortManager, range: [1..100]})

    {:ok, pid: pid}
  end

  test "claimed ports remain claimed", %{pid: pid} do
    {:ok, port} = HttpPortManager.claim(pid)
    assert HttpPortManager.is_claimed(pid, port)
    HttpPortManager.free(pid, port)
    refute HttpPortManager.is_claimed(pid, port)
  end
end
