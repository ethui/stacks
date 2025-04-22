defmodule Ethui.Stacks.SingleStackSupervisor do
  @moduledoc """
    A supervisor for a single stack instance.
    One of these will be launched for each individual stack, containing:
    - anvil node
  """

  use Supervisor

  alias Ethui.Services.{Anvil, Graph}

  @type opts :: [
          slug: String.t(),
          anvil: Anvil.opts(),
          graph: Graph.opts()
        ]

  @spec start_link(opts) :: Supervisor.on_start()
  def start_link(opts) do
    Supervisor.start_link(__MODULE__, opts, name: name(opts[:slug]))
  end

  def name(slug) do
    {:via, Registry, {Ethui.Stacks.Registry, {slug, :supervisor}}}
  end

  def init(opts) do
    children = [{Anvil, opts[:anvil]}]

    # runnings subgraphs in test mode is not feasible, so we skip them
    if Mix.env() != :test do
      children = [{Graph, opts[:graph]} | children]
    end

    Supervisor.init(children, strategy: :one_for_one)
  end
end
