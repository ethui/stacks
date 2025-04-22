defmodule Ethui.Stacks.MultiStackSupervisor do
  @moduledoc """
    Supervisor used by `__MODULE__.Stacks` to dynamically supervise individual stacks
  """

  use DynamicSupervisor

  alias Ethui.Stacks.SingleStackSupervisor

  @type opts :: [
          slug: String.t(),
          hash: String.t()
        ]

  def start_link(opts \\ []) do
    DynamicSupervisor.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl DynamicSupervisor
  def init(_opts) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  @spec start_stack(opts) :: {:ok, pid} | {:error, any}
  def start_stack(opts) do
    opts = [
      slug: opts[:slug],
      anvil: [slug: opts[:slug], hash: opts[:hash]],
      graph: [slug: opts[:slug], hash: opts[:hash]]
    ]

    DynamicSupervisor.start_child(__MODULE__, {SingleStackSupervisor, opts})
  end

  @spec stop_stack(pid) :: :ok
  def stop_stack(stack) do
    DynamicSupervisor.terminate_child(__MODULE__, stack)
  end
end
