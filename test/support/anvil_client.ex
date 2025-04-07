defmodule AnvilClient do
  use Tesla

  def new(url) do
    Tesla.client([
      {Tesla.Middleware.BaseUrl, url},
      Tesla.Middleware.JSON
    ])
  end

  def rpc_request(client, method, params \\ []) do
    body = %{
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1
    }

    headers = [{"Content-Type", "application/json"}]

    case Tesla.post(client, "", body, headers) do
      {:ok, response} ->
        {:ok, response.body}

      {:error, reason} ->
        {:error, reason}
    end
  end
end
