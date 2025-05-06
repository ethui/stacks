defmodule Ethui.Services.Docker do
  @moduledoc """
    GenServer that manages a single docker container
    This wraps a MuontipTrap Daemon
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

      @before_compile unquote(__MODULE__).BeforeCompile

      @opts unquote(opts)

      @type t :: %{
              # muontrap process
              proc: pid | nil,
              logs: :queue.queue(),
              log_subscribers: MapSet.t()
            }

      @log_max_size 10_000

      def start_link(opts) do
        GenServer.start_link(__MODULE__, opts,
          name: apply_if_fun(@opts[:name], opts) || __MODULE__
        )
      end

      #
      # Server
      #

      @spec init(any()) :: {:ok, t}
      @impl GenServer
      def init(opts) do
        Process.flag(:trap_exit, true)

        send(self(), :before_boot)
        send(self(), :boot)

        base_state = %{
          proc: nil,
          logs: :queue.new(),
          log_subscribers: MapSet.new()
        }

        state =
          extra_init(base_state, opts)

        {:ok, state}
      end

      @impl GenServer
      def handle_info(:boot, state) do
        pid = self()

        env = apply_if_fun(@opts[:env], state) || []
        named_args = apply_if_fun(@opts[:named_args], state) || []
        flags = ["rm", "init"]

        args =
          format_docker_args(env, named_args, flags)

        {:ok, proc} =
          MuonTrap.Daemon.start_link("docker", args,
            logger_fun: fn f -> GenServer.cast(pid, {:log, f}) end,
            stderr_to_stdout: true,
            exit_status_to_reason: & &1
          )

        {:noreply, %{state | proc: proc}}
      end

      @impl GenServer
      def handle_info({:EXIT, _pid, exit_status}, %{logs: logs} = state) do
        case exit_status do
          0 ->
            {:stop, :normal, state}

          exit_code ->
            logs |> :queue.to_list() |> Enum.each(&Logger.error/1)
            Logger.error("exited with code #{inspect(exit_code)}")
            {:stop, :normal, state}
        end
      end

      @impl GenServer
      def handle_cast({:log, line}, %{logs: logs, log_subscribers: subs} = state) do
        for s <- subs do
          send(s, {:logs, :anvil, state.slug, [line]})
        end

        new_logs = :queue.in(line, logs) |> trim()

        {:noreply, %{state | logs: new_logs}}
      end

      defp boot() do
      end

      defp apply_if_fun(fun, state) when is_function(fun, 1), do: fun.(state)
      defp apply_if_fun(other, _state), do: other

      defp format_docker_args(env, named_args, flags) do
        env =
          Enum.map_join(env, " ", fn {k, v} -> "--env #{k}=#{v}" end)

        named_args = Enum.map_join(named_args, " ", fn {k, v} -> "--#{k}=#{v}" end)
        flags = Enum.map_join(flags, " ", fn f -> "--#{f}" end)
        image = @opts[:image]

        "run #{named_args} #{env} #{flags} #{image}"
        |> String.split(~r/\s+/)
      end

      defp trim(q) do
        if :queue.len(q) > @log_max_size do
          {{:value, _}, q} = :queue.out(q)
          trim(q)
        else
          q
        end
      end
    end
  end
end
