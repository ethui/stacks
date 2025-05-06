defmodule Ethui.Stacks.ServerTest do
  use Ethui.DataCase

  alias Ethui.Stacks.{Server, Stack}
  alias Ethui.Repo

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
    s1 = %Stack{slug: "slug1"}
    s2 = %Stack{slug: "slug2"}

    Server.start(s1)
    Server.start(s2)

    assert Server.list() |> length == 2
    s2 |> Server.stop()
    assert Server.list() |> length == 1
  end
end
