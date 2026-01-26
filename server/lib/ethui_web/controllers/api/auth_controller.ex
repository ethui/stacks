defmodule EthuiWeb.Api.AuthController do
  use EthuiWeb, :controller

  alias Ethui.Accounts

  action_fallback EthuiWeb.FallbackController

  @doc """
  Endpoint to send verification code to email address.
  Accepts: {"email": "user@example.com"}
  Returns: {"message": "Verification code sent"}
  """
  def send_code(conn, %{"email" => email}) do
    with {:ok, _user} <- Accounts.send_verification_code(email) do
      render(conn, :send_code, message: "Verification code sent")
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
        render(conn, :verify_code, token: token)

      {:error, :invalid_code} ->
        {:error, "Invalid or expired verification code"}

      {:error, _reason} ->
        {:error, "Verification failed"}
    end
  end

  @doc """
  Endpoint to get current user data.
  Returns: {"email": "user@example.com"}
  """
  def me(conn, _params) do
    user = conn.assigns.current_user
    render(conn, :me, user: user)
  end
end
