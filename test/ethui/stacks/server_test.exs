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
    {:ok, _name1, _pid1} = GenServer.call(Server, {:start_stack, %{slug: "slug1"}})
    {:ok, _name2, _pid2} = GenServer.call(Server, {:start_stack, %{slug: "slug2"}})

    assert Server.list(Server) == ["slug1", "slug2"]

    GenServer.call(Server, {:stop_stack, "slug2"})

    assert Server.list(Server) == ["slug1"]
  end
end
