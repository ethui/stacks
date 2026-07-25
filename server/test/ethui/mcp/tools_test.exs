defmodule Ethui.MCP.ToolsTest do
  use Ethui.DataCase, async: false

  alias Anubis.Server.Context
  alias Anubis.Server.Frame
  alias Ethui.Accounts
  alias Ethui.MCP.Tools
  alias Ethui.Stacks
  alias Ethui.Stacks.Server
  alias Ethui.Stacks.Stack

  @whale "0x1111111111111111111111111111111111111111"
  @recipient "0x2222222222222222222222222222222222222222"

  setup do
    original = Application.get_env(:ethui, EthuiWeb.Plugs.Authenticate, [])
    Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, enabled: true)

    on_exit(fn ->
      Application.put_env(:ethui, EthuiWeb.Plugs.Authenticate, original)
      Enum.each(Server.list(), &Server.destroy(%Stack{slug: &1}))
    end)

    {:ok, frame: authenticated_frame()}
  end

  describe "auth" do
    test "rejects calls without a bearer token" do
      assert {:error, message} = call(Tools.ListStacks, %{}, %Frame{})
      assert message =~ "Authorization"
    end

    test "hides stacks owned by another user", %{frame: frame} do
      {:ok, other} = Stacks.create_stack(user("other"), %{"slug" => "someone-elses"})
      on_exit(fn -> Stacks.delete_stack(other) end)

      assert {:error, "stack not found: someone-elses"} =
               call(
                 Tools.GetBlock,
                 %{slug: "someone-elses", block: "latest", full_transactions: false},
                 frame
               )
    end

    test "reports unknown slugs as not found", %{frame: frame} do
      assert {:error, "stack not found: nope"} = call(Tools.Snapshot, %{slug: "nope"}, frame)
    end
  end

  describe "lifecycle" do
    test "creates, lists and deletes a stack", %{frame: frame} do
      assert {:ok, %{slug: slug, status: "running", http_rpc: rpc, explorer: explorer}} =
               call(Tools.CreateStack, %{}, frame)

      assert rpc =~ slug
      assert explorer =~ "/rpc/"

      assert {:ok, stacks} = call(Tools.ListStacks, %{}, frame)
      assert Enum.any?(stacks, &(&1.slug == slug))

      assert {:ok, %{deleted: true}} = call(Tools.DeleteStack, %{slug: slug}, frame)
      assert {:ok, []} = call(Tools.ListStacks, %{}, frame)
    end

    test "rejects an invalid slug", %{frame: frame} do
      assert {:error, message} = call(Tools.CreateStack, %{slug: "Not Valid"}, frame)
      assert message =~ "slug"
    end
  end

  describe "chain tools" do
    setup %{frame: frame} do
      {:ok, %{slug: slug}} = call(Tools.CreateStack, %{}, frame)
      {:ok, slug: slug}
    end

    test "reads blocks and addresses", %{frame: frame, slug: slug} do
      assert {:ok, block} =
               call(
                 Tools.GetBlock,
                 %{slug: slug, block: "latest", full_transactions: false},
                 frame
               )

      assert block.number == "0x0"
      assert block.explorer =~ "/block/0x0"

      assert {:ok, %{is_contract: false, nonce: "0"}} =
               call(Tools.GetAddress, %{slug: slug, address: @whale, block: "latest"}, frame)
    end

    test "mines blocks", %{frame: frame, slug: slug} do
      assert {:ok, %{mined: 3, block_number: "0x3"}} =
               call(Tools.Mine, %{slug: slug, blocks: 3}, frame)
    end

    test "funds an address and moves value from it", %{frame: frame, slug: slug} do
      one_eth = "1000000000000000000"

      assert {:ok, _} =
               call(
                 Tools.SetBalance,
                 %{slug: slug, address: @whale, balance: "2#{one_eth}"},
                 frame
               )

      assert {:ok, %{status: "success", hash: hash}} =
               call(
                 Tools.Execute,
                 %{slug: slug, to: @recipient, from: @whale, value: one_eth},
                 frame
               )

      assert {:ok, %{transaction: tx, explorer: explorer}} =
               call(Tools.GetTransaction, %{slug: slug, hash: hash}, frame)

      assert String.downcase(tx.from) == @whale
      assert explorer =~ "/tx/#{hash}"

      assert {:ok, %{balance_wei: ^one_eth}} =
               call(Tools.GetAddress, %{slug: slug, address: @recipient, block: "latest"}, frame)
    end

    test "simulates a call without committing state", %{frame: frame, slug: slug} do
      assert {:ok, %{result: "0x"}} =
               call(
                 Tools.SimulateCall,
                 %{slug: slug, to: @recipient, data: "0x", value: "0", block: "latest"},
                 frame
               )
    end

    test "snapshots and reverts", %{frame: frame, slug: slug} do
      assert {:ok, %{snapshot_id: id}} = call(Tools.Snapshot, %{slug: slug}, frame)

      assert {:ok, _} =
               call(Tools.SetBalance, %{slug: slug, address: @whale, balance: "1"}, frame)

      assert {:ok, %{reverted: true}} = call(Tools.Revert, %{slug: slug, snapshot_id: id}, frame)

      assert {:ok, %{balance_wei: "0"}} =
               call(Tools.GetAddress, %{slug: slug, address: @whale, block: "latest"}, frame)

      assert {:error, message} = call(Tools.Revert, %{slug: slug, snapshot_id: id}, frame)
      assert message =~ "unknown or already consumed snapshot"
    end

    test "moves block time forward", %{frame: frame, slug: slug} do
      future = System.os_time(:second) + 3600

      assert {:ok, %{mined: true}} =
               call(Tools.SetBlockTimestamp, %{slug: slug, timestamp: future, mine: true}, frame)

      assert {:ok, block} =
               call(
                 Tools.GetBlock,
                 %{slug: slug, block: "latest", full_transactions: false},
                 frame
               )

      assert String.to_integer(String.replace(block.timestamp, "0x", ""), 16) == future
    end

    test "impersonates and releases an address", %{frame: frame, slug: slug} do
      assert {:ok, %{impersonating: true}} =
               call(Tools.Impersonate, %{slug: slug, address: @whale, stop: false}, frame)

      assert {:ok, %{impersonating: false}} =
               call(Tools.Impersonate, %{slug: slug, address: @whale, stop: true}, frame)
    end

    test "returns no logs on a fresh chain", %{frame: frame, slug: slug} do
      assert {:ok, %{count: 0}} =
               call(
                 Tools.GetLogs,
                 %{slug: slug, from_block: "earliest", to_block: "latest"},
                 frame
               )
    end
  end

  # Params arrive already validated at runtime, so defaults are passed explicitly here
  defp call(tool, params, frame) do
    assert {:reply, response, %Frame{}} = tool.execute(params, frame)

    [%{"type" => "text", "text" => text}] = response.content

    if response.isError, do: {:error, text}, else: {:ok, Jason.decode!(text, keys: :atoms)}
  end

  defp authenticated_frame do
    {:ok, token} = Accounts.generate_token(user("mcp"))
    %Frame{context: %Context{headers: %{"authorization" => "Bearer #{token}"}}}
  end

  defp user(prefix) do
    email = "#{prefix}-#{System.unique_integer([:positive])}@example.com"
    {:ok, user} = Accounts.send_verification_code(email)
    user
  end
end
