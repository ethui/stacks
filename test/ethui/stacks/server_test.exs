defmodule Ethui.Stacks.ServerTest do
  use Ethui.DataCase

  alias Ethui.Stacks.{Server, Stack}
  alias Ethui.Repo

  setup do
    Ecto.Adapters.SQL.Sandbox.checkout(Ethui.Repo, sandbox: false)
    cleanup()
    :ok
  end

  defp cleanup do
    Repo.delete_all(Stack)

    assert_eventually(fn ->
      Server |> Server.list() |> length == 0
    end)
  end

  test "can orchestrate multiple anvils" do
    %Stack{slug: "slug1"} |> Repo.insert!()
    s2 = %Stack{slug: "slug2"} |> Repo.insert!()

    assert_eventually(fn ->
      Server |> Server.list() |> length == 2
    end)

    s2 |> Repo.delete()

    assert_eventually(fn ->
      Server |> Server.list() |> length == 1
    end)
  end
end
