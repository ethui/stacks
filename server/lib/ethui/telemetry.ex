defmodule Ethui.Telemetry do
  @moduledoc """
  Helper module for executing telemetry events with the [:ethui] prefix.
  """

  @spec exec(event :: [atom()], metadata :: map()) :: :ok
  def exec(event, metadata \\ %{}) when is_list(event) do
    :telemetry.execute([:ethui | event], %{count: 1}, metadata)
  end
end
