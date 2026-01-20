defmodule EthuiWeb.FallbackController do
  @moduledoc """
  Fallback controller for handling common error cases in API controllers.

  This controller is used with `action_fallback` to provide consistent
  error handling across all API endpoints.
  """

  use EthuiWeb, :controller

  @doc """
  Handles Ecto changeset errors.
  """
  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(json: EthuiWeb.ChangesetJSON)
    |> render(:error, changeset: changeset)
  end

  @doc """
  Handles not found errors.
  """
  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:"404")
  end

  @doc """
  Handles unauthorized access errors.
  """
  def call(conn, {:error, :unauthorized}) do
    conn
    |> put_status(:forbidden)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:"403")
  end

  @doc """
  Handles generic errors.
  """
  def call(conn, {:error, reason}) when is_binary(reason) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error, error: reason)
  end

  @doc """
  Handles unexpected errors.
  """
  def call(conn, _error) do
    conn
    |> put_status(:internal_server_error)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error, error: "Internal server error")
  end
end
