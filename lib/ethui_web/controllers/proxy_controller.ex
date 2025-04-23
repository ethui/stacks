defmodule EthuiWeb.ProxyController do
  use EthuiWeb, :controller
  alias Ethui.Services.Anvil
  require Logger

  @doc """
  Forwards POST requests to an anvil node
  """
  def anvil(conn, %{"slug" => slug} = params) do
    with [{pid, _}] <- Registry.lookup(Ethui.Stacks.Registry, {slug, :anvil}),
         url when not is_nil(url) <- Anvil.url(pid) do
      request(conn,
        method: :post,
        url: url,
        query: conn.query_params,
        body: conn.private[:raw_body]
      )
    else
      _ ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Stack not found"})
    end
  end

  def subgraph_http_get(conn, %{"slug" => slug, "path" => path} = params) do
    query = params |> Map.drop(["slug", "path"])
    # TODO is there a better way to merge the url parts?
    url = "http://localhost:8000/#{Enum.join(path, "/")}"

    request(conn, method: :get, url: url, query: conn.query_params)
  end

  def subgraph_http_post(conn, %{"slug" => slug, "path" => path} = params) do
    # TODO is there a better way to merge the url parts?
    url = "http://localhost:8000/#{Enum.join(path, "/")}"

    request(conn,
      method: :post,
      url: url,
      query: conn.query_params,
      body: conn.private[:raw_body]
    )
  end

  defp request(conn, opts \\ []) do
    opts =
      Keyword.merge(opts,
        # remove host and content-length headers, since they are set by the reverse proxy
        headers: conn.req_headers |> Enum.filter(&(elem(&1, 0) not in ["host", "content-length"]))
      )

    client = Tesla.client([])

    case Tesla.request(client, opts) do
      {:ok, %Tesla.Env{status: status, body: resp_body, headers: resp_headers}} ->
        conn
        |> put_resp_headers(resp_headers)
        |> send_resp(status, resp_body)

      {:error, reason} ->
        Logger.error(inspect(reason))

        conn
        |> put_status(:bad_gateway)
        |> json(%{error: "Failed to forward request", reason: inspect(reason)})
    end
  end

  defp build_anvil_client(url, conn_headers) do
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

  defp build_client(url, conn_headers) do
    headers =
      conn_headers
      |> Enum.filter(fn {key, _} ->
        key not in ["host", "content-length"]
      end)

    Tesla.client([
      {Tesla.Middleware.BaseUrl, url},
      {Tesla.Middleware.Headers, headers}
    ])
  end

  defp put_resp_headers(conn, headers) do
    headers
    |> Enum.reduce(conn, fn {key, value}, conn ->
      put_resp_header(conn, String.downcase(key), value)
    end)
  end
end
