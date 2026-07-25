defmodule Ethui.MCP.Server do
  @moduledoc """
  MCP server exposing stack lifecycle, chain reads and anvil cheatcodes.

  Served over streamable HTTP at `/mcp`, authenticated with the same bearer JWT
  as the REST api.
  """

  use Anubis.Server,
    name: "ethui-stacks",
    version: "0.1.0",
    capabilities: [:tools]

  alias Ethui.MCP.Tools

  component(Tools.CreateStack)
  component(Tools.ListStacks)
  component(Tools.DeleteStack)

  component(Tools.GetBlock)
  component(Tools.GetTransaction)
  component(Tools.GetAddress)
  component(Tools.GetLogs)

  component(Tools.SimulateCall)
  component(Tools.Execute)

  component(Tools.Impersonate)
  component(Tools.SetBalance)
  component(Tools.Mine)
  component(Tools.SetBlockTimestamp)
  component(Tools.Snapshot)
  component(Tools.Revert)
end
