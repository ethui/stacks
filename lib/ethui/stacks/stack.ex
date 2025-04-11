defmodule Ethui.Stacks.Stack do
  @moduledoc """
  Database entity for a stack
  """

  use Ecto.Schema
  import Ecto.Changeset

  schema "stacks" do
    field(:slug, :string)

    timestamps(type: :utc_datetime)
  end

  def admin_create_changeset(stack, attrs, _conn) do
    stack
    |> cast(attrs, [:slug])
    |> validate_required([:slug])
    |> unique_constraint(:slug)
  end

  def admin_update_changeset(stack, attrs, _conn) do
    stack
    |> cast(attrs, [])
  end
end
