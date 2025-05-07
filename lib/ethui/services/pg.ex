defmodule Ethui.Services.Pg do
  @moduledoc """
    GenServer that manages a global `postgres` instace, required by graph nodes
    This wraps a MuontipTrap Daemon
  """

  @password "postgres"

  use Ethui.Services.Docker,
    image: Application.compile_env(:ethui, Ethui.Stacks)[:pg_image],
    named_args: [
      network: "ethui-stacks",
      name: "ethui-stacks-pg"
    ],
    env: [
      POSTGRES_PASSWORD: @password,
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    ],
    volumes: &__MODULE__.volumes/1

  def ip do
    case MuonTrap.cmd(
           "docker",
           [
             "inspect",
             "-f",
             "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}",
             "ethui-stacks-pg"
           ]
         ) do
      {out, _} ->
        {:ok, out |> String.split("\n") |> Enum.at(0)}

      error ->
        {:error, error}
    end
  end

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

  defp config do
    Application.get_env(:ethui, Ethui.Stacks)
  end
end
