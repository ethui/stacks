defmodule EthuiWeb.ProxyController do
  use EthuiWeb, :controller
  alias Ethui.Services.{Anvil, Graph}
  require Logger

  @doc """
  Forwards POST requests to an anvil node
  """
  def anvil(conn, %{"slug" => slug}) do
    with [{pid, _}] <- Registry.lookup(Ethui.Stacks.Registry, {slug, :anvil}),
         url when not is_nil(url) <- Anvil.url(pid),
         {:ok, conn} <-
           send_request(conn,
             method: :post,
             url: url,
             query: conn.query_params,
             body: conn.private[:raw_body]
           ) do
      conn
    else
      _ ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Stack not found"})
    end
  end

  defp join_path(path) when is_binary(path), do: path
  defp join_path(path) when is_list(path), do: Enum.join(path, "/")

  def subgraph_http(conn, %{"slug" => slug, "path" => path}) do
    path = join_path(path)

    case Graph.ip(slug) do
      {:ok, ip} ->
        url = "http://#{ip}:8000/#{path}"
        forward(conn, :get, url, "/stacks/#{slug}/subgraph")

      error ->
        conn
        |> put_status(:server_error)
        |> json(%{error: inspect(error)})
    end

    # with {:ok, ip} <- Graph.ip(slug),
    #      url <- "http://#{ip}:8000/#{path}",
    #      # TODO is there a better way to merge the url parts?
    #      {:ok, method} <- method_sym(conn.method),
    #      {:ok, conn} <-
    #        request(conn, method: method, url: url, query: conn.query_params) do
    #   conn
    # else
    #   {:redirect, new_path} ->
    #     conn
    #     |> redirect(to: "/stacks/#{slug}/subgraph/#{new_path}")
    #
    #   :error ->
    #     conn
    #     |> put_status(:server_error)
    #     |> json(%{error: "Redirect without location header"})
    #
    #   {:error, error} ->
    #     conn
    #     |> put_status(:server_error)
    #     |> json(%{error: inspect(error)})
    # end
  end

  defp forward(conn, method, url, base_path) do
    with {:ok, method} <- method_sym(conn.method),
         {:ok, conn} <-
           send_request(conn, method: method, url: url, query: conn.query_params) do
      conn
    else
      {:redirect, new_path} ->
        conn
        |> redirect(to: "#{base_path}/#{new_path}")

      :error ->
        conn
        |> put_status(:server_error)
        |> json(%{error: "Redirect without location header"})

      {:error, error} ->
        conn
        |> put_status(:server_error)
        |> json(%{error: inspect(error)})
    end
  end

  defp send_request(conn, opts) do
    opts =
      Keyword.merge(opts,
        # remove host and content-length headers, since they are set by the reverse proxy
        headers: conn.req_headers |> Enum.filter(&(elem(&1, 0) not in ["host", "content-length"]))
      )

    client = Tesla.client([])

    case Tesla.request(client, opts) do
      {:ok, %Tesla.Env{status: status, headers: resp_headers}} when status in [301, 302] ->
        {_, location} =
          resp_headers
          |> Enum.find(fn {k, _} -> k == "location" end)

        {:redirect, location}

      {:ok, %Tesla.Env{status: status, body: resp_body, headers: resp_headers}} ->
        {:ok,
         conn
         |> put_resp_headers(resp_headers)
         |> send_resp(status, resp_body)}

      {:error, reason} ->
        Logger.error(inspect(reason))

        {:ok,
         conn
         |> put_status(:bad_gateway)
         |> json(%{error: "Failed to forward request", reason: inspect(reason)})}
    end
  end

  defp put_resp_headers(conn, headers) do
    headers
    |> Enum.reduce(conn, fn {key, value}, conn ->
      put_resp_header(conn, String.downcase(key), value)
    end)
  end

  defp method_sym("HEAD"), do: {:ok, :head}
  defp method_sym("GET"), do: {:ok, :get}
  defp method_sym("DELETE"), do: {:ok, :delete}
  defp method_sym("TRACE"), do: {:ok, :trace}
  defp method_sym("OPTIONS"), do: {:ok, :options}
  defp method_sym("POST"), do: {:ok, :post}
  defp method_sym("PUT"), do: {:ok, :put}
  defp method_sym("PATCH"), do: {:ok, :patch}
  defp method_sym(method), do: {:error, "Unknown method #{method}"}
end
