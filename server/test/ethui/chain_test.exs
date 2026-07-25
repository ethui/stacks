defmodule Ethui.ChainTest do
  use ExUnit.Case, async: true

  alias Ethui.Chain

  describe "hex/1" do
    test "encodes integers as hex quantities" do
      assert Chain.hex(0) == "0x0"
      assert Chain.hex(255) == "0xff"
    end
  end

  describe "block_param/1" do
    test "passes through tags and hex" do
      assert Chain.block_param("latest") == "latest"
      assert Chain.block_param("0x10") == "0x10"
    end

    test "converts decimal block numbers" do
      assert Chain.block_param("16") == "0x10"
    end
  end

  describe "revert_reason/1" do
    test "decodes an Error(string) payload" do
      assert {:ok, "insufficient funds"} =
               Chain.revert_reason(%{"data" => error_payload("insufficient funds")})
    end

    test "ignores payloads it cannot decode" do
      assert :error == Chain.revert_reason(%{"data" => "0xdeadbeef"})
      assert :error == Chain.revert_reason(%{"message" => "execution reverted"})
    end
  end

  defp error_payload(reason) do
    len = byte_size(reason)
    padding = :binary.copy(<<0>>, 32 - rem(len, 32))

    "0x08c379a0" <> word(32) <> word(len) <> Base.encode16(reason <> padding, case: :lower)
  end

  defp word(n), do: n |> Integer.to_string(16) |> String.downcase() |> String.pad_leading(64, "0")
end
