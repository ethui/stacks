defmodule Ethui.Stacks.Stack do
  @moduledoc """
  Database entity for a stack
  """

  use Ecto.Schema
  import Ecto.Changeset

  schema "stacks" do
    field(:title, :string)
    field(:friendly_id, :string)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(stack, attrs) do
    stack
    |> cast(attrs, [:title, :views])
    |> validate_required([:title, :views])
  end

  def create_changeset(_a, _b, _c) do
  end

  def update_changeset(_a, _b, _c) do
  end
end
