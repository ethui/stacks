defmodule Ethui.Proxy.Cache do
  @table :proxy_http_cache

  @default_ttl :timer.seconds(10)

  def init do
    :ets.new(@table, [
      :named_table,
      :public,
      :set,
      read_concurrency: true,
      write_concurrency: true
    ])
  rescue
    ArgumentError ->
      :ok
  end

  def get(key) do
    case :ets.lookup(@table, key) do
      [{^key, value, expires_at}] ->
        if expires_at > System.monotonic_time(:millisecond) do
          {:ok, value}
        else
          :ets.delete(@table, key)
          :miss
        end

      [] ->
        :miss
    end
  end

  def put(key, value, ttl \\ @default_ttl) do
    expires_at = System.monotonic_time(:millisecond) + ttl
    :ets.insert(@table, {key, value, expires_at})
    :ok
  end
end
