defmodule Ethui.Proxy.Http do
  require Logger
  import Plug.Conn
  import Phoenix.Controller, only: [redirect: 2, json: 2]

  def forward(conn, url) do
    proxied_path = Map.get(conn.path_params, "proxied_path", [])
    base_path = proxy_base_path(conn.path_info, proxied_path)

    {:ok, body, conn} = read_body(conn)

    conn
    |> send_request(url, body)
    |> handle_response(conn, base_path)
  end

  defp send_request(conn, url, body) do
    Tesla.request(Tesla.client([]),
      method: method_atom(conn.method),
      url: url,
      query: conn.query_params,
      body: body,
      headers: forward_headers(conn.req_headers)
    )
  end

  defp handle_response(
         {:ok, %Tesla.Env{status: status, headers: headers, body: body}},
         conn,
         _
       )
       when status not in [301, 302] do
    conn
    |> copy_headers(headers)
    |> send_resp(status, body)
  end

  defp handle_response(
         {:ok, %Tesla.Env{headers: headers}},
         conn,
         base_path
       ) do
    location =
      Enum.find_value(headers, fn
        {"location", v} -> v
        _ -> nil
      end)

    redirect(conn,
      to:
        ["/" | base_path]
        |> Path.join()
        |> Path.join(location)
        |> String.replace(~r"/+", "/")
    )
  end

  defp handle_response({:error, reason}, conn, _) do
    Logger.error("Proxy request failed: #{inspect(reason)}")

    conn
    |> put_status(:bad_gateway)
    |> json(%{error: "Failed to forward request"})
  end

  defp forward_headers(headers) do
    Enum.reject(headers, fn {k, _} ->
      k in ["host", "content-length"]
    end)
  end

  defp copy_headers(conn, headers) do
    Enum.reduce(headers, conn, fn {k, v}, acc ->
      put_resp_header(acc, String.downcase(k), v)
    end)
  end

  defp proxy_base_path(full, proxied) do
    Enum.take(full, length(full) - length(proxied))
  end

  defp method_atom(method),
    do: method |> String.downcase() |> String.to_atom()
end
