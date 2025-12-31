defmodule EthuiWeb.ApiKeyController do
  use EthuiWeb, :controller
  alias Ethui.Accounts

  def create(conn, %{"stack_slug" => slug}) do
    user = conn.assigns.current_user

    case Accounts.create_api_key(user, slug) do
      {:ok, api_key} ->
        conn
        |> put_status(:created)
        |> json(%{data: serialize_api_key(api_key)})

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{status: "error", error: "Stack not found"})

      {:error, _reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{status: "error", error: "Unable to create API key"})
    end
  end

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

      {:error, _reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{status: "error", error: "Unable to create API key"})
    end
  end

  def delete(conn, %{"stack_slug" => stack_slug}) do
    user = conn.assigns.current_user

    case Accounts.delete_api_key(user, stack_slug) do
      {:ok, api_key} ->
        conn
        |> json(%{data: serialize_api_key(api_key)})

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{status: "error", error: "Stack not found"})

      {:error, _reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{status: "error", error: "Unable to create API key"})
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
