defmodule Ethui.Telemetry do
  @moduledoc """
  Helper module for executing telemetry events with the [:ethui] prefix.
  """

  @doc """
  Execute a telemetry event with the [:ethui] prefix automatically added.

  ## Examples

      Ethui.Telemetry.exec([:stacks, :created], %{count: 1}, %{stack_slug: "demo"})
      # Executes: :telemetry.execute([:ethui, :stacks, :created], %{count: 1}, %{stack_slug: "demo"})

      Ethui.Telemetry.exec([:auth, :code_sent], %{count: 1}, %{email: "user@example.com"})
      # Executes: :telemetry.execute([:ethui, :auth, :code_sent], %{count: 1}, %{email: "user@example.com"})
  """
  @spec exec(event :: [atom()], measurements :: map(), metadata :: map()) :: :ok
  def exec(event, measurements \\ %{}, metadata \\ %{}) when is_list(event) do
    :telemetry.execute([:ethui | event], measurements, metadata)
  end
end
