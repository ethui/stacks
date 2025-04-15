defmodule Ethui.Stacks.HttpPorts do
  @moduledoc """
  GenServer that manages a range of HTTP ports
  """

  use GenServer

  @type t() :: [
          range: Range.t(),
          claimed: MapSet.t(pos_integer())
        ]

  @type opts() :: [
          range: Range.t()
        ]

  @spec start_link(opts) :: GenServer.on_start()
  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  #
  # Client
  #

  @doc "Claim a port. Prevents other processes from claiming it"
  @spec claim :: {:ok, pos_integer} | {:error, :no_ports_available}
  def claim do
    GenServer.call(__MODULE__, :claim)
  end

  @doc "Check if a port is claimed"
  @spec claimed?(pos_integer) :: boolean
  def claimed?(port) do
    GenServer.call(__MODULE__, {:claimed?, port})
  end

  @doc "Free a port. Allows other processes to claim it"
  @spec free(pos_integer()) :: :ok
  def free(port) do
    GenServer.cast(__MODULE__, {:free, port})
  end

  #
  # Server
  #

  @impl GenServer
  def init(opts) do
    Process.flag(:trap_exit, true)
    {:ok, %{range: opts[:range], claimed: MapSet.new()}}
  end

  @impl GenServer
  def handle_call(:claim, _from, %{range: range, claimed: claimed} = state) do
    first_free =
      range |> Enum.find(fn port -> not MapSet.member?(claimed, port) end)

    case first_free do
      nil ->
        {:reply, {:error, :no_ports_available}, state}

      port ->
        new_state = %{state | claimed: MapSet.put(claimed, port)}
        {:reply, {:ok, first_free}, new_state}
    end
  end

  @impl GenServer
  def handle_call({:claimed?, port}, _from, %{claimed: claimed} = state) do
    {:reply, MapSet.member?(claimed, port), state}
  end

  @impl GenServer
  def handle_cast({:free, port}, %{claimed: claimed} = state) do
    {:noreply, %{state | claimed: MapSet.delete(claimed, port)}}
  end

  @impl GenServer
  def handle_info(_, state) do
    {:noreply, state}
  end
end
