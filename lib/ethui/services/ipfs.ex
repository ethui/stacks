defmodule Ethui.Services.Ipfs do
  @moduledoc """
      GenServer that manages a global `ipfs` instace

      This wraps a MuontipTrap Daemon
  """

  use GenServer
  require Logger

  @type t :: %{
          # muontrap process
          proc: pid | nil,
          logs: :queue.queue(),
          log_subscribers: MapSet.t()
        }

  @log_max_size 10_000

  #
  # Client
  #

  @spec start_link(any()) :: GenServer.on_start()
  def start_link(_opts) do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

  #
  # Server
  #

  @spec init(any()) :: {:ok, t}
  @impl GenServer
  def init(_opts) do
    Process.flag(:trap_exit, true)

    send(self(), :boot)

    {:ok,
     %{
       proc: nil,
       logs: :queue.new(),
       log_subscribers: MapSet.new()
     }}
  end

  @impl GenServer
  def handle_info(:boot, state) do
    {:ok, proc} = boot_ipfs_node()

    {:noreply, %{state | proc: proc}}
  end

  @impl GenServer
  def handle_info({:EXIT, _pid, exit_status}, state) do
    case exit_status do
      0 ->
        {:stop, :normal, state}

      exit_code ->
        Logger.error("sleep exited with code #{inspect(exit_code)}")
        {:stop, :normal, state}
    end
  end

  @impl GenServer
  def handle_cast({:log, line}, %{logs: logs, log_subscribers: subs} = state) do
    for s <- subs do
      send(s, {:logs, :anvil, state.slug, [line]})
    end

    Logger.debug(line)

    new_logs = :queue.in(line, logs) |> trim()

    {:noreply, %{state | logs: new_logs}}
  end

  defp trim(q) do
    if :queue.len(q) > @log_max_size do
      {{:value, _}, q} = :queue.out(q)
      trim(q)
    else
      q
    end
  end

  defp boot_ipfs_node() do
    config = config()
    pid = self()

    named_args =
      [
        # volume: "#{config()[:ipfs_data_dir]}:/data/ipfs",
        network: "ethui-stacks",
        name: "ethui-stacks-ipfs"
      ]

    flags = [
      # forces the container to be deleted after stopping, prevent issues with duplicate container named_args
      "rm",
      # makes sure signals are forwarded to the graph node, so that shutdowns work properly
      "init"
    ]

    args =
      format_docker_args(named_args, flags)

    MuonTrap.Daemon.start_link("docker", args,
      logger_fun: fn f -> GenServer.cast(pid, {:log, f}) end,
      stderr_to_stdout: true,
      exit_status_to_reason: & &1
    )
  end

  defp config do
    Application.get_env(:ethui, Ethui.Stacks)
  end

  defp format_docker_args(named_args, flags) do
    named_args = Enum.map_join(named_args, " ", fn {k, v} -> "--#{k}=#{v}" end)
    flags = Enum.map_join(flags, " ", fn f -> "--#{f}" end)
    image = config()[:ipfs_image]

    "run #{named_args} #{flags} #{image}"
    |> String.split(" ")
  end
end
