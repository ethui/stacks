defmodule Ethui.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string, null: false
      add :verification_code, :string
      add :verification_code_sent_at, :naive_datetime
      add :verified_at, :naive_datetime

      timestamps()
    end

    create unique_index(:users, [:email])
  end
end
