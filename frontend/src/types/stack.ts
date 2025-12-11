export interface Stack {
  id: string;
  slug: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  ipfsUrl?: string;
  graphUrl?: string;
  graphRpcUrl?: string;
  graphEnabled: boolean;
  anvilOpts: {
    forkUrl?: string;
    forkBlockNumber?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateStackInput {
  slug: string;
  anvilOpts?: {
    forkUrl?: string;
    forkBlockNumber?: number;
  };
  graphOpts?: {
    enabled?: boolean;
  };
}
