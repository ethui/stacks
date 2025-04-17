defmodule Ethui.Stacks.MultiStackSupervisor do
  @moduledoc """
    Supervisor used by `__MODULE__.Stacks` to dynamically supervise individual stacks
  """

  use DynamicSupervisor

  alias Ethui.Stacks.SingleStackSupervisor

  def start_link(opts \\ []) do
    DynamicSupervisor.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl DynamicSupervisor
  def init(_opts) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  @spec start_stack(Anvil.opts()) :: {:ok, pid} | {:error, any}
  def start_stack(anvil_opts) do
    # TODO replace this with a supervisor for this stack (which right now is only anvil)
    spec = {SingleStackSupervisor, [anvil: anvil_opts]}
    DynamicSupervisor.start_child(__MODULE__, spec)
  end

  @spec stop_stack(pid) :: :ok
  def stop_stack(stack) do
    DynamicSupervisor.terminate_child(__MODULE__, stack)
  end
end
