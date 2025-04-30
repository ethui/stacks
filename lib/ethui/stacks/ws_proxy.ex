defmodule Ethui.Stacks.WsProxy do
  @behaviour :cowboy_websocket

  def init(req, _opts) do
    IO.inspect("Here")
    host = :cowboy_req.host(req) |> IO.inspect()
    headers = :cowboy_req.headers(req)

    if should_proxy?(host, headers) do
      {:cowboy_websocket, req, %{}}
    else
      {:skip, req, %{}}
    end
  end

  defp should_proxy?(host, %{"upgrade" => "websocket", "connection" => "Upgrade"}), do: true
  defp should_proxy?(_, _), do: false

  def websocket_init(_type, req, _opts) do
    state = %{}
    {:ok, state}
  end

  # Handle messages from the client
  def websocket_handle({:text, msg}, state) do
    {:reply, {:text, "pong"}, state}
  end

  def websocket_info(message, req, state) do
    {:reply, {:text, "reply"}, state}
  end

  def terminate(_reason, _req, _state) do
    :ok
  end
end
