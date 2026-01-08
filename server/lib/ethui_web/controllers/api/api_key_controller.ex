defmodule EthuiWeb.ApiKeyController do
  use EthuiWeb, :controller
  alias Ethui.Accounts

  def show(conn, %{"stack_slug" => stack_slug}) do
    user = conn.assigns.current_user

    case Accounts.get_stack_api_key(user, stack_slug) do
      {:ok, api_key} ->
        conn
        |> json(%{data: serialize_api_key(api_key)})

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{status: "error", error: "Stack not found"})
    end
  end

  def update(conn, %{"stack_slug" => stack_slug}) do
    user = conn.assigns.current_user

    case Accounts.rotate_api_key(user, stack_slug) do
      {:ok, api_key} ->
        conn
        |> json(%{data: serialize_api_key(api_key)})

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{status: "error", error: "Stack not found"})
    end
  end

  defp serialize_api_key(api_key) do
    %{
      id: api_key.id,
      stack_slug: api_key.stack_id,
      token: api_key.token,
      expires_at: api_key.expires_at,
      inserted_at: api_key.inserted_at,
      updated_at: api_key.updated_at
    }
  end
end
