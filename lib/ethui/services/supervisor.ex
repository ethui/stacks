defmodule Ethui.Services.Supervisor do
  alias Ethui.Services.{MultiAnvil, MultiAnvilSupervisor, HttpPorts}
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, [], name: opts[:name])
  end

  @registry_name __MODULE__.Registry

  @impl Supervisor
  def init(_) do
    children = [
      {HttpPorts, range: 7000..8000, name: HttpPorts},
      {Registry, keys: :unique, name: @registry_name},
      {MultiAnvilSupervisor, name: MultiAnvilSupervisor, registry: @registry_name},
      {MultiAnvil,
       supervisor: MultiAnvilSupervisor,
       ports: HttpPorts,
       name: MultiAnvil,
       registry: @registry_name}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
