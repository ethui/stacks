defmodule Ethui.Stacks.Stack do
  @moduledoc """
  Database entity for a stack
  """

  use Ecto.Schema
  import Ecto.Changeset

  @allowed_anvil_opts ~w(fork_url fork_block_number fork_chain_id)

  schema "stacks" do
    field(:slug, :string)
    field(:anvil_opts, :map, default: %{})
    belongs_to(:user, Ethui.Accounts.User)

    timestamps(type: :utc_datetime)
  end

  def create_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:slug, :user_id, :anvil_opts])
    |> validate_required([:slug])
    |> unique_constraint(:slug)
    |> foreign_key_constraint(:user_id)
    |> update_change(:anvil_opts, &filter_anvil_opts/1)
  end

  defp filter_anvil_opts(opts) when is_map(opts) do
    opts
    |> Enum.filter(fn
      {k, v} when is_binary(k) ->
        k in @allowed_anvil_opts and (is_binary(v) or is_number(v))

      _ ->
        false
    end)
    |> Enum.into(%{})
  end
end
