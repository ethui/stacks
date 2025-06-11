defmodule EthuiWeb.Api.StackController do
  use EthuiWeb, :controller

  alias Ethui.Stacks.{Server, Stack}
  alias Ethui.Repo
  import Ecto.Query, only: [from: 2]

  def index(conn, _params) do
    user = conn.assigns[:current_user]

    stacks = if user do
      Repo.all(from s in Stack, where: s.user_id == ^user.id)
    else
      Repo.all(Stack)
    end

    running_slugs = Server.list()

    stack_data = Enum.map(stacks, fn stack ->
      %{
        slug: stack.slug,
        status: if(stack.slug in running_slugs, do: "running", else: "stopped")
      }
    end)

    json(conn, %{
      status: "success",
      data: stack_data
    })
  end

  def create(conn, params) do
    user = conn.assigns[:current_user]

    # Add user_id to params if user is authenticated
    stack_params = if user do
      Map.put(params, "user_id", user.id)
    else
      params
    end

    with changeset <- Stack.create_changeset(stack_params),
         {:ok, stack} <- Repo.insert(changeset),
         _ <- Server.start(stack) do
      conn
      |> send_resp(201, "")
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

    with %Stack{} = stack <- Repo.get_by(Stack, slug: slug),
         :ok <- authorize_user_access(user, stack),
         _ <- Server.stop(stack),
         _ <- Repo.delete(stack) do
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

  # def logs(conn, %{"pid" => pid_string}) do
  #   # Convert the string PID back to a PID reference
  #   pid =
  #     try do
  #       pid_string
  #       |> String.replace_prefix("#PID<", "")
  #       |> String.replace_suffix(">", "")
  #       |> String.split(".")
  #       |> Enum.map(&String.to_integer/1)
  #       |> List.to_tuple()
  #       |> :c.pid()
  #     rescue
  #       _ -> nil
  #     end
  #
  #   if is_pid(pid) and Process.alive?(pid) do
  #     logs = Ethui.Services.Anvil.logs(pid)
  #
  #     json(conn, %{
  #       status: "success",
  #       data: %{
  #         pid: inspect(pid),
  #         logs: logs
  #       }
  #     })
  #   else
  #     conn
  #     |> put_status(404)
  #     |> json(%{
  #       status: "error",
  #       error: "Invalid or non-existent anvil PID"
  #     })
  #   end
  # end
end
