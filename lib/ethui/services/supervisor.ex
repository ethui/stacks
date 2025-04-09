defmodule Ethui.Services.Supervisor do
  alias Ethui.Services.{MultiAnvil, MultiAnvilSupervisor, HttpPorts}
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, [], name: opts[:name])
  end

  @impl Supervisor
  def init(_) do
    children = [
      {HttpPorts, range: 7000..8000, name: HttpPorts},
      {MultiAnvilSupervisor, name: MultiAnvilSupervisor},
      {MultiAnvil, supervisor: MultiAnvilSupervisor, ports: HttpPorts, name: MultiAnvil}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
