import type { Config } from "./config.js";

// Explorer encodes the RPC url as base64 in the path: atob(params.rpc).
// The stack's api key is already inside http_rpc, so the browser self-auths.
function encodeRpc(rpc: string): string {
  return Buffer.from(rpc, "utf8").toString("base64");
}

export function explorerLinks(cfg: Config, rpc: string) {
  const base = `${cfg.explorerBase}/rpc/${encodeRpc(rpc)}`;
  return {
    root: base,
    tx: (hash: string) => `${base}/tx/${hash}`,
    address: (addr: string) => `${base}/address/${addr}`,
    block: (n: number | string) => `${base}/block/${n}`,
  };
}
