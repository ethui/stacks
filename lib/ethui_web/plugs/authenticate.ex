defmodule EthuiWeb.Plugs.Authenticate do
  @moduledoc """
  Authenticates the user by checking the token in the Authorization header.
  """

  import Plug.Conn
  import Phoenix.Controller

  alias Ethui.Accounts

  def init(opts), do: opts

  def call(conn, opts) do
    if local_mode?() do
      case Accounts.get_default_user() do
        {:ok, default_user} ->
          assign(conn, :current_user, default_user)

        {:error, _} ->
          conn
          |> put_status(:unauthorized)
          |> json(%{error: "Invalid User"})
          |> halt()
      end
    else
      if enabled?() do
        do_call(conn, opts)
      else
        conn
      end
    end
  end

  defp do_call(conn, _opts) do
    case get_req_header(conn, "authorization") do
      ["Bearer " <> token] ->
        case Accounts.verify_token(token) do
          {:ok, user} ->
            assign(conn, :current_user, user)

          {:error, _} ->
            conn
            |> put_status(:unauthorized)
            |> json(%{error: "Invalid token"})
            |> halt()
        end

      _ ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Authorization header missing"})
        |> halt()
    end
  end

  def enabled? do
    Application.get_env(:ethui, __MODULE__)[:enabled] || false
  end

  defp local_mode? do
    Application.get_env(:ethui, :local_mode, false)
  end
end
