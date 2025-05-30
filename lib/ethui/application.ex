defmodule Ethui.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      EthuiWeb.Telemetry,
      Ethui.Repo,
      {DNSCluster, query: Application.get_env(:ethui, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Ethui.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Ethui.Finch},
      # Start a worker by calling: Ethui.Worker.start_link(arg)
      # {Ethui.Worker, arg},
      # Start to serve requests, typically the last entry
      EthuiWeb.Endpoint,
      Ethui.Stacks.Supervisor
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Ethui.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    EthuiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
