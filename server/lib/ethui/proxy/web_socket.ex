defmodule Ethui.Proxy.WebSocket do
  require Logger

  @moduledoc """
    Handles websocket connections and forwards the requests to the appropriate components
  """

  @behaviour WebSock

  @impl WebSock
  def init(state) do
    target_url = state.target_url

    # Convert http:// to ws:// for WebSocket connection
    ws_url = String.replace(target_url, ~r/^http/, "ws")

    case connect_to_target(ws_url) do
      {:ok, gun_pid, stream_ref} ->
        {:ok, Map.merge(state, %{gun_pid: gun_pid, stream_ref: stream_ref})}

      {:error, reason} ->
        Logger.error("Failed to connect to target WebSocket: #{inspect(reason)}")
        {:stop, :normal, state}
    end
  end

  @impl WebSock

  def handle_in({data, [opcode: type]}, state) do
    frame = {type, data}

    :gun.ws_send(state.gun_pid, state.stream_ref, frame)

    {:ok, state}
  end

  @impl WebSock
  def handle_info({:gun_ws, _pid, _stream_ref, {:text, data}}, state) do
    {:push, {:text, data}, state}
  end

  def handle_info({:gun_ws, _pid, _stream_ref, {:binary, data}}, state) do
    {:push, {:binary, data}, state}
  end

  def handle_info({:gun_ws, _pid, _stream_ref, :close}, state) do
    {:stop, :normal, state}
  end

  def handle_info({:gun_down, _pid, _protocol, _reason, _killed_streams}, state) do
    {:stop, :normal, state}
  end

  def handle_info({:gun_error, _pid, _stream_ref, reason}, state) do
    Logger.error("Gun error: #{inspect(reason)}")
    {:stop, :normal, state}
  end

  def handle_info(msg, state) do
    Logger.debug("Unhandled message: #{inspect(msg)}")
    {:ok, state}
  end

  @impl WebSock
  def terminate(_reason, state) do
    if Map.has_key?(state, :gun_pid) do
      :gun.close(state.gun_pid)
    end

    :ok
  end

  defp connect_to_target(ws_url) do
    uri = URI.parse(ws_url)
    port = uri.port || if uri.scheme == "wss", do: 443, else: 80

    opts = %{protocols: [:http]}

    with {:ok, gun_pid} <- :gun.open(String.to_charlist(uri.host), port, opts),
         {:ok, _protocol} <- :gun.await_up(gun_pid),
         stream_ref <- :gun.ws_upgrade(gun_pid, uri.path || "/") do
      receive do
        {:gun_upgrade, ^gun_pid, ^stream_ref, ["websocket"], _headers} ->
          {:ok, gun_pid, stream_ref}

        {:gun_response, ^gun_pid, ^stream_ref, _fin, status, _headers} ->
          {:error, {:ws_upgrade_failed, status}}

        {:gun_error, ^gun_pid, ^stream_ref, reason} ->
          {:error, reason}
      after
        5_000 ->
          {:error, :timeout}
      end
    end
  end
end
