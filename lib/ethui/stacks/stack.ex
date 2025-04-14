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

  def create_changeset(stack, attrs) do
    stack
    |> cast(attrs, [:slug])
    |> validate_required([:slug])
    |> unique_constraint(:slug)
  end

  def admin_create_changeset(stack, attrs, _ \\ nil) do
    stack
    |> cast(attrs, [:slug])
    |> validate_required([:slug])
    |> unique_constraint(:slug)
  end

  def admin_update_changeset(stack, attrs, _ \\ nil) do
    stack
    |> cast(attrs, [])

    # |> validate_required([:slug])
    # |> unique_constraint(:slug)
  end
end
