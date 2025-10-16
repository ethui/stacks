defmodule Ethui.Services.Explorer do
  @moduledoc """
    GenServer that manages a global `@ethui/explorer` instace, to be shared by all anvil instances
    This wraps a MuontipTrap Daemon
  """

  use Ethui.Services.Docker,
    image: &__MODULE__.docker_image/0,
    named_args: [
      network: "ethui-stacks",
      name: "ethui-stacks-ipfs"
    ]

  def docker_image do
    config()[:ipfs_image]
  end

  defp config do
    Application.get_env(:ethui, Ethui.Stacks)
  end
end
