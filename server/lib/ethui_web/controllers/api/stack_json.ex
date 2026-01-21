defmodule EthuiWeb.Api.StackJSON do
  alias Ethui.Stacks

  @doc """
  Renders a list of stacks.
  """
  def index(%{stacks: stacks}) do
    %{status: "success", data: for(stack <- stacks, do: Stacks.get_info(stack))}
  end

  @doc """
  Renders a single stack.
  """
  def show(%{stack: stack}) do
    %{status: "success", data: Stacks.get_info(stack)}
  end

  @doc """
  Renders a created stack.
  """
  def create(%{stack: stack}) do
    %{
      status: "success",
      data: %{
        slug: stack.slug,
        urls: Stacks.get_urls(stack),
        status: "running"
      }
    }
  end
end
