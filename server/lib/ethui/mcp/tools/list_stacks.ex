defmodule Ethui.MCP.Tools.ListStacks do
  @moduledoc "Lists the caller's stacks with their status, rpc urls and explorer links"

  use Ethui.MCP.Tool

  alias Ethui.MCP.Auth
  alias Ethui.MCP.StackInfo
  alias Ethui.Stacks
  alias Ethui.Stacks.Server

  schema do
  end

  @impl true
  def execute(_params, frame) do
    with {:ok, user} <- Auth.current_user(frame) do
      running = Server.list()
      {:ok, Enum.map(Stacks.list_stacks(user), &StackInfo.describe(&1, running))}
    end
    |> reply(frame)
  end
end
