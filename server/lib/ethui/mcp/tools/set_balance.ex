defmodule Ethui.MCP.Tools.SetBalance do
  @moduledoc "Sets the native balance of an address on the sandbox"

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)
    field(:address, :string, required: true)
    field(:balance, :string, required: true, description: "Wei, decimal or 0x-prefixed hex")
  end

  @impl true
  def execute(%{slug: slug, address: address, balance: balance}, frame) do
    with_stack(frame, slug, fn stack ->
      with {:ok, amount} <- quantity(balance),
           {:ok, _} <- rpc(stack, "anvil_setBalance", [address, amount]) do
        {:ok,
         %{address: address, balance_wei: balance, explorer: Explorer.address(stack, address)}}
      end
    end)
  end
end
