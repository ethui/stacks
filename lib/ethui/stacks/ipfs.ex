defmodule Ethui.Stacks.IPFS do
  @moduledoc """
  Wrapper for the IPFS server
  """

  def url do
    config()[:url]
  end

  defp config do
    Application.get_env(:ethui, __MODULE__)
  end
end
