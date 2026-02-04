defmodule Ethui.Proxy.Router do
  alias Ethui.Stacks.Server

  @graph_ports %{
    "graph" => 8000,
    "graph-rpc" => 8020,
    "graph-status" => 8030
  }

  def resolve(%{slug: slug, component: nil}, _params),
    do: Server.anvil_url(slug)

  def resolve(%{slug: slug, component: component}, params)
      when is_map_key(@graph_ports, component) do
    port = @graph_ports[component]
    subgraph_url(params, slug, port)
  end

  def resolve(%{component: "ipfs"}, %{"proxied_path" => path}) do
    with {:ok, ip} <- Ethui.Services.Ipfs.ip() do
      {:ok, "http://#{ip}:5001/#{Enum.join(path, "/")}"}
    else
      _ -> {:error, "IPFS service not available"}
    end
  end

  def resolve(_, _),
    do: {:error, :not_found}

  defp subgraph_url(%{"proxied_path" => path}, slug, port) do
    Server.graph_ip_from_slug(path, slug, port)
  end
end
