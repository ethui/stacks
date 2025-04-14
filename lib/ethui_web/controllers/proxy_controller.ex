defmodule EthuiWeb.ProxyController do
  use EthuiWeb, :controller
  alias Ethui.Services.Anvil
  require Logger

  @doc """
  Forwards POST requests to an anvil node
  """
  def anvil(%{body_params: body} = conn, %{"slug" => slug}) do
    name = {:via, Registry, {Ethui.Stacks.Registry, slug}}

    with url when not is_nil(url) <- Anvil.url(name),
         client <- build_client(url, conn.req_headers),
         {:ok, json_body} <- Jason.encode(body),
         {:ok, %{status: status, body: resp_body, headers: resp_headers}} <-
           Tesla.post(client, "/", json_body) do
      conn
      |> put_resp_headers(resp_headers)
      |> resp(status, resp_body)
    else
      nil ->
        conn
        |> put_status(:service_unavailable)
        |> json(%{error: "Stack service not available"})

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
        key not in ["host", "content-length"]
      end)

    Tesla.client([{Tesla.Middleware.BaseUrl, url}, {Tesla.Middleware.Headers, headers}])
  end
end
