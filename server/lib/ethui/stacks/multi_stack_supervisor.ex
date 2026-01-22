defmodule Ethui.Stacks.MultiStackSupervisor do
  @moduledoc """
    Supervisor used by `__MODULE__.Stacks` to dynamically supervise individual stacks
  """

  use DynamicSupervisor

  alias Ethui.Stacks.SingleStackSupervisor

  @type opts_value :: String.t() | number()
  @type opts_map :: %{optional(String.t()) => opts_value()}

  @type opts :: [
          slug: String.t(),
          hash: String.t(),
          anvil_opts: opts_map,
          graph_opts: opts_map,
          id: integer()
        ]

  def start_link(opts \\ []) do
    DynamicSupervisor.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl DynamicSupervisor
  def init(_opts) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  # @spec create_stack(opts) :: {:ok, pid} | {:error, term}
  # @spec create_stack(opts) ::
  #        {:error, :failed | :ignored | :max_children} | {:ok, any()}
  @spec create_stack(opts) :: {:ok, pid} | {:error, term}
  def create_stack(opts) do
    opts = [
      slug: opts[:slug],
      anvil: [id: opts[:id], slug: opts[:slug], hash: opts[:hash], anvil_opts: opts[:anvil_opts]],
      graph: [slug: opts[:slug], hash: opts[:hash], graph_opts: opts[:graph_opts]]
    ]

    case DynamicSupervisor.start_child(__MODULE__, {SingleStackSupervisor, opts}) do
      {:ok, pid} -> {:ok, pid}
      {:ok, pid, _info} -> {:ok, pid}
      {:error, {:already_started, pid}} -> {:ok, pid}
      {:error, :max_children} -> {:error, :max_children}
      {:error, error} -> {:error, error}
      :ignore -> {:error, :ignored}
    end
  end

  @spec destroy_stack(pid) :: :ok
  def destroy_stack(stack) do
    SingleStackSupervisor.cleanup_anvil(stack)
    DynamicSupervisor.terminate_child(__MODULE__, stack)
  end
end
