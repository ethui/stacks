defmodule EthuiWeb.Live.StackLive do
  alias Ethui.Stacks.Stack

  use Backpex.LiveResource,
    adapter_config: [
      schema: Stack,
      repo: Ethui.Repo,
      update_changeset: &Stack.update_changeset/3,
      create_changeset: &Stack.create_changeset/3
    ],
    layout: {EthuiWeb.Layouts, :admin}

  @impl Backpex.LiveResource
  def singular_name, do: "Stack"

  @impl Backpex.LiveResource
  def plural_name, do: "Stacks"

  @impl Backpex.LiveResource
  def fields do
    [
      title: %{module: Backpex.Fields.Text, label: "Title"},
      views: %{module: Backpex.Fields.Number, label: "Views"}
    ]
  end
end
