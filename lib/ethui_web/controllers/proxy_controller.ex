defmodule EthuiWeb.ProxyController do
  use EthuiWeb, :controller
  alias Ethui.Services.{Anvil, Graph}
  require Logger

  @doc """
    Forwards requests to the appropriate underlying service
  """
  def reverse_proxy(
        %Plug.Conn{assigns: %{proxy: %{slug: slug, component: component}}} = conn,
        params
      ),
      do: proxy_component(conn, params, {slug, component})

  def reverse_proxy(conn, _params), do: conn |> send_resp(404, "Not found")

  defp proxy_component(conn, params, {slug, nil}), do: anvil(conn, params, slug)

  defp proxy_component(conn, params, {slug, "graph"}),
    do: subgraph_generic(conn, params, slug, 8000)

  defp proxy_component(conn, params, {slug, "graph-rpc"}),
    do: subgraph_generic(conn, params, slug, 8020)

  defp proxy_component(conn, params, {slug, "graph-status"}),
    do: subgraph_generic(conn, params, slug, 8030)

  defp proxy_component(conn, params, {_slug, "ipfs"}),
    do: ipfs(conn, params)

  defp proxy_component(%Plug.Conn{assigns: assigns} = conn, _params, _proxy) do
    Logger.error("cannot proxy #{inspect(assigns)}")

    conn
    |> put_status(:not_found)
    |> json(%{error: "Route not found"})
  end

  defp anvil(conn, _params, slug) do
    with [{pid, _}] <- Registry.lookup(Ethui.Stacks.Registry, {slug, :anvil}),
         url when not is_nil(url) <- Anvil.url(pid) do
      forward(conn, url)
    else
      _ ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Stack not found"})
    end
  end

  defp subgraph_generic(conn, %{"proxied_path" => proxied_path}, slug, target_port) do
    case Graph.ip_from_slug(slug) do
      {:ok, ip} ->
        url = "http://#{ip}:#{target_port}/#{Enum.join(proxied_path, "/")}"
        forward(conn, url)

      _ ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Stack not found"})
    end
  end

  defp ipfs(conn, %{"proxied_path" => proxied_path}) do
    case Ethui.Services.Ipfs.ip() do
      {:ok, ip} ->
        forward(conn, "http://#{ip}:5001/#{Enum.join(proxied_path, "/")}")

      _ ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Stack not found"})
    end
  end

  defp forward(conn, url) do
    proxied_path = Map.get(conn.path_params, "proxied_path", [])
    base_proxy_path = proxy_path(conn.path_info, proxied_path)

    # This relies on Plug.Parsers to having run
    {:ok, body, conn} = Plug.Conn.read_body(conn)

    with {:ok, method} <- method_sym(conn.method),
         {:ok, conn} <-
           send_request(conn,
             method: method,
             url: url,
             query: conn.query_params,
             body: body
           ) do
      conn
    else
      {:redirect, new_path} ->
        to =
          ("/" <> Enum.join(base_proxy_path, "/") <> "/" <> new_path)
          |> String.replace(~r"/+", "/")

        redirect(conn, to: to)

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
      # redirect status code
      {:ok, %Tesla.Env{status: status, headers: resp_headers}} when status in [301, 302] ->
        {_, location} =
          resp_headers
          |> Enum.find(fn {k, _} -> k == "location" end)

        {:redirect, location}

      # successful response
      {:ok, %Tesla.Env{status: status, body: resp_body, headers: resp_headers}} ->
        {:ok,
         conn
         |> put_resp_headers(resp_headers)
         |> send_resp(status, resp_body)}

      # error
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

  defp proxy_path(full, proxied) do
    full
    |> Enum.take(length(full) - length(proxied))
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
