defmodule EthuiWeb.ProxyController do
  use EthuiWeb, :controller
  alias Ethui.{Stacks, Services.Anvil}
  require Logger

  @doc """
  Forwards POST requests to an anvil node
  """
  def anvil(%{body_params: body} = conn, %{"slug" => slug}) do
    name = {:via, Registry, {Stacks.Registry, slug}}
    IO.inspect(body)

    with [{pid, _}] <- Registry.lookup(Ethui.Stacks.Registry, slug),
         url when not is_nil(url) <- Anvil.url(pid),
         client <- build_client(url, conn.req_headers),
         {:ok, json_body} <- Jason.encode(body),
         {:ok, %Tesla.Env{status: status, body: resp_body, headers: resp_headers}} <-
           Tesla.post(client, "/", json_body) do
      conn
      |> put_resp_headers(resp_headers)
      |> put_status(status)
      |> json(resp_body)
    else
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Stack not found"})

      {:error, reason} ->
        Logger.error(inspect(reason))

        conn
        |> put_status(:bad_gateway)
        |> json(%{error: "Failed to forward request", reason: inspect(reason)})
    end
  end

  defp put_resp_headers(conn, headers) do
    headers
    |> Enum.filter(fn {key, _} ->
      String.downcase(key) not in ["transfer-encoding", "connection"]
    end)
    |> Enum.reduce(conn, fn {key, value}, conn ->
      put_resp_header(conn, String.downcase(key), value)
    end)
  end

  defp build_client(url, conn_headers) do
    headers =
      conn_headers
      |> Enum.filter(fn {key, _} ->
        key not in ["host", "content-length", "content-type"]
      end)

    Tesla.client([
      {Tesla.Middleware.BaseUrl, url},
      {Tesla.Middleware.Headers, headers},
      Tesla.Middleware.JSON
    ])
  end
end
