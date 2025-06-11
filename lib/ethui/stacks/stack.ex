defmodule Ethui.Stacks.Stack do
  @moduledoc """
  Database entity for a stack
  """

  use Ecto.Schema
  import Ecto.Changeset

  schema "stacks" do
    field(:slug, :string)
    belongs_to(:user, Ethui.Accounts.User)

    timestamps(type: :utc_datetime)
  end

  def create_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:slug, :user_id])
    |> validate_required([:slug])
    |> unique_constraint(:slug)
    |> foreign_key_constraint(:user_id)
  end
end
