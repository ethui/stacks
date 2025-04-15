defmodule Ethui.Stacks.Supervisor do
  @moduledoc """
  Global supervisor that manages the ethui services
  """

  alias Ethui.Stacks.{Server, Stack, HttpPorts, ServicesSupervisor}
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, [], name: opts[:name])
  end

  @registry_name Ethui.Stacks.Registry
  @services_supervisor_name ServicesSupervisor

  @port_range if Mix.env() == :test, do: 20_000..21_000, else: 7000..10_000

  @impl Supervisor
  def init(_) do
    children = [
      # database watcher
      {EctoWatch,
       repo: Ethui.Repo,
       pub_sub: Ethui.PubSub,
       watchers: [
         {Stack, :inserted, extra_columns: [:slug, :inserted_at]},
         {Stack, :deleted, extra_columns: [:slug]},
         {Stack, :updated}
       ]},

      # http port reservation
      {HttpPorts, range: @port_range},

      # named registry for services
      {Registry, keys: :unique, name: @registry_name},

      # services supervisor
      ServicesSupervisor,
      {Server, supervisor: @services_supervisor_name, ports: HttpPorts, registry: @registry_name}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
