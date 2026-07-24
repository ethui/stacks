import { createPublicClient, http, type Address, type Hash } from "viem";

export function clientFor(rpc: string) {
  return createPublicClient({ transport: http(rpc) });
}

// viem returns bigints; JSON.stringify can't serialize them. Bigints become strings.
export function jsonSafe<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? v.toString() : v)),
  );
}

export async function getBlock(rpc: string, block: bigint | "latest") {
  const client = clientFor(rpc);
  return block === "latest"
    ? client.getBlock()
    : client.getBlock({ blockNumber: block });
}

export async function getTransaction(rpc: string, hash: Hash) {
  const client = clientFor(rpc);
  const [tx, receipt] = await Promise.all([
    client.getTransaction({ hash }),
    client.getTransactionReceipt({ hash }).catch(() => null),
  ]);
  return { tx, receipt };
}

export async function getAddress(rpc: string, address: Address) {
  const client = clientFor(rpc);
  const [balance, nonce, code] = await Promise.all([
    client.getBalance({ address }),
    client.getTransactionCount({ address }),
    client.getCode({ address }),
  ]);
  return { address, balance, nonce, isContract: !!code && code !== "0x", code };
}

export async function getLogs(
  rpc: string,
  params: { address?: Address; fromBlock?: bigint; toBlock?: bigint },
) {
  const client = clientFor(rpc);
  return client.getLogs({
    address: params.address,
    fromBlock: params.fromBlock,
    toBlock: params.toBlock,
  });
}
