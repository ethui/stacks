export function minifyHash(hash: string) {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function explorerUrl(rpcUrl: string) {
  return `https://explorer.ethui.dev/rpc/${btoa(rpcUrl)}`;
}
