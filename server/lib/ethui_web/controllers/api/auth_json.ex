defmodule EthuiWeb.Api.AuthJSON do
  @doc """
  Renders verification code sent response.
  """
  def send_code(%{message: message}) do
    %{status: "success", message: message}
  end

  @doc """
  Renders verification token response.
  """
  def verify_code(%{token: token}) do
    %{status: "success", token: token}
  end

  @doc """
  Renders current user response.
  """
  def me(%{user: user}) do
    %{status: "success", email: user.email}
  end
end
