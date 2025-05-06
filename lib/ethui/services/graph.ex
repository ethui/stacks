defmodule Ethui.Services.Graph do
  @moduledoc """
    GenServer that manages a single `node-graph` instace
    This wraps a MuontipTrap Daemon
  """

  use Ethui.Services.Docker,
    image: Application.compile_env(:ethui, Ethui.Stacks)[:graph_node_image],
    name: &__MODULE__.start_link_name/1,
    named_args: &__MODULE__.named_args/1,
    env: &__MODULE__.env/1

  def name(slug) do
    {:via, Registry, {Ethui.Stacks.Registry, {slug, :graph}}}
  end

  def extra_init(state, opts) do
    state
    |> Map.put(:slug, opts[:slug])
    |> Map.put(:hash, opts[:hash])
  end

  @doc """
    Find the internal IP of a graph-node docker container
  """
  def ip(slug) do
    case MuonTrap.cmd(
           "docker",
           [
             "inspect",
             "-f",
             "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}",
             "ethui-stacks-#{slug}-graph"
           ]
         ) do
      {out, _} ->
        {:ok, out |> String.split("\n") |> Enum.at(0)}

      error ->
        {:error, error}
    end
  end

  @impl GenServer
  def handle_info(:before_boot, state) do
    {:ok, pg} =
      Postgrex.start_link(config()[:pg])

    sql = "CREATE DATABASE #{db_name(state)}"

    case Postgrex.query(pg, sql, []) do
      {:ok, _} -> Logger.info("Database #{db_name(state)} created")
      # database already exists, silently ignore
      {:error, %Postgrex.Error{postgres: %{code: :duplicate_database}}} -> nil
      # other errors
      error -> Logger.error("Error creating database #{db_name(state)}: #{inspect(error)}")
    end

    Process.exit(pg, :normal)
    {:noreply, state}
  end

  def start_link_name(opts) when is_list(opts), do: name(opts[:slug])

  def named_args(%{slug: slug} = _state) do
    [
      "add-host": "#{slug}.stacks.#{host_endpoint()}:#{config()[:docker_host]}",
      network: "ethui-stacks",
      name: "ethui-stacks-#{slug}-graph"
    ]
  end

  def env(%{slug: slug} = state) do
    config = config()

    [
      postgres_host: config[:docker_host],
      postgres_port: config[:pg][:port],
      postgres_user: config[:pg][:username],
      postgres_pass: config[:pg][:password],
      postgres_db: db_name(state),
      ipfs: "ethui-stacks-ipfs:5001",
      GRAPH_LOG: "info",
      ETHEREUM_REORG_THRESHOLD: "1",
      ETHEREUM_ACESTOR_COUNT: "1",
      ethereum: "anvil:http://#{slug}.stacks.#{host_endpoint()}:4000"
    ]
  end

  defp host_endpoint do
    EthuiWeb.Endpoint.config(:url)[:host]
  end

  defp config do
    Application.get_env(:ethui, Ethui.Stacks)
  end

  defp db_name(%{slug: slug, hash: hash}) do
    "ethui_stack_#{slug}_#{hash}"
  end
end
