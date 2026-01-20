defmodule EthuiWeb.ApiKeyJSON do
  @doc """
  Renders an API key.
  """
  def show(%{api_key: api_key}) do
    %{data: data(api_key)}
  end

  @doc """
  Renders an updated API key.
  """
  def update(%{api_key: api_key}) do
    %{data: data(api_key)}
  end

  defp data(api_key) do
    %{
      id: api_key.id,
      stack_slug: api_key.stack_id,
      token: api_key.token,
      expires_at: api_key.expires_at,
      inserted_at: api_key.inserted_at,
      updated_at: api_key.updated_at
    }
  end
end
