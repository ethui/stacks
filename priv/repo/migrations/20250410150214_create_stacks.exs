defmodule Ethui.Repo.Migrations.CreateBlogPosts do
  use Ecto.Migration

  def change do
    create table(:stacks) do
      add(:title, :string)
      add(:friendly_id, :string)

      timestamps(type: :utc_datetime)
    end
  end
end
