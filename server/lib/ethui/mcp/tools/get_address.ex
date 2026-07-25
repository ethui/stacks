defmodule Ethui.MCP.Tools.GetAddress do
  @moduledoc "Reads balance, nonce and contract status of an address on a stack"

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)
    field(:address, :string, required: true)

    field(:block, :string,
      default: "latest",
      description: "Block number or tag to read at. Defaults to latest"
    )
  end

  @impl true
  def execute(%{slug: slug, address: address, block: block}, frame) do
    with_stack(frame, slug, fn stack ->
      at = Chain.block_param(block)

      with {:ok, balance} <- rpc(stack, "eth_getBalance", [address, at]),
           {:ok, nonce} <- rpc(stack, "eth_getTransactionCount", [address, at]),
           {:ok, code} <- rpc(stack, "eth_getCode", [address, at]) do
        {:ok,
         %{
           address: address,
           balance_wei: to_decimal(balance),
           balance_hex: balance,
           nonce: to_decimal(nonce),
           is_contract: code not in ["0x", "0x0"],
           code_size: byte_size(code) |> div(2) |> Kernel.-(1),
           explorer: Explorer.address(stack, address)
         }}
      end
    end)
  end

  defp to_decimal("0x" <> hex), do: hex |> String.to_integer(16) |> to_string()
  defp to_decimal(other), do: other
end
