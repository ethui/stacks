defmodule Ethui.Repo.Migrations.AddUserIdToStacks do
  use Ecto.Migration

  def change do
    alter table(:stacks) do
      add :user_id, references(:users, on_delete: :delete_all), null: true
    end

    create index(:stacks, [:user_id])
  end
end
