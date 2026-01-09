import type { EIP1193Provider, EIP6963ProviderDetail } from "mipd";

export type { EIP6963ProviderDetail };

export class WalletError extends Error {
  constructor(
    message: string,
    public code?: number,
  ) {
    super(message);
    this.name = "WalletError";
  }
}

function chainIdToHex(chainId: number): string {
  return `0x${chainId.toString(16)}`;
}

export interface AddChainParams {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  wsUrl: string;
  explorerUrl: string;
}

export async function addChainToProvider(
  provider: EIP1193Provider,
  params: AddChainParams,
): Promise<void> {
  try {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainIdToHex(params.chainId),
          chainName: params.chainName,
          rpcUrls: [params.rpcUrl],
          wsUrls: [params.wsUrl],
          blockExplorerUrls: [params.explorerUrl],
          nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
          },
        },
      ],
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 4001
    ) {
      throw new WalletError("Request rejected by user", 4001);
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to add network to wallet";
    throw new WalletError(message);
  }
}
