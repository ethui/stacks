defmodule EthuiWeb.MetricsController do
  use EthuiWeb, :controller

  @moduledoc """
  Exposes Prometheus metrics for scraping.
  """

  def index(conn, _params) do
    metrics = TelemetryMetricsPrometheus.Core.scrape(EthuiWeb.Telemetry.Prometheus)

    conn
    |> put_resp_content_type("text/plain")
    |> send_resp(200, metrics)
  end
end
