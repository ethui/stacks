defmodule EthuiWeb.AuthController do
  use EthuiWeb, :controller

  alias Ethui.Accounts

  @doc """
  Endpoint to send verification code to email address.
  Accepts: {"email": "user@example.com"}
  Returns: {"message": "Verification code sent"}
  """
  def send_code(conn, %{"email" => email}) do
    case Accounts.send_verification_code(email) do
      {:ok, _user} ->
        conn
        |> put_status(:ok)
        |> json(%{message: "Verification code sent"})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: format_changeset_errors(changeset)})
    end
  end

  @doc """
  Endpoint to verify 6-digit code and receive JWT token.
  Accepts: {"email": "user@example.com", "code": "123456"}
  Returns: {"token": "jwt_token_here"}
  """
  def verify_code(conn, %{"email" => email, "code" => code}) do
    case Accounts.verify_code_and_generate_token(email, code) do
      {:ok, token} ->
        conn
        |> put_status(:ok)
        |> json(%{token: token})

      {:error, :invalid_code} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Invalid or expired verification code"})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: reason})
    end
  end

  defp format_changeset_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
  end
end