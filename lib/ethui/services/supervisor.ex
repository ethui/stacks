defmodule Ethui.Services.Supervisor do
  @moduledoc """
  Global supervisor that manages the ethui services
  """

  alias Ethui.Stacks
  alias Ethui.Services.HttpPorts
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
      {Stacks.Supervisor, name: Stacks.Supervisor, registry: @registry_name},
      {Stacks.Server,
       supervisor: Stacks.Supervisor,
       ports: HttpPorts,
       name: Stacks.Server,
       registry: @registry_name}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
