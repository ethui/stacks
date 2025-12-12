defmodule Ethui.Stacks.ServerTest do
  use Ethui.DataCase

  alias Ethui.Stacks.{Server, Stack}

  setup do
    cleanup()
    :ok
  end

  defp cleanup do
    Server.list()
    |> Enum.each(fn slug ->
      Server.stop(%Stack{slug: slug})
    end)

    :ok
  end

  test "can orchestrate multiple anvils" do
    s1 = %Stack{id: 1, slug: "slug1"}
    s2 = %Stack{id: 2, slug: "slug2"}

    Server.start(s1)
    Server.start(s2)

    assert Server.list() |> length == 2
    s2 |> Server.stop()
    assert Server.list() |> length == 1
  end

  test "can start and stop a stack" do
    stack = %Stack{id: 1, slug: "test_stack"}

    assert Server.list() |> length == 0

    Server.start(stack)
    assert Server.list() |> length == 1

    Server.stop(stack)
    assert Server.list() |> length == 0
  end

  describe "is_running?/1" do
    test "returns true if the stack is running" do
      stack = %Stack{id: 1, slug: "test_stack"}
      Server.start(stack)
      assert Server.is_running?(stack)
    end

    test "returns false if the stack is not running" do
      stack = %Stack{id: 1, slug: "test_stack"}
      assert not Server.is_running?(stack)
    end
  end
end
