defmodule Ethui.Stacks.Stack do
  @moduledoc """
  Database entity for a stack
  """

  use Ecto.Schema
  import Ecto.Changeset
  alias Ethui.Stacks

  # Allowlist, not a passthrough: anvil takes filesystem paths (--state,
  # --dump-state, --load-state, --config-out, --cache-path, --ipc) and outbound
  # request config (--fork-header) as flags, which would read or write arbitrary
  # paths as the server user. --host/--port/--state/--chain-id are server-managed
  # in Ethui.Services.Anvil and must not be settable here.
  @anvil_schema %{
    # forking
    "fork_url" => :string,
    "fork_block_number" => :integer,

    # dev accounts
    "accounts" => {:integer, 1, 100},
    "balance" => {:integer, 0, 1_000_000_000},

    # mining and finality
    "block_time" => {:integer, 1, 86_400},
    "mixed_mining" => :flag,
    "no_mining" => :flag,
    "slots_in_an_epoch" => {:integer, 1, 1024},

    # history retention
    "prune_history" => :flag,
    "transaction_block_keeper" => {:integer, 1, 1_000_000},
    "state_interval" => {:integer, 1, 86_400},

    # evm limits
    "gas_limit" => {:integer, 0, 1_000_000_000_000},
    "gas_price" => {:integer, 0, 1_000_000_000_000_000},
    "block_base_fee_per_gas" => {:integer, 0, 1_000_000_000_000_000},
    "code_size_limit" => {:integer, 0, 10_000_000},
    "disable_block_gas_limit" => :flag,
    "disable_code_size_limit" => :flag,
    "auto_impersonate" => :flag
  }

  @graph_schema %{
    "enabled" => :boolean
  }

  @type t :: %__MODULE__{}

  schema "stacks" do
    field(:slug, :string)
    field(:anvil_opts, :map, default: %{})
    field(:graph_opts, :map, default: %{})
    belongs_to(:user, Ethui.Accounts.User)
    has_one(:api_key, Ethui.Accounts.ApiKey)

    timestamps(type: :utc_datetime)
  end

  def anvil_opts_schema, do: @anvil_schema

  def create_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:slug, :user_id, :anvil_opts, :graph_opts])
    |> update_change(:slug, &String.downcase/1)
    |> validate_format(:slug, ~r/^[a-z][a-z0-9\-]*$/,
      message: "must contain only lowercase letters, numbers, and hyphens"
    )
    |> validate_format(:slug, Stacks.reserved_slug_prefixes_regex())
    |> validate_required([:slug])
    |> unique_constraint(:slug)
    |> foreign_key_constraint(:user_id)
    |> validate_opts(:anvil_opts, @anvil_schema)
    |> validate_anvil_opts_conflicts()
    |> validate_opts(:graph_opts, @graph_schema)
  end

  # Unknown keys are dropped silently, as they always were, so older clients
  # sending flags this version doesn't know about still create a stack. A known
  # key with a value that can't be cast is an error, so a typo'd value surfaces
  # instead of being ignored.
  defp validate_opts(changeset, field, schema) do
    case fetch_change(changeset, field) do
      {:ok, opts} when is_map(opts) ->
        {casted, errors} =
          Enum.reduce(opts, {%{}, []}, &cast_opt(&1, &2, schema))

        errors
        |> Enum.reverse()
        |> Enum.reduce(put_change(changeset, field, casted), &add_error(&2, field, &1))

      _ ->
        changeset
    end
  end

  defp cast_opt({key, value}, {casted, errors}, schema) do
    case is_binary(key) && schema[key] do
      type when type in [nil, false] ->
        {casted, errors}

      type ->
        case cast_value(type, value) do
          {:ok, value} -> {Map.put(casted, key, value), errors}
          :error -> {casted, ["#{key} #{expected(type)}" | errors]}
        end
    end
  end

  defp validate_anvil_opts_conflicts(changeset) do
    opts = get_field(changeset, :anvil_opts) || %{}

    changeset
    |> conflict(
      :anvil_opts,
      opts["fork_block_number"] && is_nil(opts["fork_url"]),
      "fork_block_number requires fork_url"
    )
    |> conflict(
      :anvil_opts,
      opts["mixed_mining"] && is_nil(opts["block_time"]),
      "mixed_mining requires block_time"
    )
    |> conflict(
      :anvil_opts,
      opts["no_mining"] && (opts["block_time"] || opts["mixed_mining"]),
      "no_mining cannot be combined with block_time or mixed_mining"
    )
  end

  defp conflict(changeset, field, condition, message) do
    if condition, do: add_error(changeset, field, message), else: changeset
  end

  defp expected(:string), do: "must be a string"
  defp expected(:integer), do: "must be an integer"
  defp expected({:integer, min, max}), do: "must be an integer between #{min} and #{max}"
  defp expected(:boolean), do: "must be a boolean"
  defp expected(:flag), do: "must be a boolean"

  defp cast_value(:string, v) when is_binary(v), do: {:ok, v}
  defp cast_value(:integer, v) when is_integer(v), do: {:ok, v}

  defp cast_value(:integer, v) when is_binary(v) do
    case Integer.parse(v) do
      {int, ""} -> {:ok, int}
      _ -> :error
    end
  end

  defp cast_value({:integer, min, max}, v) do
    with {:ok, int} <- cast_value(:integer, v),
         true <- int >= min and int <= max do
      {:ok, int}
    else
      _ -> :error
    end
  end

  defp cast_value(:boolean, v) when is_boolean(v), do: {:ok, v}
  defp cast_value(:boolean, "true"), do: {:ok, true}
  defp cast_value(:boolean, "false"), do: {:ok, false}
  defp cast_value(:flag, v), do: cast_value(:boolean, v)
  defp cast_value(_, _), do: :error
end
