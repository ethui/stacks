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
    # A port this pool believes is free can still be held by a process that
    # outlived the stack that owned it. Handing it out anyway gives the caller
    # a port it cannot bind - or worse, one where the old process answers - so
    # occupied ports are marked claimed and skipped.
    {port, claimed} =
      Enum.reduce_while(range, {nil, claimed}, fn port, {_, claimed} ->
        cond do
          MapSet.member?(claimed, port) -> {:cont, {nil, claimed}}
          bindable?(port) -> {:halt, {port, MapSet.put(claimed, port)}}
          true -> {:cont, {nil, MapSet.put(claimed, port)}}
        end
      end)

    case port do
      nil -> {:reply, {:error, :no_ports_available}, %{state | claimed: claimed}}
      port -> {:reply, {:ok, port}, %{state | claimed: claimed}}
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

  defp bindable?(port) do
    case :gen_tcp.listen(port, [:binary, reuseaddr: true]) do
      {:ok, socket} ->
        :gen_tcp.close(socket)
        true

      {:error, _reason} ->
        false
    end
  end
end
