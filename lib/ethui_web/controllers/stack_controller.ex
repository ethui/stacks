defmodule EthuiWeb.StackController do
  use EthuiWeb, :controller

  alias Ethui.Stacks.{Server, Stack}
  alias Ethui.Repo

  @multi_anvil Server

  def index(conn, _params) do
    anvils =
      Server.list(@multi_anvil)

    json(conn, %{
      status: "success",
      data: anvils
    })
  end

  def create(conn, params) do
    case Stack.create_changeset(%Stack{}, params)
         |> Repo.insert() do
      {:ok, _stack} ->
        conn
        |> put_status(201)
        |> json(%{})

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
         _ <- Repo.delete(stack) do
      conn |> put_status(204) |> json(%{})
    else
      {:error, :not_found} ->
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

  #
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
