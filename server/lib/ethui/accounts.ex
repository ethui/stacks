defmodule Ethui.Accounts do
  @moduledoc """
  The Accounts context for managing user authentication with 6-digit codes.
  """

  import Ecto.Query, warn: false
  alias Ethui.Repo
  alias Ethui.Accounts.User
  alias Ethui.Mailer
  alias Ethui.Stacks.Stack
  alias Ethui.Stacks

  alias Ethui.Accounts.ApiKey

  ## Database getters

  @doc """
  Gets a user by email.
  """
  def get_user_by_email(email) when is_binary(email) do
    Repo.get_by(User, email: String.downcase(email))
  end

  @doc """
  Gets a single user.
  """
  def get_user!(id), do: Repo.get!(User, id)

  ## Authentication

  @doc """
  Creates or updates a user and sends a 6-digit verification code.
  """
  def send_verification_code(email) do
    normalized_email = String.downcase(email)

    case get_user_by_email(normalized_email) do
      nil ->
        %User{}
        |> User.email_changeset(%{email: normalized_email})
        |> Repo.insert()
        |> case do
          {:ok, user} ->
            code = generate_verification_code()
            update_verification_code(user, code)
            send_verification_email(user, code)
            {:ok, user}

          error ->
            error
        end

      user ->
        code = generate_verification_code()
        update_verification_code(user, code)
        send_verification_email(user, code)
        {:ok, user}
    end
  end

  @doc """
  Verifies a 6-digit code and returns a JWT token if valid.
  """
  def verify_code_and_generate_token(email, code) do
    user = get_user_by_email(String.downcase(email))

    if user && user.verification_code == to_string(code) &&
         not expired?(user.verification_code_sent_at, 1) do
      # Mark user as verified
      {:ok, verified_user} =
        user
        |> User.verify_changeset()
        |> Repo.update()

      # Generate JWT token
      generate_token(verified_user)
    else
      {:error, :invalid_code}
    end
  end

  @doc """
  Generates a 6-digit verification code.
  """
  def generate_verification_code do
    Enum.random(100_000..999_999) |> to_string()
  end

  @doc """
  Updates a user's verification code.
  """
  def update_verification_code(user, code) do
    user
    |> User.verification_code_changeset(code)
    |> Repo.update()
  end

  @doc """
  Sends a verification email with the 6-digit code.
  """
  def send_verification_email(user, code) do
    Mailer.auth_code(user, code)
    |> Mailer.deliver()
  end

  # Checks if a verification code has expired (1 hour limit).
  defp expired?(sent_at, limit_in_hours) do
    if sent_at do
      hours_ago = NaiveDateTime.utc_now() |> NaiveDateTime.add(-limit_in_hours * 60 * 60, :second)
      NaiveDateTime.compare(sent_at, hours_ago) == :lt
    else
      true
    end
  end

  @doc """
  Generates a JWT token for a user.
  """
  def generate_token(user) do
    signer = Joken.Signer.create("HS256", Application.fetch_env!(:ethui, :jwt_secret))

    claims = %{
      "sub" => user.id,
      "email" => user.email,
      # 7 days
      "exp" => System.system_time(:second) + 60 * 60 * 24 * 7
    }

    case Joken.generate_and_sign(%{}, claims, signer) do
      {:ok, token, _claims} -> {:ok, token}
      error -> error
    end
  end

  @doc """
  Verifies a JWT token and returns the user.
  """
  def verify_token(token) do
    signer = Joken.Signer.create("HS256", Application.fetch_env!(:ethui, :jwt_secret))

    case Joken.verify_and_validate(%{}, token, signer) do
      {:ok, claims} ->
        user = get_user!(claims["sub"])
        {:ok, user}

      error ->
        error
    end
  end

  def get_stack_api_key(%User{id: user_id}, slug) do
    case Stacks.get_user_stack_by_slug(user_id, slug) do
      %Stack{} = stack ->
        {:ok, stack.api_key}

      nil ->
        {:error, :not_found}
    end
  end

  def create_api_key(%User{id: user_id}, slug) do
    with %Stack{} = stack <- Stacks.get_user_stack_by_slug(user_id, slug),
         {:ok, api_key} <- create_api_key(stack) do
      {:ok, api_key}
    else
      nil -> {:error, :not_found}
    end
  end

  def create_api_key(%Stack{id: id}) do
    %ApiKey{}
    |> ApiKey.changeset(%{stack_id: id})
    |> Repo.insert()
  end

  def delete_api_key(%User{id: user_id}, slug) do
    with %Stack{} = stack <- Stacks.get_user_stack_by_slug(user_id, slug),
         %ApiKey{} = api_key <- Repo.get_by(ApiKey, stack_id: stack.id),
         {:ok, _} <- Repo.delete(api_key) do
      {:ok, :deleted}
    else
      nil -> {:error, :not_found}
      error -> error
    end
  end

  def rotate_api_key(user, slug) do
    Ecto.Multi.new()
    |> Ecto.Multi.run(:delete_api_key, fn _repo, _changes ->
      delete_api_key(user, slug)
    end)
    |> Ecto.Multi.run(:api_key, fn _repo, _changes ->
      create_api_key(user, slug)
    end)
    |> Repo.transaction()
    |> case do
      {:ok, %{api_key: api_key}} ->
        {:ok, api_key}

      {:error, _step, reason, _changes} ->
        {:error, reason}
    end
  end

  def get_api_key_by_token(token) do
    ApiKey
    |> where([k], k.token == ^token)
    |> preload([:stack])
    |> Repo.one()
  end
end
