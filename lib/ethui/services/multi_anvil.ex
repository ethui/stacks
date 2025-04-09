defmodule Ethui.Services.MultiAnvil do
  alias Ethui.Services.Anvil
  use DynamicSupervisor

  def start_link(opts \\ []) do
    DynamicSupervisor.start_link(__MODULE__, opts, name: opts[:name])
  end

  @impl DynamicSupervisor
  def init(_opts) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def start_anvil(pid, opts) do
    spec = {Anvil, opts}
    DynamicSupervisor.start_child(pid, spec)
  end

  def stop_anvil(pid, anvil) do
    DynamicSupervisor.terminate_child(pid, anvil)
  end
end
