defmodule Ethui.Services.Docker do
  @moduledoc """
    GenServer that manages a single docker container
    This wraps a MuonTrap Daemon
  """

  defmodule BeforeCompile do
    @moduledoc """
    Declares functions that can be overriden by the user module
    """

    defmacro __before_compile__(_env) do
      quote do
        def extra_init(state, opts), do: state

        @impl GenServer
        def handle_info(:before_boot, state), do: {:noreply, state}
      end
    end
  end

  defmacro __using__(opts) do
    quote do
      use GenServer
      require Logger
      import Ethui.Services.Docker.Utils

      @before_compile unquote(__MODULE__).BeforeCompile

      @opts unquote(opts)
      @name Keyword.get(@opts, :name, __MODULE__)

      @type t :: %{
              # muontrap process
              proc: pid | nil,
              logs: :queue.queue(),
              log_subscribers: MapSet.t(),
              container_name: String.t() | nil
            }

      @log_max_size 10_000

      def start_link(opts) do
        GenServer.start_link(__MODULE__, opts,
          name: apply_if_fun(@opts[:name], opts) || __MODULE__
        )
      end

      def ip(pid \\ __MODULE__) do
        GenServer.call(pid, :ip)
      end

      #
      # Server
      #

      @spec init(any()) :: {:ok, t}
      @impl GenServer
      def init(opts) do
        send(self(), :before_boot)
        send(self(), :boot)

        base_state = %{
          proc: nil,
          logs: :queue.new(),
          log_subscribers: MapSet.new(),
          container_name: nil
        }

        state =
          extra_init(base_state, opts)

        {:ok, state}
      end

      @impl GenServer
      def handle_call(:ip, _from, %{container_name: container_name} = state) do
        Logger.info(
          "docker inspect-f {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}} container_name"
        )

        reply =
          case MuonTrap.cmd(
                 "docker",
                 [
                   "inspect",
                   "-f",
                   "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}",
                   container_name
                 ]
               ) do
            {out, 0} ->
              {:ok, out |> String.split("\n") |> Enum.at(0)}

            error ->
              {:error, error}
          end

        {:reply, reply, state}
      end

      @impl GenServer
      def handle_cast({:log, line}, %{logs: logs, log_subscribers: subs} = state) do
        for s <- subs do
          send(s, {:logs, __MODULE__, @name, [line]})
        end

        new_logs = :queue.in(line, logs) |> trim(@log_max_size)

        {:noreply, %{state | logs: new_logs}}
      end

      @impl GenServer
      def handle_info(:boot, state) do
        pid = self()

        image = apply_if_fun(@opts[:image], [])
        env = apply_if_fun(@opts[:env], state) || []
        named_args = apply_if_fun(@opts[:named_args], state) || []
        volumes = apply_if_fun(@opts[:volumes], state) || []
        flags = ["rm", "init"]

        args =
          format_docker_args(image, env, named_args, volumes, flags)

        if named_args[:network] do
          :ok = ensure_network_exists(named_args[:network])
        end

        if named_args[:name] do
          wait_for_removal(named_args[:name])
        end

        # Process.flag(:trap_exit, true)

        Logger.info("docker #{Enum.join(args, " ")}")

        {:ok, proc} =
          MuonTrap.Daemon.start_link("docker", args,
            logger_fun: fn f -> GenServer.cast(pid, {:log, f}) end,
            stderr_to_stdout: true,
            exit_status_to_reason: & &1
          )

        {:noreply, %{state | proc: proc, container_name: named_args[:name]}}
      end

      @impl GenServer
      def handle_info(
            {:EXIT, _pid, exit_status},
            %{logs: logs, container_name: container_name} = state
          ) do
        case exit_status do
          0 ->
            {:stop, :normal, state}

          exit_code ->
            logs |> :queue.to_list() |> Enum.each(&Logger.error/1)

            Logger.error(
              "#{container_name} - exited with code #{inspect(exit_code)} logs: #{inspect(logs)}"
            )

            {:stop, :normal, state}
        end
      end
    end
  end

  defmodule Utils do
    @moduledoc """
    Utility functions for Ethui.Services.Docker
    """

    require Logger

    def apply_if_fun(fun, _state) when is_function(fun, 0), do: fun.()
    def apply_if_fun(fun, state) when is_function(fun, 1), do: fun.(state)
    def apply_if_fun(other, _state), do: other

    def wait_for_removal(name) do
      Logger.info("docker rm -f #{name}")

      case System.cmd("docker", ["rm", "-f", name], stderr_to_stdout: true) do
        {_out, 0} ->
          :ok

        {_out, exit_code} when exit_code in [1, 125] ->
          :timer.sleep(100)
          wait_for_removal(name)

        {out, exit_code} ->
          raise "Error while waiting for removal of container #{name}: exit_code=#{exit_code}, output=#{inspect(out)}"
      end
    end

    def format_docker_args(image, env, named_args, volumes, flags) do
      env =
        Enum.flat_map(env, fn {k, v} -> ["--env", "#{k}=#{v}"] end)

      volumes =
        Enum.flat_map(volumes, fn {k, v} -> ["-v", "#{k}:#{v}"] end)

      named_args = Enum.map(named_args, fn {k, v} -> "--#{k}=#{v}" end)
      flags = Enum.map(flags, fn f -> "--#{f}" end)

      ["run"] ++ named_args ++ env ++ volumes ++ flags ++ [image]
    end

    def trim(q, limit) do
      if :queue.len(q) > limit do
        {{:value, _}, q} = :queue.out(q)
        trim(q, limit)
      else
        q
      end
    end

    def ensure_network_exists(network_name) do
      Logger.info("docker network inspect #{network_name}")

      case System.cmd("docker", ["network", "inspect", network_name]) do
        {_, 0} ->
          :ok

        {_, _} ->
          case System.cmd("docker", ["network", "create", network_name]) do
            {_, 0} ->
              :ok

            {out, exit_code} ->
              raise "docker network create #{network_name} failed to create: exit_code=#{exit_code}, output=#{inspect(out)}"
          end
      end
    end
  end
end
