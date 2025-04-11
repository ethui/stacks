defmodule EthuiWeb.Live.Admin.StackLive do
  alias Ethui.Stacks.Stack

  use Backpex.LiveResource,
    adapter_config: [
      schema: Stack,
      repo: Ethui.Repo,
      create_changeset: &Stack.admin_create_changeset/3,
      update_changeset: &Stack.admin_update_changeset/3
    ],
    layout: {EthuiWeb.Layouts, :admin}

  @impl Backpex.LiveResource
  def singular_name, do: "Stack"

  @impl Backpex.LiveResource
  def plural_name, do: "Stacks"

  @impl Backpex.LiveResource
  def fields do
    [
      slug: %{module: Backpex.Fields.Text, label: "Slug"}
    ]
  end

  # def can?(_assigns, action, _item) when action in [:index, :custom_create], do: true
  # def can?(_assigns, _action, _item), do: true
end
