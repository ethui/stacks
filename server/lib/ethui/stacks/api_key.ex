defmodule Ethui.Accounts.ApiKey do
  use Ecto.Schema
  import Ecto.Changeset

  schema "api_keys" do
    field(:token, :string)
    field(:expires_at, :utc_datetime)

    belongs_to(:stack, Ethui.Stacks.Stack)

    timestamps()
  end

  def changeset(api_key, attrs) do
    api_key
    |> cast(attrs, [:stack_id, :expires_at])
    |> validate_required([:stack_id])
    |> put_token()
    |> unique_constraint(:token)
    |> foreign_key_constraint(:stack_id)
  end

  defp put_token(changeset) do
    if get_field(changeset, :token) do
      changeset
    else
      token = generate_token()
      put_change(changeset, :token, token)
    end
  end

  defp generate_token do
    :crypto.strong_rand_bytes(24)
    |> Base.url_encode64(padding: false)
  end
end
