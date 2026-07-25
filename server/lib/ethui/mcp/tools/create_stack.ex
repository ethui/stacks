defmodule Ethui.MCP.Tools.CreateStack do
  @moduledoc """
  Creates a disposable anvil sandbox and returns its rpc urls plus an explorer
  link. Pass fork_url (and optionally fork_block_number) to fork a live chain.
  """

  use Ethui.MCP.Tool

  alias Ethui.MCP.Auth
  alias Ethui.MCP.StackInfo
  alias Ethui.Stacks
  alias Ethui.Stacks.Server

  schema do
    field(:slug, :string,
      description: "Stack name, lowercase alphanumeric + dashes. Generated if omitted"
    )

    field(:fork_url, :string, description: "RPC url to fork from, e.g. a mainnet endpoint")
    field(:fork_block_number, :integer, description: "Block to fork at. Defaults to chain head")
  end

  @impl true
  def execute(params, frame) do
    with {:ok, user} <- Auth.current_user(frame),
         {:ok, stack} <- Stacks.create_stack(user, attrs(params)),
         {:ok, _pid} <- Server.create(stack) do
      {:ok, stack.slug |> Stacks.get_stack_by_slug() |> StackInfo.describe()}
    else
      {:error, %Ecto.Changeset{} = changeset} -> {:error, changeset_error(changeset)}
      {:error, {:user_limit_exceeded, max}} -> {:error, "stack limit reached (#{max} per user)"}
      {:error, {:global_limit_exceeded, max}} -> {:error, "global stack limit reached (#{max})"}
      {:error, reason} when is_binary(reason) -> {:error, reason}
      {:error, reason} -> {:error, "could not create stack: #{inspect(reason)}"}
    end
    |> reply(frame)
  end

  defp attrs(params) do
    %{"slug" => params[:slug] || generate_slug(), "anvil_opts" => anvil_opts(params)}
  end

  defp anvil_opts(params) do
    %{"fork_url" => params[:fork_url], "fork_block_number" => params[:fork_block_number]}
    |> Enum.reject(fn {_k, v} -> is_nil(v) end)
    |> Map.new()
  end

  defp generate_slug,
    do: "mcp-" <> (4 |> :crypto.strong_rand_bytes() |> Base.encode16(case: :lower))

  defp changeset_error(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(fn {msg, _opts} -> msg end)
    |> Enum.map_join("; ", fn {field, msgs} -> "#{field} #{Enum.join(msgs, ", ")}" end)
  end
end
