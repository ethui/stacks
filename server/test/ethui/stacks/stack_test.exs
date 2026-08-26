defmodule Ethui.Stacks.StackTest do
  use Ethui.DataCase

  alias Ethui.Stacks.Stack

  defp anvil_opts(opts) do
    Stack.create_changeset(%{"slug" => "s", "anvil_opts" => opts})
  end

  describe "anvil_opts casting" do
    test "keeps allowed flags, casting numeric strings and flags" do
      changeset =
        anvil_opts(%{
          "accounts" => 15,
          "disable_block_gas_limit" => true,
          "slots_in_an_epoch" => "2",
          "block_time" => 12,
          "mixed_mining" => true,
          "state_interval" => 60,
          "transaction_block_keeper" => 20_000
        })

      assert changeset.valid?

      assert get_change(changeset, :anvil_opts) == %{
               "accounts" => 15,
               "disable_block_gas_limit" => true,
               "slots_in_an_epoch" => 2,
               "block_time" => 12,
               "mixed_mining" => true,
               "state_interval" => 60,
               "transaction_block_keeper" => 20_000
             }
    end

    test "drops unknown and server-managed flags" do
      changeset =
        anvil_opts(%{
          "port" => 4000,
          "host" => "0.0.0.0",
          "state" => "/etc/passwd",
          "dump_state" => "/etc/passwd",
          "fork_header" => "Authorization: secret",
          "made_up" => "x",
          "accounts" => 15
        })

      assert changeset.valid?
      assert get_change(changeset, :anvil_opts) == %{"accounts" => 15}
    end

    test "rejects out-of-range and mistyped values on known flags" do
      assert %{anvil_opts: [msg]} = errors_on(anvil_opts(%{"accounts" => 0}))
      assert msg =~ "accounts must be an integer between 1 and 100"

      assert %{anvil_opts: [msg]} = errors_on(anvil_opts(%{"slots_in_an_epoch" => "many"}))
      assert msg =~ "slots_in_an_epoch must be an integer"

      assert %{anvil_opts: [msg]} = errors_on(anvil_opts(%{"prune_history" => "yes"}))
      assert msg =~ "prune_history must be a boolean"
    end

    test "rejects contradictory mining flags" do
      assert %{anvil_opts: [msg]} = errors_on(anvil_opts(%{"mixed_mining" => true}))
      assert msg =~ "mixed_mining requires block_time"

      assert %{anvil_opts: [msg]} =
               errors_on(anvil_opts(%{"no_mining" => true, "block_time" => 12}))

      assert msg =~ "no_mining cannot be combined with block_time or mixed_mining"
    end

    test "rejects a fork block number without a fork url" do
      assert %{anvil_opts: [msg]} = errors_on(anvil_opts(%{"fork_block_number" => 100}))
      assert msg =~ "fork_block_number requires fork_url"

      assert anvil_opts(%{"fork_url" => "http://localhost:1", "fork_block_number" => 100}).valid?
    end

    test "rejects a non-map value" do
      assert %{anvil_opts: ["is invalid"]} = errors_on(anvil_opts("--port 4000"))
    end
  end
end
