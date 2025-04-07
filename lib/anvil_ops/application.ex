defmodule AnvilOps.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      AnvilOpsWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:anvil_ops, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: AnvilOps.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: AnvilOps.Finch},
      # Start a worker by calling: AnvilOps.Worker.start_link(arg)
      # {AnvilOps.Worker, arg},
      # Start to serve requests, typically the last entry
      AnvilOpsWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: AnvilOps.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    AnvilOpsWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
