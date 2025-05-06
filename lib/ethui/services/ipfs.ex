defmodule Ethui.Services.Ipfs do
  @moduledoc """
      GenServer that manages a global `ipfs` instace, required by graph nodes

      This wraps a MuontipTrap Daemon
  """

  use Ethui.Services.Docker,
    image: Application.compile_env(:ethui, Ethui.Stacks)[:ipfs_image],
    named_args: [
      network: "ethui-stacks",
      name: "ethui-stacks-ipfs"
    ]
end
