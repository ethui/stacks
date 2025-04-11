defmodule Ethui.Stacks.StackTest do
  use Ethui.DataCase

  alias Ethui.{Repo, Stacks.Stack}

  describe "admin_create_changeset/3" do
    test "can create stacks" do
      {:ok, _stack} =
        Stack.admin_create_changeset(%Stack{slug: "slug"}, %{}, nil)
        |> Repo.insert()
    end

    test "create changeset catches duplicate slugs" do
      %Stack{slug: "slug"} |> Repo.insert()

      {:error, error} =
        Stack.admin_create_changeset(%Stack{slug: "slug"}, %{}, nil) |> Repo.insert()

      assert {"has already been taken", _} = error.errors[:slug]
    end
  end
end
