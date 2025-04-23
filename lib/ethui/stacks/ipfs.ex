defmodule Ethui.Stacks.IPFS do
  @moduledoc """
  Wrapper for the IPFS server
  """

  def url do
    config()[:ipfs_url]
  end

  defp config do
    Application.get_env(:ethui, Ethui.Stacks)
  end
end
