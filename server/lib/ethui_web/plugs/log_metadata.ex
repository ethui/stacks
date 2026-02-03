defmodule EthuiWeb.Plugs.LogMetadata do
  @moduledoc """
  Adds request-specific metadata to logs for structured JSON logging.

  This plug enriches logs with contextual information including:
  - Request ID, remote IP, HTTP method, and path
  - User ID (if authenticated)
  - Stack slug (if available from subdomain routing)
  - Response status and duration (added before sending response)
  """

  import Plug.Conn
  require Logger

  def init(opts), do: opts

  def call(conn, _opts) do
    Logger.metadata(
      request_id: get_request_id(conn),
      remote_ip: format_ip(conn.remote_ip),
      method: conn.method,
      path: conn.request_path
    )

    # Add user_id if authenticated
    case conn.assigns[:current_user] do
      %{id: user_id} -> Logger.metadata(user_id: user_id)
      _ -> :ok
    end

    # Add stack_slug if available (from subdomain routing)
    case conn.assigns[:stack] do
      %{slug: slug} -> Logger.metadata(stack_slug: slug)
      _ -> :ok
    end

    register_before_send(conn, fn conn ->
      # Add response metadata before sending
      Logger.metadata(
        status: conn.status,
        duration: calculate_duration(conn)
      )
      conn
    end)
  end

  defp get_request_id(conn) do
    case get_resp_header(conn, "x-request-id") do
      [request_id] -> request_id
      _ -> Logger.metadata()[:request_id]
    end
  end

  defp format_ip({a, b, c, d}), do: "#{a}.#{b}.#{c}.#{d}"
  defp format_ip(ip), do: inspect(ip)

  defp calculate_duration(conn) do
    case conn.private[:phoenix_endpoint_start] do
      %{system: start} ->
        System.monotonic_time()
        |> Kernel.-(start)
        |> System.convert_time_unit(:native, :microsecond)

      _ ->
        nil
    end
  end
end
