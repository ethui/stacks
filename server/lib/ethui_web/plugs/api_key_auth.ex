defmodule EthuiWeb.Plugs.ApiKeyAuth do
  @moduledoc """
  Authenticates requests using API keys in the URL path.

  URL format: `/:token/*rest`
  Example: `https://graph-my-stack.example.com/wnlT5EkiG_pd93A1N2m7/execute`

  """

  import Plug.Conn
  import Phoenix.Controller

  alias Ethui.Accounts.ApiKey
  alias Ethui.Accounts

  @min_token_length 20

  # ponytail: 60s TTL cache; a revoked/deleted key keeps working up to 60s.
  # Drop TTL or invalidate on api_key delete if that window matters.
  @cache_ttl_ms :timer.seconds(60)

  def init(opts), do: opts

  def call(conn, _opts) do
    if enabled?() do
      do_call(conn)
    else
      conn
    end
  end

  defp do_call(conn) do
    conn.path_info

    with [token | _] when byte_size(token) >= @min_token_length <- conn.path_info,
         %ApiKey{} = api_key <- cached_api_key(token),
         true <- stack_matches?(conn, api_key) do
      conn |> Map.update!(:path_info, &tl/1)
    else
      _ ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Invalid API key"})
        |> halt()
    end
  end

  # Caches successful token lookups in ETS so the proxy hot path doesn't hit the
  # DB on every forwarded RPC request. Invalid tokens are not cached (they stay
  # cheap-to-reject and can't fill the table).
  defp cached_api_key(token) do
    now = System.monotonic_time(:millisecond)

    case :ets.lookup(:api_key_cache, token) do
      [{^token, %ApiKey{} = api_key, expiry}] when expiry > now ->
        api_key

      _ ->
        case Accounts.get_api_key_by_token(token) do
          %ApiKey{} = api_key ->
            :ets.insert(:api_key_cache, {token, api_key, now + @cache_ttl_ms})
            api_key

          other ->
            other
        end
    end
  end

  defp stack_matches?(conn, api_key) do
    case conn.assigns[:proxy][:slug] do
      nil -> false
      slug -> api_key.stack.slug == slug
    end
  end

  def enabled? do
    Application.get_env(:ethui, __MODULE__)[:enabled] || false
  end
end
