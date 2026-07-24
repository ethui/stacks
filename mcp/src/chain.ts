import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hash,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

// anvil's default funded account 0 — public, deterministic dev key.
export const ANVIL_ACCOUNT_0 =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as const;

export function clientFor(rpc: string) {
  return createPublicClient({ transport: http(rpc) });
}

export function walletFor(rpc: string, privateKey?: Hex) {
  const account = privateKeyToAccount(privateKey ?? ANVIL_ACCOUNT_0);
  return createWalletClient({ account, transport: http(rpc) });
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

export interface CallParams {
  to: Address;
  data?: Hex;
  value?: bigint;
  from?: Address;
}

export async function simulateCall(rpc: string, params: CallParams) {
  const client = clientFor(rpc);
  const result = await client.call({
    to: params.to,
    data: params.data,
    value: params.value,
    account: params.from,
  });
  return { data: result.data ?? "0x" };
}

export async function execute(
  rpc: string,
  params: CallParams,
  privateKey?: Hex,
) {
  const wallet = walletFor(rpc, privateKey);
  const public_ = clientFor(rpc);
  const hash = await wallet.sendTransaction({
    chain: null,
    to: params.to,
    data: params.data,
    value: params.value,
  });
  const receipt = await public_.waitForTransactionReceipt({ hash });
  return { hash, receipt };
}
