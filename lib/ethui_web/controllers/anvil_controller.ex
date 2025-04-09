defmodule EthuiWeb.AnvilController do
  use EthuiWeb, :controller
  alias Ethui.Services.{MultiAnvil, Anvil}

  @multi_anvil MultiAnvil

  def index(conn, _params) do
    # Extract the PIDs and get their URLs
    anvils =
      MultiAnvil.list(@multi_anvil)

    json(conn, %{
      status: "success",
      data: anvils
    })
  end

  def create(conn, _params) do
    id = :"#{:rand.uniform(1_000)}"

    case MultiAnvil.start_anvil(@multi_anvil, name: id) do
      {:ok, anvil} ->
        conn
        |> put_status(201)
        |> json(%{
          id: id,
          url: Anvil.url(anvil)
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

  def delete(conn, %{"id" => id}) do
    with {:ok, id} <- parse_id(id),
         :ok <- MultiAnvil.stop_anvil(@multi_anvil, id) do
      conn |> put_status(204) |> json(%{})
    else
      {:error, :not_found} ->
        conn |> put_status(404) |> json(%{status: "error", error: "not found"})

      {:error, reason} ->
        conn
        |> put_status(500)
        |> json(%{
          status: "error",
          error: inspect(reason)
        })
    end
  end

  defp parse_id(id) do
    try do
      {:ok, String.to_existing_atom(id)}
    rescue
      _ -> {:error, :not_found}
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
