defmodule EthuiWeb.Components.Admin.LogTailLive do
  use Phoenix.LiveComponent

  def mount(socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div>asd2</div>
    """
  end

  def update(assigns, socket) do
    IO.inspect(assigns)
    {:ok, socket}
  end
end
