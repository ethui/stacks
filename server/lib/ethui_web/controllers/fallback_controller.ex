defmodule EthuiWeb.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """

  use EthuiWeb, :controller

  alias Ethui.Stacks

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

  def call(conn, {:error, :user_limit_exceeded}) do
    conn
    |> put_status(:forbidden)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error,
      error: "User stack limit reached (maximum #{Stacks.max_stacks_per_user()} stacks)"
    )
  end

  def call(conn, {:error, :global_limit_exceeded}) do
    conn
    |> put_status(:service_unavailable)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error,
      error: "Global stack limit reached (maximum #{Stacks.max_total_stacks()} stacks)"
    )
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
