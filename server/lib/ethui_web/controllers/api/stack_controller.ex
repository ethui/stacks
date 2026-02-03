defmodule EthuiWeb.Api.StackController do
  use EthuiWeb, :controller

  alias Ethui.Stacks.{Server, Stack}
  alias Ethui.Stacks

  action_fallback EthuiWeb.FallbackController

  def index(conn, _params) do
    user = conn.assigns[:current_user]
    stacks = Stacks.list_stacks(user)
    render(conn, :index, stacks: stacks)
  end

  def show(conn, %{"slug" => slug}) do
    user = conn.assigns[:current_user]

    with %Stack{} = stack <- Stacks.get_stack_by_slug(slug),
         :ok <- authorize_user_access(user, stack) do
      render(conn, :show, stack: stack)
    else
      nil ->
        {:error, :not_found}

      error ->
        error
    end
  end

  def create(conn, params) do
    user = conn.assigns[:current_user]

    with {:ok, stack} <- Stacks.create_stack(user, params),
         _ <- Server.create(stack) do
      Ethui.Telemetry.exec(
        [:stacks, :created],
        %{user_id: user && user.id, stack_slug: stack.slug}
      )

      conn
      |> put_status(:created)
      |> render(:create, stack: stack)
    end
  end

  def delete(conn, %{"slug" => slug}) do
    user = conn.assigns[:current_user]

    with %Stack{} = stack <- Stacks.get_stack_by_slug(slug),
         :ok <- authorize_user_access(user, stack),
         _ <- Server.destroy(stack),
         {:ok, _} <- Stacks.delete_stack(stack) do
      Ethui.Telemetry.exec(
        [:stacks, :deleted],
        %{user_id: user && user.id, stack_slug: slug}
      )

      send_resp(conn, :no_content, "")
    else
      nil ->
        {:error, :not_found}

      error ->
        error
    end
  end

  # Private function to check if user has access to the stack
  defp authorize_user_access(user, stack) do
    cond do
      is_nil(user) -> :ok
      is_nil(stack.user_id) -> :ok
      user.id == stack.user_id -> :ok
      true -> {:error, :unauthorized}
    end
  end
end
