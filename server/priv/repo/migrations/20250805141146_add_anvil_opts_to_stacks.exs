defmodule Ethui.Repo.Migrations.AddAnvilOptsToStacks do
  use Ecto.Migration

  def change do
    alter table(:stacks) do
      add :anvil_opts, :map, default: fragment("'{}'")
    end

  end
end
