defmodule EthuiWeb.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """

  use EthuiWeb, :controller

  alias Ethui.Telemetry

  # Handles Ecto changeset errors.
  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    Telemetry.exec([:errors], %{type: :changeset_error})

    conn
    |> put_status(:unprocessable_entity)
    |> put_view(json: EthuiWeb.ChangesetJSON)
    |> render(:error, changeset: changeset)
  end

  # Handles not found errors.
  def call(conn, {:error, :not_found}) do
    Telemetry.exec([:errors], %{type: :not_found})

    conn
    |> put_status(:not_found)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:"404")
  end

  # Handles unauthorized access errors.
  def call(conn, {:error, :unauthorized}) do
    Telemetry.exec([:errors], %{type: :unauthorized})

    conn
    |> put_status(:forbidden)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:"403")
  end

  def call(conn, {:error, {:user_limit_exceeded, limit}}) do
    Telemetry.exec([:errors], %{type: :user_limit_exceeded})

    conn
    |> put_status(:forbidden)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error,
      error: "User stack limit reached (maximum #{limit} stacks)"
    )
  end

  def call(conn, {:error, {:global_limit_exceeded, limit}}) do
    Telemetry.exec([:errors], %{type: :global_limit_exceeded})

    conn
    |> put_status(:service_unavailable)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error,
      error: "Global stack limit reached (maximum #{limit} stacks)"
    )
  end

  # Handles generic errors.
  def call(conn, {:error, reason}) when is_binary(reason) do
    Telemetry.exec([:errors], %{type: :validation_error})

    conn
    |> put_status(:unprocessable_entity)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error, error: reason)
  end

  # Handles unexpected errors.
  def call(conn, _error) do
    Telemetry.exec([:errors], %{type: :internal_server_error})

    conn
    |> put_status(:internal_server_error)
    |> put_view(json: EthuiWeb.ErrorJSON)
    |> render(:error, error: "Internal server error")
  end
end
