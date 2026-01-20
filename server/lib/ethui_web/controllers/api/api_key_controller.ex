defmodule EthuiWeb.ApiKeyController do
  use EthuiWeb, :controller
  alias Ethui.Accounts

  action_fallback EthuiWeb.FallbackController

  def show(conn, %{"stack_slug" => stack_slug}) do
    user = conn.assigns.current_user

    with {:ok, api_key} <- Accounts.get_stack_api_key(user, stack_slug) do
      render(conn, :show, api_key: api_key)
    end
  end

  def update(conn, %{"stack_slug" => stack_slug}) do
    user = conn.assigns.current_user

    with {:ok, api_key} <- Accounts.rotate_api_key(user, stack_slug) do
      render(conn, :update, api_key: api_key)
    end
  end
end
