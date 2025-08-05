defmodule Ethui.Services.Anvil do
  @moduledoc """
  GenServer that manages a single `anvil` instace

  This wraps a MuontipTrap Daemon
  """

  use GenServer
  require Logger

  @log_max_size 10_000

  @type id :: pid | atom | {:via, atom, term}

  @type allowed_value :: String.t() | number()
  @type opts_map :: %{optional(String.t()) => allowed_value()}

  @type opts :: [
          slug: String.t(),
          hash: String.t(),
          anvil_opts: opts_map
        ]

  @type t :: %{
          # http port
          port: pos_integer,
          # muontrap process
          proc: pid | nil,
          logs: :queue.queue(),
          slug: String.t(),
          # directory where state and IPC socket is stored
          dir: String.t(),
          log_subscribers: MapSet.t(),
          chain_id: String.t()
        }

  @doc "Start an anvil instance"
  @spec start_link(opts) :: GenServer.on_start()
  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: name(opts[:slug]))
  end

  def name(slug) do
    {:via, Registry, {Ethui.Stacks.Registry, {slug, :anvil}}}
  end

  #
  # Client

  @doc "Get the URL of an anvil instance"
  @spec url(id) :: String.t()
  def url(id) do
    GenServer.call(id, :url)
  end

  @doc """
    Subscribes to logs of an anvil instance.
    An immediate message is sent with all current log history, followed by messages as future logs are read"
  """
  @spec subscribe_logs(id) :: :ok
  def subscribe_logs(id) do
    GenServer.cast(id, {:subscribe_logs, self()})
  end

  @doc """
  Unsubscribes from receiving logs
  """
  @spec unsubscribe_logs(id) :: :ok
  def unsubscribe_logs(id) do
    GenServer.cast(id, {:unsubscribe_logs, self()})
  end

  @doc "Stop an anvil instance"
  @spec stop(id) :: :ok
  def stop(id) do
    GenServer.cast(id, :stop)
  end

  #
  # Server
  #

  @spec init(opts) :: {:ok, t}
  @impl GenServer
  def init(opts) do
    Process.flag(:trap_exit, true)

    with {:ok, dir} <- data_dir(opts[:slug], opts[:hash]),
         File.mkdir_p!(dir),
         {:ok, port} <-
           Ethui.Stacks.HttpPorts.claim() do
      send(self(), :boot)

      {:ok,
       %{
         port: port,
         proc: nil,
         logs: :queue.new(),
         dir: dir,
         slug: opts[:slug],
         log_subscribers: MapSet.new(),
         chain_id: chain_id(),
         opts: opts_to_args(opts[:anvil_opts])
       }}
    else
      error -> error
    end
  end

  @impl GenServer
  def handle_info(:boot, %{port: port, dir: dir, chain_id: chain_id, opts: opts} = state) do
    pid = self()

    anvil_args =
      [
        "--port",
        to_string(port),
        "--state",
        "#{dir}/state.json",
        "--host",
        "0.0.0.0",
        "--chain-id",
        to_string(chain_id)
      ] ++ opts

    with {:ok, proc} <-
           MuonTrap.Daemon.start_link(
             anvil_bin(),
             anvil_args,
             logger_fun: fn f -> GenServer.cast(pid, {:log, f}) end,
             # TODO maybe patch muontrap to have a separate stream for stderr
             stderr_to_stdout: true,
             exit_status_to_reason: & &1
           ) do
      {:noreply, %{state | proc: proc}}
    else
      {:error, reason} ->
        Logger.error("Failed to start anvil: #{inspect(reason)}")
        {:stop, reason, state}
    end
  end

  @impl GenServer
  def handle_info({:EXIT, _pid, exit_status}, state) do
    case exit_status do
      0 ->
        {:stop, :normal, state}

      exit_code ->
        Logger.error("anvil exited with code #{inspect(exit_code)}")
        {:stop, :normal, state}
    end
  end

  @impl GenServer
  def handle_call(:url, _from, %{port: port} = state) do
    {:reply, "http://localhost:#{port}", state}
  end

  @impl GenServer
  def handle_call(:logs, _from, %{logs: logs} = state) do
    {:reply, logs |> :queue.to_list(), state}
  end

  @impl GenServer
  def handle_cast(:stop, %{proc: proc} = state) do
    GenServer.stop(proc)
    {:stop, :normal, state}
  end

  @impl GenServer
  def handle_cast({:log, line}, %{logs: logs, log_subscribers: subs} = state) do
    for s <- subs do
      send(s, {:logs, :anvil, state.slug, [line]})
    end

    new_logs = :queue.in(line, logs) |> trim()

    {:noreply, %{state | logs: new_logs}}
  end

  @impl GenServer
  def handle_cast(
        {:subscribe_logs, pid},
        %{slug: slug, logs: logs, log_subscribers: subs} = state
      ) do
    send(pid, {:logs, :anvil, slug, :queue.to_list(logs)})
    {:noreply, %{state | log_subscribers: MapSet.put(subs, pid)}}
  end

  @impl GenServer
  def handle_cast({:unsubscribe_logs, pid}, %{log_subscribers: subs} = state) do
    {:noreply, %{state | log_subscribers: MapSet.delete(subs, pid)}}
  end

  defp trim(q) do
    if :queue.len(q) > @log_max_size do
      {{:value, _}, q} = :queue.out(q)
      trim(q)
    else
      q
    end
  end

  #
  # env
  #

  defp data_dir(nil, _), do: {:error, :no_slug}
  defp data_dir(_, nil), do: {:error, :no_slug}

  defp data_dir(slug, hash) do
    root = config() |> Keyword.fetch!(:data_dir_root)
    {:ok, "#{root}/#{slug}.#{hash}/anvil"}
  end

  defp anvil_bin do
    config() |> Keyword.fetch!(:anvil_bin)
  end

  defp chain_id do
    prefix = config() |> Keyword.fetch!(:chain_id_prefix)
    <<val::32>> = <<prefix::16, 31_337::16>>
    val
  end

  defp config do
    Application.get_env(:ethui, Ethui.Stacks)
  end

  #
  # utils
  #

  defp opts_to_args(nil), do: []

  defp opts_to_args(opts) when is_map(opts) do
    opts
    |> Enum.flat_map(fn {key, val} ->
      ["--" <> dashify(key), to_string(val)]
    end)
  end

  defp dashify(key) when is_binary(key), do: String.replace(key, "_", "-")
end
