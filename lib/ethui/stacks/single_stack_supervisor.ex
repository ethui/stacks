defmodule Ethui.Stacks.SingleStackSupervisor do
  @moduledoc """
    A supervisor for a single stack instance.
    One of these will be launched for each individual stack, containing:
    - anvil node
  """

  @type opts :: [
          anvil: Anvil.opts()
        ]

  use Supervisor

  alias Ethui.Services.Anvil

  @spec start_link(opts) :: Supervisor.on_start()
  def start_link(opts) do
    Supervisor.start_link(__MODULE__, opts)
  end

  def init(opts) do
    children = [
      {Anvil, opts[:anvil]}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
