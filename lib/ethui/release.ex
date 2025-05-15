defmodule Ethui.Release do
  @moduledoc """
  Release-related tasks
  """

  @app :ethui

  def before_release do
    db_create()
    migrate()
  end

  defp db_create do
    for repo <- repos() do
      case repo.__adapter__().storage_up(repo.config()) do
        :ok -> IO.puts("Database created")
        {:error, :already_up} -> IO.puts("Database already created")
        {:error, term} -> IO.puts("Error creating database: #{inspect(term)}")
      end
    end
  end

  defp migrate do
    for repo <- repos() do
      Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end
  end

  def rollback(repo, version) do
    {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :down, to: version))
  end

  defp repos do
    Application.load(@app)
    Application.fetch_env!(@app, :ecto_repos)
  end
end
