defmodule EthuiWeb.Plugs.Authenticate do
  import Plug.Conn
  import Phoenix.Controller

  alias Ethui.Accounts

  def init(opts), do: opts

  def call(conn, opts) do
    if enabled?() do
      do_call(conn, opts)
    else
      conn
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
    Application.get_env(:ethui, __MODULE__)[:enabled]
    |> IO.inspect()
  end
end
