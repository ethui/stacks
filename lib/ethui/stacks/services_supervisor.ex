defmodule Ethui.Stacks.ServicesSupervisor do
  @moduledoc """
  Supervisor used by `__MODULE__.Stacks` to dynamically supervise `anvil` instances and other required processes
  """

  alias Ethui.Services.Anvil
  use DynamicSupervisor

  def start_link(opts \\ []) do
    DynamicSupervisor.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl DynamicSupervisor
  def init(_opts) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  @spec start_stack(Anvil.opts()) :: {:ok, pid} | {:error, any}
  def start_stack(opts) do
    # TODO replace this with a supervisor for this stack (which right now is only anvil)
    spec = {Anvil, opts}
    DynamicSupervisor.start_child(__MODULE__, spec)
  end

  @spec stop_stack(pid) :: :ok
  def stop_stack(anvil) do
    DynamicSupervisor.terminate_child(__MODULE__, anvil)
  end
end
