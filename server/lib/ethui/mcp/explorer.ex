defmodule Ethui.MCP.Explorer do
  @moduledoc """
  Deep links into the ethui explorer, which takes the target rpc url base64
  encoded in its path. The stack api key is already inside that url, so a human
  opening the link is authenticated.
  """

  alias Ethui.Stacks
  alias Ethui.Stacks.Stack

  @default_base "https://explorer.ethui.dev"

  @spec root(Stack.t()) :: String.t()
  def root(stack), do: "#{base()}/rpc/#{Base.encode64(Stacks.ws_rpc_url(stack))}"

  @spec tx(Stack.t(), String.t()) :: String.t()
  def tx(stack, hash), do: "#{root(stack)}/tx/#{hash}"

  @spec address(Stack.t(), String.t()) :: String.t()
  def address(stack, address), do: "#{root(stack)}/address/#{address}"

  @doc "Block links take a decimal number, the way the frontend builds them"
  @spec block(Stack.t(), String.t() | integer | nil) :: String.t()
  def block(stack, nil), do: root(stack)
  def block(stack, "0x" <> hex), do: block(stack, String.to_integer(hex, 16))
  def block(stack, number), do: "#{root(stack)}/block/#{number}"

  defp base, do: Application.get_env(:ethui, :explorer_base, @default_base)
end
