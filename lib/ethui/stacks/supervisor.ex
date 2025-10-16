defmodule Ethui.Stacks.Supervisor do
  @moduledoc """
  Global supervisor that manages the ethui services
  """

  use Supervisor

  alias Ethui.Stacks.{Server, HttpPorts, MultiStackSupervisor}

  @spec start_link([]) :: Supervisor.on_start()
  def start_link(_opts) do
    Supervisor.start_link(__MODULE__, [], name: __MODULE__)
  end

  @registry_name Ethui.Stacks.Registry

  @port_range if Mix.env() == :test, do: 20_000..21_000, else: 7000..10_000

  @impl Supervisor
  def init(_) do
    children = [
      # http port reservation
      {HttpPorts, range: @port_range},

      # named registry for services
      {Registry, keys: :unique, name: @registry_name},

      # global IPFS service
      {Ethui.Services.Ipfs, []},

      # global Postgres service
      {Ethui.Services.Pg, []},

      # owned instance of ethui-explorer
      {Ethui.Services.Explorer, []},

      # services supervisor
      MultiStackSupervisor,
      Server
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
