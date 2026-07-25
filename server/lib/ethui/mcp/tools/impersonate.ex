defmodule Ethui.MCP.Tools.Impersonate do
  @moduledoc """
  Unlocks an address on the sandbox so transactions can be sent from it without
  its private key. Set stop: true to release it again.
  """

  use Ethui.MCP.Tool

  schema do
    field(:slug, :string, required: true)
    field(:address, :string, required: true)

    field(:stop, :boolean,
      default: false,
      description: "Stop impersonating instead of starting. Defaults to false"
    )
  end

  @impl true
  def execute(%{slug: slug, address: address, stop: stop}, frame) do
    with_stack(frame, slug, fn stack ->
      method = if stop, do: "anvil_stopImpersonatingAccount", else: "anvil_impersonateAccount"

      with {:ok, _} <- rpc(stack, method, [address]) do
        {:ok, %{address: address, impersonating: not stop}}
      end
    end)
  end
end
