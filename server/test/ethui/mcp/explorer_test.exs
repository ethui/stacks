defmodule Ethui.MCP.ExplorerTest do
  use ExUnit.Case, async: true

  alias Ethui.MCP.Explorer
  alias Ethui.Stacks.Stack

  @stack %Stack{slug: "demo"}

  test "encodes the rpc url into the path" do
    assert Explorer.root(@stack) =~ ~r"/rpc/[A-Za-z0-9+/=]+$"
  end

  test "builds block links with decimal numbers" do
    assert Explorer.block(@stack, "0x10") =~ "/block/16"
    assert Explorer.block(@stack, 16) =~ "/block/16"
  end

  test "falls back to the stack root when a block has no number" do
    assert Explorer.block(@stack, nil) == Explorer.root(@stack)
  end
end
