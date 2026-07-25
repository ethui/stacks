defmodule Ethui.MCP.Tools.Execute do
  @moduledoc """
  Sends a transaction to a stack and waits for its receipt. Takes raw calldata —
  encode it with the contract ABI first. `from` can be any address: the sandbox
  impersonates it, no private key needed.
  """

  use Ethui.MCP.Tool

  @receipt_attempts 100
  @receipt_interval 200

  schema do
    field(:slug, :string, required: true)
    field(:to, :string, description: "Target address. Omit to deploy the bytecode in `data`")
    field(:data, :string, description: "0x-prefixed calldata or deploy bytecode")

    field(:from, :string,
      description: "Sender, impersonated automatically. Defaults to the first anvil account"
    )

    field(:value, :string,
      default: "0",
      description: "Wei to send, decimal or hex. Defaults to 0"
    )

    field(:gas, :integer, description: "Gas limit. Estimated when omitted")
  end

  @impl true
  def execute(%{slug: slug} = params, frame) do
    with_stack(frame, slug, fn stack ->
      with {:ok, value} <- quantity(params.value),
           {:ok, from} <- sender(stack, params[:from]),
           {:ok, hash} <- rpc(stack, "eth_sendTransaction", [tx(params, from, value)]),
           {:ok, receipt} <- await_receipt(stack, hash) do
        {:ok,
         %{
           hash: hash,
           status: if(receipt["status"] == "0x1", do: "success", else: "reverted"),
           gas_used: receipt["gasUsed"],
           contract_address: receipt["contractAddress"],
           logs: receipt["logs"],
           explorer: Explorer.tx(stack, hash)
         }}
      end
    end)
  end

  defp sender(stack, nil) do
    case rpc(stack, "eth_accounts") do
      {:ok, [account | _]} -> {:ok, account}
      {:ok, []} -> {:error, "stack has no unlocked accounts, pass `from`"}
      error -> error
    end
  end

  defp sender(stack, from) do
    with {:ok, _} <- rpc(stack, "anvil_impersonateAccount", [from]), do: {:ok, from}
  end

  defp tx(params, from, value) do
    %{
      "from" => from,
      "to" => params[:to],
      "data" => params[:data],
      "value" => value,
      "gas" => params[:gas] && Chain.hex(params[:gas])
    }
    |> Enum.reject(fn {_k, v} -> is_nil(v) end)
    |> Map.new()
  end

  defp await_receipt(stack, hash, attempts \\ @receipt_attempts)

  defp await_receipt(_stack, hash, 0),
    do: {:error, "transaction #{hash} was sent but no receipt appeared — is the stack mining?"}

  defp await_receipt(stack, hash, attempts) do
    case rpc(stack, "eth_getTransactionReceipt", [hash]) do
      {:ok, nil} ->
        Process.sleep(@receipt_interval)
        await_receipt(stack, hash, attempts - 1)

      other ->
        other
    end
  end
end
