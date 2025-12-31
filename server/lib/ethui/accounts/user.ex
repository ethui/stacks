defmodule Ethui.Accounts.User do
  @moduledoc """
  A user schema.
  """

  use Ecto.Schema
  import Ecto.Changeset
  alias Ethui.Stacks.Stack

  schema "users" do
    field(:email, :string)
    field(:verification_code, :string)
    field(:verification_code_sent_at, :naive_datetime)
    field(:verified_at, :naive_datetime)

    has_many(:stacks, Stack)
    has_many(:api_key, through: [:stacks, :api_key])

    timestamps()
  end

  @doc """
  A user changeset for registration/login.
  """
  def email_changeset(user, attrs) do
    user
    |> cast(attrs, [:email])
    |> validate_required([:email])
    |> normalize_email()
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+$/, message: "must have the @ sign and no spaces")
    |> validate_length(:email, max: 160)
    |> unsafe_validate_unique(:email, Ethui.Repo)
    |> unique_constraint(:email)
  end

  defp normalize_email(changeset) do
    case get_change(changeset, :email) do
      nil -> changeset
      email -> put_change(changeset, :email, String.downcase(email))
    end
  end

  @doc """
  Sets a 6-digit verification code for the user.
  """
  def verification_code_changeset(user, code) do
    change(user, %{
      verification_code: code,
      verification_code_sent_at: NaiveDateTime.utc_now(:second)
    })
  end

  @doc """
  Verifies the user by setting the verified_at timestamp.
  """
  def verify_changeset(user) do
    change(user, %{
      verified_at: NaiveDateTime.utc_now(:second),
      verification_code: nil,
      verification_code_sent_at: nil
    })
  end
end
