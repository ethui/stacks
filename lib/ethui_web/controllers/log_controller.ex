defmodule EthuiWeb.LogController do
  use EthuiWeb, :controller
  require Logger

  alias Ethui.Services.Anvil

  def show(conn, %{"slug" => slug}) do
    with [{pid, _}] <- Registry.lookup(Ethui.Stacks.Registry, slug),
         Anvil.subscribe_logs(pid) do
      conn =
        conn
        |> put_resp_header("content-type", "text/plain")
        |> send_chunked(200)

      stream(conn, slug, pid)
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
