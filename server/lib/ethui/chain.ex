defmodule Ethui.Chain do
  @moduledoc """
  JSON-RPC client for a stack's anvil instance.

  Talks to the process-local anvil port instead of the public proxy url, so no
  api key or round trip through the reverse proxy is involved.
  """

  alias Ethui.Stacks.Server

  @receive_timeout :timer.seconds(30)
  @error_string_selector "08c379a0"

  @spec call(String.t(), String.t(), list) :: {:ok, term} | {:error, String.t()}
  def call(slug, method, params \\ []) do
    with {:ok, url} <- anvil_url(slug) do
      request(url, method, params)
    end
  end

  @doc "Converts an integer to the 0x-prefixed hex quantity the JSON-RPC api expects"
  @spec hex(integer) :: String.t()
  def hex(n) when is_integer(n), do: "0x" <> (n |> Integer.to_string(16) |> String.downcase())

  @doc "Normalizes a user-supplied block reference into a JSON-RPC block parameter"
  @spec block_param(String.t()) :: String.t()
  def block_param(block) when block in ~w(latest earliest pending safe finalized), do: block
  def block_param("0x" <> _ = block), do: block

  def block_param(block) do
    case Integer.parse(block) do
      {n, ""} -> hex(n)
      _ -> block
    end
  end

  defp anvil_url(slug) do
    case Server.anvil_url(slug) do
      {:ok, url} -> {:ok, url}
      {:error, _} -> {:error, "stack #{slug} is not running"}
    end
  end

  defp request(url, method, params) do
    body = Jason.encode!(%{jsonrpc: "2.0", id: 1, method: method, params: params})

    :post
    |> Finch.build(url, [{"content-type", "application/json"}], body)
    |> Finch.request(Ethui.Finch, receive_timeout: @receive_timeout)
    |> case do
      {:ok, %Finch.Response{body: body}} -> decode(body)
      {:error, error} -> {:error, "rpc request failed: #{Exception.message(error)}"}
    end
  end

  defp decode(body) do
    case Jason.decode(body) do
      {:ok, %{"result" => result}} -> {:ok, result}
      {:ok, %{"error" => error}} -> {:error, rpc_error(error)}
      _ -> {:error, "unexpected rpc response: #{body}"}
    end
  end

  defp rpc_error(%{"message" => message} = error) do
    case revert_reason(error) do
      {:ok, reason} -> "#{message}: #{reason}"
      :error -> message
    end
  end

  defp rpc_error(error), do: inspect(error)

  @doc "Decodes a standard `Error(string)` revert payload, which needs no contract ABI"
  @spec revert_reason(map) :: {:ok, String.t()} | :error
  def revert_reason(%{"data" => "0x" <> @error_string_selector <> encoded}) do
    with {:ok, bin} <- Base.decode16(encoded, case: :mixed),
         <<_offset::binary-size(32), len::unsigned-big-integer-size(256), rest::binary>> <- bin,
         <<reason::binary-size(len), _padding::binary>> <- rest do
      {:ok, reason}
    else
      _ -> :error
    end
  end

  def revert_reason(_), do: :error
end
