defmodule Ethui.Proxy.CachePolicy do
  def cacheable?(conn, target_url, body) do
    conn.method == "POST" and
      anvil_url?(target_url) and
      readonly_rpc?(body) and
      not websocket?(conn)
  end

  defp anvil_url?(url) do
    String.contains?(url, "anvil")
  end

  defp readonly_rpc?(body) do
    with {:ok, %{"method" => method}} <- Jason.decode(body) do
      method in [
        "eth_chainId",
        "eth_blockNumber",
        "eth_getBlockByNumber",
        "eth_getBalance",
        "eth_call",
        "eth_getTransactionCount"
      ]
    else
      _ -> false
    end
  end

  defp websocket?(conn) do
    Plug.Conn.get_req_header(conn, "upgrade")
    |> Enum.any?(&(String.downcase(&1) == "websocket"))
  end
end
