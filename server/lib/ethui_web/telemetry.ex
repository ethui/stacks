defmodule EthuiWeb.Telemetry do
  use Supervisor
  import Telemetry.Metrics

  def start_link(arg) do
    Supervisor.start_link(__MODULE__, arg, name: __MODULE__)
  end

  @impl true
  def init(_arg) do
    children = [
      # Telemetry poller will execute the given period measurements
      # every 10_000ms. Learn more here: https://hexdocs.pm/telemetry_metrics
      {:telemetry_poller, measurements: periodic_measurements(), period: 10_000},
      # Prometheus metrics reporter
      {TelemetryMetricsPrometheus.Core, metrics: metrics(), name: __MODULE__.Prometheus}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end

  def metrics do
    [
      # Phoenix Metrics
      distribution("phoenix.endpoint.stop.duration",
        unit: {:native, :millisecond},
        description: "Phoenix endpoint response time",
        reporter_options: [buckets: [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000]]
      ),
      distribution("phoenix.router_dispatch.stop.duration",
        tags: [:route],
        unit: {:native, :millisecond},
        description: "Phoenix router dispatch time by route",
        reporter_options: [buckets: [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000]]
      ),
      distribution("phoenix.router_dispatch.exception.duration",
        tags: [:route],
        unit: {:native, :millisecond},
        description: "Phoenix router exception duration",
        reporter_options: [buckets: [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000]]
      ),
      distribution("phoenix.socket_connected.duration",
        unit: {:native, :millisecond},
        description: "WebSocket connection time",
        reporter_options: [buckets: [100, 250, 500, 1000, 2500, 5000]]
      ),
      sum("phoenix.socket_drain.count",
        description: "WebSocket drain count"
      ),
      distribution("phoenix.channel_joined.duration",
        unit: {:native, :millisecond},
        description: "Channel join duration",
        reporter_options: [buckets: [100, 250, 500, 1000, 2500, 5000]]
      ),
      distribution("phoenix.channel_handled_in.duration",
        tags: [:event],
        unit: {:native, :millisecond},
        description: "Channel message handling duration",
        reporter_options: [buckets: [10, 50, 100, 250, 500, 1000]]
      ),

      # Database Metrics
      distribution("ethui.repo.query.total_time",
        unit: {:native, :millisecond},
        description: "Total database query time",
        reporter_options: [buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000]]
      ),
      distribution("ethui.repo.query.decode_time",
        unit: {:native, :millisecond},
        description: "Time spent decoding database results",
        reporter_options: [buckets: [1, 5, 10, 25, 50, 100, 250]]
      ),
      distribution("ethui.repo.query.query_time",
        unit: {:native, :millisecond},
        description: "Time spent executing database query",
        reporter_options: [buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000]]
      ),
      distribution("ethui.repo.query.queue_time",
        unit: {:native, :millisecond},
        description: "Time spent waiting for database connection",
        reporter_options: [buckets: [1, 5, 10, 25, 50, 100, 250]]
      ),
      distribution("ethui.repo.query.idle_time",
        unit: {:native, :millisecond},
        description: "Database connection idle time before query",
        reporter_options: [buckets: [10, 50, 100, 250, 500, 1000]]
      ),

      # VM Metrics
      last_value("vm.memory.total",
        unit: {:byte, :kilobyte},
        description: "Total VM memory usage"
      ),
      last_value("vm.total_run_queue_lengths.total",
        description: "Total run queue length"
      ),
      last_value("vm.total_run_queue_lengths.cpu",
        description: "CPU run queue length"
      ),
      last_value("vm.total_run_queue_lengths.io",
        description: "IO run queue length"
      ),

      # Application Metrics
      counter("ethui.stacks.created.count",
        description: "Total number of stacks created"
      ),
      counter("ethui.stacks.deleted.count",
        description: "Total number of stacks deleted"
      ),
      last_value("ethui.stacks.active.count",
        description: "Current number of active stacks"
      ),
      counter("ethui.api.requests.count",
        tags: [:method, :path, :status],
        description: "API request count by method, path, and status"
      ),
      counter("ethui.auth.code_sent.count",
        description: "Number of authentication codes sent"
      ),
      counter("ethui.auth.code_verified.count",
        tags: [:status],
        description: "Number of authentication verification attempts"
      ),
      counter("ethui.errors.count",
        tags: [:type],
        description: "Application errors by type"
      )
    ]
  end

  defp periodic_measurements do
    [
      # A module, function and arguments to be invoked periodically.
      # This function must call :telemetry.execute/3 and a metric must be added above.
      # {EthuiWeb, :count_users, []}
    ]
  end
end
