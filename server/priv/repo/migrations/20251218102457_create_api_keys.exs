defmodule Ethui.Repo.Migrations.CreateApiKeys do
  use Ecto.Migration

def change do
    create table(:api_keys) do
      add :stack_id, references(:stacks, on_delete: :delete_all), null: false
      add :token, :string, null: false
      add :expires_at, :utc_datetime

      timestamps()
    end

    create unique_index(:api_keys, [:token])
    create index(:api_keys, [:stack_id])
  end
end
