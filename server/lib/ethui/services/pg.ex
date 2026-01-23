defmodule Ethui.Services.Pg do
  @moduledoc """
    GenServer that manages a global `postgres` instace, required by graph nodes
    This wraps a MuontipTrap Daemon
  """

  @password "postgres"

  use Ethui.Services.Docker,
    image: &__MODULE__.docker_image/0,
    named_args: [
      network: "ethui-stacks",
      name: "ethui-stacks-pg"
    ],
    env: [
      POSTGRES_PASSWORD: @password,
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    ],
    volumes: &__MODULE__.volumes/1

  @spec init(any()) :: {:ok, t()}

  def username do
    "postgres"
  end

  def password do
    @password
  end

  def volumes(_state) do
    config = config()

    [
      "#{config[:pg_data_dir]}": "/var/lib/postgresql/data"
    ]
  end

  def docker_image do
    config()[:pg_image]
  end

  defp config do
    Application.get_env(:ethui, Ethui.Stacks)
  end
end
