defmodule Ethui.Stacks.Supervisor do
  @moduledoc """
  Global supervisor that manages the ethui services
  """

  alias Ethui.Stacks.{Server, HttpPorts, ServicesSupervisor}
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, [], name: opts[:name])
  end

  @registry_name __MODULE__.Registry
  @services_supervisor_name ServicesSupervisor

  @impl Supervisor
  def init(_) do
    children = [
      {HttpPorts, range: 7000..8000, name: HttpPorts},
      {Registry, keys: :unique, name: @registry_name},
      {ServicesSupervisor, name: @services_supervisor_name, registry: @registry_name},
      {Server,
       supervisor: @services_supervisor_name,
       ports: HttpPorts,
       name: Server,
       registry: @registry_name}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
