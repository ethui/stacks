defmodule EthuiWeb.Api.StackController do
  use EthuiWeb, :controller

  alias Ethui.Stacks.{Server, Stack}
  alias Ethui.Stacks

  def index(conn, _params) do
    user = conn.assigns[:current_user]

    stacks = Stacks.list_stacks(user)

    stack_data =
      Enum.map(stacks, fn stack ->
        Stacks.get_info(stack)
      end)

    json(conn, %{
      status: "success",
      data: stack_data
    })
  end

  def show(conn, %{"slug" => slug}) do
    user = conn.assigns[:current_user]

    with %Stack{} = stack <- Stacks.get_stack_by_slug(slug),
         :ok <- authorize_user_access(user, stack) do
      json(conn, %{
        status: "success",
        data: Stacks.get_info(stack)
      })
    else
      nil ->
        conn |> put_status(404) |> json(%{status: "error", error: "not found"})

      {:error, :unauthorized} ->
        conn |> put_status(403) |> json(%{status: "error", error: "unauthorized"})
    end
  end

  def create(conn, params) do
    user = conn.assigns[:current_user]

    with {:ok, stack} <- Stacks.create_stack(user, params),
         _ <- Server.start(stack) do
      conn
      |> put_status(201)
      |> json(%{
        status: "success",
        data: %{
          slug: stack.slug,
          urls: Stacks.get_urls(stack),
          status: "running"
        }
      })
    else
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(422)
        |> json(%{
          status: "error",
          error: inspect(changeset.errors)
        })

      {:error, reason} ->
        conn
        |> put_status(500)
        |> json(%{
          status: "error",
          error: inspect(reason)
        })
    end
  end

  def delete(conn, %{"slug" => slug}) do
    user = conn.assigns[:current_user]

    with %Stack{} = stack <- Stacks.get_stack_by_slug(slug),
         :ok <- authorize_user_access(user, stack),
         _ <- Server.stop(stack),
         _ <- Stacks.delete_stack(stack) do
      conn |> send_resp(204, "")
    else
      nil ->
        conn |> put_status(404) |> json(%{status: "error", error: "not found"})

      {:error, :unauthorized} ->
        conn |> put_status(403) |> json(%{status: "error", error: "unauthorized"})
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
