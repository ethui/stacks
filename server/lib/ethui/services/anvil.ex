defmodule Ethui.Services.Anvil do
  @moduledoc """
  GenServer that manages a single `anvil` instance

  This wraps a MuonTrap Daemon
  """

  use GenServer
  require Logger
  alias Ethui.Stacks

  @idle_timeout :timer.minutes(10)
  @log_max_size 10_000

  @type id :: pid | atom | {:via, atom, term}

  @type opts_value :: String.t() | number()
  @type opts_map :: %{optional(String.t()) => opts_value()}

  @type opts :: [
          slug: String.t(),
          hash: String.t(),
          anvil_opts: opts_map,
          id: integer()
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
          chain_id: String.t(),
          # idle timer
          idle_timer: reference() | nil,
          status: :suspended | :running | :failed,
          # why the last boot attempt failed, when status is :failed
          error: term(),
          last_used: integer
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

  # Booting a forked instance waits on the upstream chain, well past a default call timeout
  @spec ensure_running(id, timeout) :: :ok | {:error, {:exit, integer} | term}
  def ensure_running(id, timeout \\ :timer.seconds(30)) do
    GenServer.call(id, :ensure_running, timeout)
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

  @doc "Stops an anvil instance and deletes the state file"
  @spec destroy(id) :: :ok
  def destroy(id) do
    GenServer.cast(id, :destroy)
  end

  #
  # Server
  #

  @spec init(opts) :: {:ok, t} | {:error, any}
  @impl GenServer
  def init(opts) do
    Process.flag(:trap_exit, true)

    with {:ok, dir} <- data_dir(opts[:slug], opts[:hash]),
         :ok <- File.mkdir_p!(dir),
         {:ok, port} <-
           Ethui.Stacks.HttpPorts.claim() do
      {:ok,
       %{
         port: port,
         proc: nil,
         logs: :queue.new(),
         dir: dir,
         slug: opts[:slug],
         log_subscribers: MapSet.new(),
         chain_id: Stacks.chain_id(opts[:id]),
         args: opts_to_args(opts[:anvil_opts]),
         idle_timer: nil,
         status: :suspended,
         error: nil,
         last_used: nil
       }}
    else
      error -> error
    end
  end

  @impl GenServer
  def handle_info({:EXIT, _pid, exit_status}, %{port: port} = state) do
    case exit_status do
      # we killed it ourselves on suspend: the port stays claimed so the stack
      # keeps the same URL when it resumes
      :killed ->
        {:noreply, %{state | proc: nil}}

      0 ->
        Ethui.Stacks.HttpPorts.free(port)
        {:stop, :normal, %{state | port: nil, proc: nil}}

      exit_code ->
        Logger.error("anvil exited with code #{inspect(exit_code)}")
        Ethui.Stacks.HttpPorts.free(port)
        {:stop, :normal, %{state | port: nil, proc: nil}}
    end
  end

  def handle_info({:anvil_output, line}, state) do
    {:noreply, log_line(state, line)}
  end

  def handle_info(
        :suspend,
        %{status: :running, proc: proc, last_used: last_used} = state
      ) do
    Logger.info("Suspending #{state.slug}: #{last_used}")

    kill_proc(proc)

    {:noreply, %{state | proc: nil, status: :suspended, idle_timer: nil}}
  end

  @impl GenServer
  def handle_call(:url, _from, %{port: port} = state) do
    {:reply, "http://localhost:#{port}", touch(state)}
  end

  @impl GenServer
  def handle_call(:logs, _from, %{logs: logs} = state) do
    {:reply, logs |> :queue.to_list(), touch(state)}
  end

  def handle_call(
        :ensure_running,
        _from,
        %{slug: slug, status: status} = state
      ) do
    case status do
      :running ->
        {:reply, :ok, state}

      # anvil rejected these args once and they cannot change while this process
      # lives, so retrying only burns another readiness timeout per request
      :failed ->
        {:reply, {:error, state.error}, state}

      :suspended ->
        Logger.info("restarting slug: #{slug}")

        case start_anvil(state) do
          {:ok, state} -> {:reply, :ok, state}
          {:error, reason, state} -> {:reply, {:error, reason}, state}
        end
    end
  end

  @impl GenServer
  def handle_cast(:destroy, %{proc: proc} = state) do
    _ = remove_dir(state)
    # proc is nil while suspended
    if proc, do: GenServer.stop(proc)
    {:stop, :normal, state}
  end

  @impl GenServer
  def handle_cast({:log, line}, state) do
    {:noreply, log_line(state, line)}
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
    {:noreply, %{touch(state) | log_subscribers: MapSet.delete(subs, pid)}}
  end

  @impl GenServer
  def terminate(_reason, %{port: port}) when is_integer(port) do
    Ethui.Stacks.HttpPorts.free(port)
  end

  def terminate(_reason, _state), do: :ok

  ## aux

  defp log_line(%{logs: logs, log_subscribers: subs} = state, line) do
    for s <- subs do
      send(s, {:logs, :anvil, state.slug, [line]})
    end

    %{state | logs: :queue.in(line, logs) |> trim()}
  end

  defp remove_dir(state) do
    case File.rm_rf(state.dir) do
      {:ok, _files} ->
        :ok

      {:error, reason, _} ->
        Logger.error("Failed to cleanup resource for slug #{state.slug}: #{inspect(reason)}")
        {:error, reason}
    end
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

  defp config do
    Application.get_env(:ethui, Ethui.Stacks)
  end

  defp idle_timeout() do
    @idle_timeout
  end

  #
  # utils
  #

  defp opts_to_args(nil), do: []

  defp opts_to_args(opts) when is_map(opts) do
    opts
    |> Enum.sort()
    |> Enum.flat_map(fn
      {_key, false} -> []
      {key, true} -> ["--" <> dashify(key)]
      {key, val} -> ["--" <> dashify(key), to_string(val)]
    end)
  end

  defp dashify(key) when is_binary(key), do: String.replace(key, "_", "-")

  @managed_flags ~w(--port --state --host --chain-id --preserve-historical-states)

  defp drop_managed([]), do: []

  defp drop_managed([arg | rest]) do
    if arg in @managed_flags do
      rest |> drop_value() |> drop_managed()
    else
      [arg | drop_managed(rest)]
    end
  end

  # a flag's value, if it has one: the next element unless it is another flag
  defp drop_value([value | rest]) do
    if String.starts_with?(value, "--"), do: [value | rest], else: rest
  end

  defp drop_value([]), do: []

  # Without --preserve-historical-states, every suspend/resume cycle silently drops
  # pre-restart state: blocks and logs survive, but eth_call at any older block fails
  # with BlockOutOfRangeError, which breaks indexers replaying chain history.
  # --prune-history forces max_persisted_states to 0, so the two together are
  # contradictory rather than an error; anvil boots and persists nothing.
  defp history_args(args) do
    if "--prune-history" in args, do: [], else: ["--preserve-historical-states"]
  end

  defp touch(state) do
    timer =
      if state.idle_timer do
        _remaining = Process.cancel_timer(state.idle_timer)
        Process.send_after(self(), :suspend, idle_timeout())
      else
        Process.send_after(self(), :suspend, idle_timeout())
      end

    %{state | last_used: System.system_time(:second), idle_timer: timer}
  end

  defp wait_until_ready(port, attempts \\ 100)

  defp wait_until_ready(_port, 0), do: {:error, :timeout}

  defp wait_until_ready(port, attempts) do
    url = "http://127.0.0.1:#{port}"

    body =
      Jason.encode!(%{
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1
      })

    case :httpc.request(
           :post,
           {String.to_charlist(url), [], ~c"application/json", body},
           [],
           [{:body_format, :binary}]
         ) do
      {:ok, {{_, 200, _}, _, _}} ->
        :ok

      _ ->
        Process.sleep(100)
        wait_until_ready(port, attempts - 1)
    end
  end

  defp start_anvil(%{dir: dir, chain_id: chain_id, args: args, slug: slug} = state) do
    # The port is claimed once, in init/1, and held for the lifetime of the
    # stack: claiming a fresh one on every resume leaked the previous one and
    # moved the stack's URL out from under anyone holding it.
    port = state.port
    pid = self()

    # A repeated flag is a clap usage error ("cannot be used multiple times",
    # exit 2), not a last-one-wins override, so a caller flag that collides
    # with a server-managed one is dropped rather than appended to.
    args = drop_managed(args)

    anvil_args =
      args ++
        [
          "--port",
          to_string(port),
          "--state",
          "#{dir}/state.json",
          "--host",
          "0.0.0.0",
          "--chain-id",
          to_string(chain_id)
        ] ++ history_args(args)

    case MuonTrap.Daemon.start_link(
           anvil_bin(),
           anvil_args,
           logger_fun: fn line -> send(pid, {:anvil_output, line}) end,
           # TODO maybe patch muontrap to have a separate stream for stderr
           stderr_to_stdout: true,
           exit_status_to_reason: & &1
         ) do
      {:ok, proc} ->
        case wait_until_ready(port) do
          :ok ->
            Logger.info("restarting slug with port: #{slug} #{port}")
            {:ok, %{state | proc: proc, status: :running, error: nil} |> touch()}

          {:error, reason} ->
            failed_to_boot(state, proc, reason)
        end

      {:error, reason} ->
        Logger.error("Failed to start anvil for #{slug}: #{inspect(reason)}")
        {:error, reason, state}
    end
  end

  # anvil writes the real reason to stdout and exits before the RPC port ever
  # opens - a rejected flag exits 2 immediately - so without replaying its
  # output all that reaches the logs is our own readiness timeout.
  defp failed_to_boot(%{slug: slug} = state, proc, reason) do
    {lines, state} = drain_output(state)
    exit_status = stop_proc(proc)

    Logger.error(
      "Failed to start anvil for #{slug}: #{inspect(reason)}" <>
        exit_description(exit_status) <> output_description(lines)
    )

    case exit_status do
      # clap's usage error: anvil rejected the arguments themselves, and they
      # cannot change while this process lives, so every later request fails
      # from here instead of paying for another boot that cannot work
      {:exited, 2} ->
        {:error, {:exit, 2}, %{state | proc: nil, status: :failed, error: {:exit, 2}}}

      # anything else - an unreachable fork, a port that is still bound - can
      # succeed on the next try, so the stack stays resumable
      {:exited, code} when is_integer(code) ->
        {:error, {:exit, code}, %{state | proc: nil, status: :suspended, error: {:exit, code}}}

      _ ->
        {:error, reason, %{state | proc: nil, status: :suspended, error: reason}}
    end
  end

  # log lines arrive as messages, and this runs inside the call that started
  # anvil, so everything it printed is still sitting in our mailbox
  defp drain_output(state, acc \\ []) do
    receive do
      {:anvil_output, line} -> drain_output(state, [line | acc])
    after
      0 ->
        lines = Enum.reverse(acc)
        {lines, Enum.reduce(lines, state, &log_line(&2, &1))}
    end
  end

  defp stop_proc(proc) do
    receive do
      {:EXIT, ^proc, status} ->
        {:exited, status}
    after
      0 ->
        kill_proc(proc)
        :killed
    end
  end

  # waits for the exit so the http port is free again before the next resume
  # tries to bind it
  defp kill_proc(proc) do
    Process.exit(proc, :kill)

    receive do
      {:EXIT, ^proc, _status} -> :ok
    after
      :timer.seconds(5) -> :ok
    end
  end

  defp exit_description({:exited, status}), do: ", anvil exited with #{inspect(status)}"
  defp exit_description(:killed), do: ", anvil never became ready and was killed"

  defp output_description([]), do: ", no output"

  defp output_description(lines) do
    tail = lines |> Enum.take(-10) |> Enum.map_join(" | ", &String.trim/1)
    ", last output: #{tail}"
  end
end
