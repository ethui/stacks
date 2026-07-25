defmodule Ethui.MCP.Auth do
  @moduledoc """
  Resolves the caller of an MCP tool from the `Authorization` header carried on
  the frame, reusing the same JWT as the REST api.
  """

  alias Anubis.Server.Frame
  alias Ethui.Accounts
  alias Ethui.Accounts.User
  alias Ethui.Stacks
  alias Ethui.Stacks.Stack
  alias EthuiWeb.Plugs.Authenticate

  @spec current_user(Frame.t()) :: {:ok, User.t() | nil} | {:error, String.t()}
  def current_user(frame) do
    if Authenticate.enabled?() do
      with {:ok, token} <- bearer_token(frame), do: verify(token)
    else
      {:ok, nil}
    end
  end

  @doc "Fetches a stack the caller owns. Unowned stacks read as missing, to avoid leaking slugs"
  @spec fetch_stack(Frame.t(), String.t()) :: {:ok, Stack.t()} | {:error, String.t()}
  def fetch_stack(frame, slug) do
    with {:ok, user} <- current_user(frame) do
      case Stacks.get_stack_by_slug(slug) do
        %Stack{} = stack -> authorize(user, stack, slug)
        nil -> {:error, not_found(slug)}
      end
    end
  end

  defp authorize(nil, stack, _slug), do: {:ok, stack}
  defp authorize(_user, %Stack{user_id: nil} = stack, _slug), do: {:ok, stack}
  defp authorize(%User{id: id}, %Stack{user_id: id} = stack, _slug), do: {:ok, stack}
  defp authorize(_user, _stack, slug), do: {:error, not_found(slug)}

  defp not_found(slug), do: "stack not found: #{slug}"

  defp bearer_token(%Frame{context: %{headers: headers}}) do
    case headers["authorization"] do
      "Bearer " <> token -> {:ok, token}
      _ -> {:error, "missing `Authorization: Bearer <token>` header"}
    end
  end

  defp bearer_token(_frame), do: {:error, "missing `Authorization: Bearer <token>` header"}

  defp verify(token) do
    case Accounts.verify_token(token) do
      {:ok, %User{} = user} -> {:ok, user}
      _ -> {:error, "invalid or expired token"}
    end
  rescue
    Ecto.NoResultsError -> {:error, "invalid or expired token"}
  end
end
