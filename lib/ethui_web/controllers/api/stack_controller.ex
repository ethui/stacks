defmodule EthuiWeb.Api.StackController do
  use EthuiWeb, :controller

  alias Ethui.Stacks.{Server, Stack}
  alias Ethui.Repo

  def index(conn, _params) do
    anvils =
      Server.list()

    json(conn, %{
      status: "success",
      data: anvils
    })
  end

  def create(conn, params) do
    with changeset <- Stack.create_changeset(params),
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
    with %Stack{} = stack <- Repo.get_by(Stack, slug: slug),
         _ <- Server.stop(stack),
         _ <- Repo.delete(stack) do
      conn |> send_resp(204, "")
    else
      nil ->
        conn |> put_status(404) |> json(%{status: "error", error: "not found"})

        #   {:error, reason} ->
        #     conn
        #     |> put_status(500)
        #     |> json(%{
        #       status: "error",
        #       error: inspect(reason)
        #     })
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
