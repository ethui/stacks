defmodule Ethui.Stacks.Stack do
  @moduledoc """
  Database entity for a stack
  """

  use Ecto.Schema
  import Ecto.Changeset
  alias Ethui.Stacks

  @anvil_schema %{
    "fork_url" => :string,
    "fork_block_number" => :integer
  }

  @graph_schema %{
    "enabled" => :boolean
  }

  schema "stacks" do
    field(:slug, :string)
    field(:anvil_opts, :map, default: %{})
    field(:graph_opts, :map, default: %{})
    belongs_to(:user, Ethui.Accounts.User)

    timestamps(type: :utc_datetime)
  end

  def create_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:slug, :user_id, :anvil_opts])
    |> validate_format(:slug, Stacks.reserved_slug_prefixes_regex())
    |> validate_required([:slug])
    |> unique_constraint(:slug)
    |> foreign_key_constraint(:user_id)
    |> update_change(:anvil_opts, &filter_opts(@anvil_schema, &1))
    |> update_change(:graph_opts, &filter_opts(@graph_schema, &1))
  end

  defp filter_opts(schema, opts) when is_map(opts) do
    opts
    |> Enum.reduce(%{}, fn {k, v}, acc ->
      with true <- is_binary(k),
           {:ok, casted} <- cast_value(schema[k], v) do
        Map.put(acc, k, casted)
      else
        _ -> acc
      end
    end)
  end

  defp filter_opts(_, _), do: %{}

  defp cast_value(:string, v) when is_binary(v), do: {:ok, v}
  defp cast_value(:integer, v) when is_integer(v), do: {:ok, v}

  defp cast_value(:integer, v) when is_binary(v) do
    case Integer.parse(v) do
      {int, ""} -> {:ok, int}
      _ -> :error
    end
  end

  defp cast_value(:boolean, v) when is_boolean(v), do: {:ok, v}
  defp cast_value(:boolean, "true"), do: {:ok, true}
  defp cast_value(:boolean, "false"), do: {:ok, false}
  defp cast_value(_, _), do: :error
end
