import { encodeFunctionData, formatUnits, parseAbiItem, type Address, type Hex } from "viem";
import { loadConfig } from "./config.js";
import { StacksClient } from "./stacks.js";
import { explorerLinks } from "./explorer.js";
import { clientFor, executeAs } from "./chain.js";
import { decodeVia4byte } from "./abi.js";

// Fork-mainnet whale demo: fork -> impersonate a USDC whale -> transfer to
// anvil account 0 -> decode the tx -> print explorer links -> tear down.
const USDC = (process.env.USDC ??
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48") as Address;
const WHALE = (process.env.WHALE ??
  "0x28C6c06298d514Db089934071355E5743bf21d60") as Address;
const RECIPIENT = (process.env.RECIPIENT ??
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") as Address;

const balanceOf = parseAbiItem("function balanceOf(address) view returns (uint256)");
const transfer = parseAbiItem("function transfer(address,uint256) returns (bool)");

async function main() {
  const cfg = loadConfig();
  const forkUrl = process.env.FORK_URL;
  if (!cfg.stacksToken) throw new Error("Set STACKS_TOKEN");
  if (!forkUrl) throw new Error("Set FORK_URL (a mainnet rpc to fork)");

  const stacks = new StacksClient(cfg);

  console.log("→ creating forked stack…");
  const stack = await stacks.createStack({ fork_url: forkUrl });
  const rpc = stack.urls.http_rpc;
  const links = explorerLinks(cfg, rpc);
  console.log(`  stack ${stack.slug} @ ${rpc}`);

  try {
    const client = clientFor(rpc);
    const read = (owner: Address) =>
      client.readContract({ address: USDC, abi: [balanceOf], functionName: "balanceOf", args: [owner] }) as Promise<bigint>;

    const whaleBal = await read(WHALE);
    console.log(`  whale USDC: ${formatUnits(whaleBal, 6)}`);
    const amount = whaleBal / 2n;

    const data = encodeFunctionData({ abi: [transfer], functionName: "transfer", args: [RECIPIENT, amount] }) as Hex;

    console.log("→ impersonating whale, transferring half…");
    const { hash } = await executeAs(rpc, WHALE, { to: USDC, data });
    console.log(`  tx ${hash}`);
    console.log(`  decoded: ${JSON.stringify(await decodeVia4byte(data))}`);

    const recipientBal = await read(RECIPIENT);
    console.log(`  recipient USDC: ${formatUnits(recipientBal, 6)}`);

    console.log("\nExplorer:");
    console.log(`  tx:        ${links.tx(hash)}`);
    console.log(`  recipient: ${links.address(RECIPIENT)}`);
  } finally {
    console.log("\n→ tearing down…");
    await stacks.deleteStack(stack.slug);
    console.log("  done");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
