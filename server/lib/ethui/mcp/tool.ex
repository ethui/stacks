defmodule Ethui.MCP.Tool do
  @moduledoc """
  Shared plumbing for MCP tools: stack lookup with ownership check, rpc calls
  and the `{:ok, data} | {:error, message}` to MCP response mapping.
  """

  alias Anubis.Server.Frame
  alias Anubis.Server.Response
  alias Ethui.Chain
  alias Ethui.MCP.Auth
  alias Ethui.Stacks.Stack

  defmacro __using__(_opts) do
    quote do
      use Anubis.Server.Component, type: :tool

      import Ethui.MCP.Tool

      alias Ethui.Chain
      alias Ethui.MCP.Explorer
    end
  end

  @doc """
  Resolves `slug` to a stack the caller owns and runs `fun` on it, mapping its
  `{:ok, data} | {:error, message}` result into an MCP response.
  """
  @spec with_stack(Frame.t(), String.t(), (Stack.t() -> {:ok, term} | {:error, String.t()})) ::
          {:reply, Response.t(), Frame.t()}
  def with_stack(frame, slug, fun) do
    with {:ok, stack} <- Auth.fetch_stack(frame, slug) do
      fun.(stack)
    end
    |> reply(frame)
  end

  @doc "Runs a JSON-RPC call against the stack's anvil"
  @spec rpc(Stack.t(), String.t(), list) :: {:ok, term} | {:error, String.t()}
  def rpc(%Stack{slug: slug}, method, params \\ []), do: Chain.call(slug, method, params)

  @doc "Casts a decimal (or already hex) amount into a JSON-RPC hex quantity"
  @spec quantity(String.t()) :: {:ok, String.t()} | {:error, String.t()}
  def quantity("0x" <> _ = value), do: {:ok, value}

  def quantity(value) do
    case Integer.parse(value) do
      {n, ""} when n >= 0 -> {:ok, Chain.hex(n)}
      _ -> {:error, "expected a non-negative decimal or 0x-prefixed amount, got: #{value}"}
    end
  end

  @spec reply({:ok, term} | {:error, String.t()}, Frame.t()) :: {:reply, Response.t(), Frame.t()}
  def reply({:ok, data}, frame), do: {:reply, Response.json(Response.tool(), data), frame}

  def reply({:error, message}, frame),
    do: {:reply, Response.error(Response.tool(), message), frame}
end
