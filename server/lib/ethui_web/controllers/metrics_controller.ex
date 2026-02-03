defmodule EthuiWeb.MetricsController do
  use EthuiWeb, :controller

  @moduledoc """
  Exposes Prometheus metrics for scraping.

  This endpoint is designed to be accessible only within the internal Docker/Dokploy network,
  not via external Traefik routing. Prometheus should scrape metrics directly from the
  application on port 4000.
  """

  def index(conn, _params) do
    metrics = TelemetryMetricsPrometheus.Core.scrape(EthuiWeb.Telemetry.Prometheus)

    conn
    |> put_resp_content_type("text/plain")
    |> send_resp(200, metrics)
  end
end
