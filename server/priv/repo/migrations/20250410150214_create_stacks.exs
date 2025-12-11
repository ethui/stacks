defmodule Ethui.Repo.Migrations.CreateBlogPosts do
  use Ecto.Migration

  def change do
    create table(:stacks) do
      add(:slug, :string)

      timestamps(type: :utc_datetime)
    end

    create(index(:stacks, [:slug], unique: true))
  end
end
