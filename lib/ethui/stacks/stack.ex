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

  def create_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:slug])
    |> validate_required([:slug])
    |> unique_constraint(:slug)
  end
end
