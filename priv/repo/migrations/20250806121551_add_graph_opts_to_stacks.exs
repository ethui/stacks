defmodule Ethui.Repo.Migrations.AddGraphOptsToStacks do
  use Ecto.Migration

  def change do
    alter table(:stacks) do
      add :graph_opts, :map, default: fragment("'{}'")
    end
  end
end
