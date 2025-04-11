defmodule Ethui.Stacks.ServicesSupervisor do
  @moduledoc """
  Supervisor used by `__MODULE__.Stacks` to dynamically supervise `anvil` instances and other required processes
  """

  alias Ethui.Services.Anvil
  use DynamicSupervisor

  def start_link(opts \\ []) do
    DynamicSupervisor.start_link(__MODULE__, opts, name: opts[:name])
  end

  @impl DynamicSupervisor
  def init(_opts) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  @spec start_stack(pid, Anvil.opts()) :: {:ok, pid} | {:error, any}
  def start_stack(pid, opts) do
    # TODO replace this with a supervisor for this stack (which right now is only anvil)
    spec = {Anvil, opts}
    DynamicSupervisor.start_child(pid, spec)
  end

  @spec stop_stack(atom, pid) :: :ok
  def stop_stack(pid, anvil) do
    DynamicSupervisor.terminate_child(pid, anvil)
  end
end
