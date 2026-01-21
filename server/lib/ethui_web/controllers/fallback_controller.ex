defmodule EthuiWeb.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """

  use EthuiWeb, :controller

  # Handles Ecto changeset errors.
  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(json: EthuiWeb.ChangesetJSON)
    |> render(:error, changeset: changeset)
  end

  # Handles not found errors.
  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:"404")
  end

  # Handles unauthorized access errors.
  def call(conn, {:error, :unauthorized}) do
    conn
    |> put_status(:forbidden)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:"403")
  end

  # Handles generic errors.
  def call(conn, {:error, reason}) when is_binary(reason) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error, error: reason)
  end

  # Handles unexpected errors.
  def call(conn, _error) do
    conn
    |> put_status(:internal_server_error)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error, error: "Internal server error")
  end
end
