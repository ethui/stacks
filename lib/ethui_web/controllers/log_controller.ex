defmodule EthuiWeb.LogController do
  use EthuiWeb, :controller
  require Logger

  alias Ethui.Services.Anvil

  def show(%Plug.Conn{assigns: %{proxy: %{slug: slug, component: nil}}} = conn,_params) do
    case Registry.lookup(Ethui.Stacks.Registry, {slug, :anvil}) do
      [{pid, _}] ->
        Anvil.subscribe_logs(pid)

        conn
        |> put_resp_header("content-type", "text/plain")
        |> send_chunked(:ok)
        |> stream(slug, pid)

      _ ->
        conn
        |> put_status(:not_found)
        |> json(%{})
    end
  end

  defp stream(conn, slug, pid) do
    receive do
      {:logs, :anvil, ^slug, logs} ->
        joined = Enum.join(logs, "\n") <> "\n"

        case chunk(conn, joined) do
          {:ok, conn} -> stream(conn, slug, pid)
          {:error, _} -> conn
        end

      msg ->
        Logger.warning(
          "Unexpected message received when streaming logs for #{slug}, #{inspect(msg)}"
        )

        stream(conn, slug, pid)
    end
  end
end
