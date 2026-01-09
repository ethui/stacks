import { useMutation } from "@tanstack/react-query";
import { createStore } from "mipd";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { Stack } from "~/api/stacks";
import {
  addChainToProvider,
  type EIP6963ProviderDetail,
  WalletError,
} from "~/utils/wallet";

const store = createStore();

export function useWalletProviders() {
  const [providers, setProviders] = useState<readonly EIP6963ProviderDetail[]>(
    [],
  );

  useEffect(() => {
    setProviders(store.getProviders());
    const unsubscribe = store.subscribe((newProviders) => {
      setProviders(newProviders);
    });

    return unsubscribe;
  }, []);

  return providers;
}

type AddChainInput = {
  wallet: EIP6963ProviderDetail;
  stack: Stack | Pick<Stack, "chain_id" | "rpc_url" | "slug">;
};

export function useAddChain() {
  const mutation = useMutation({
    mutationFn: async ({ wallet, stack }: AddChainInput) => {
      await addChainToProvider(wallet.provider, {
        chainId: stack.chain_id,
        chainName: stack.slug,
        rpcUrl: stack.rpc_url,
      });
    },
    onSuccess: (_data, { wallet }) => {
      toast.success(`Chain added to ${wallet.info.name}`);
    },
    onError: (error, { wallet }) => {
      if (error instanceof WalletError) {
        if (error.code !== 4001) {
          toast.error(error.message);
        }
      } else {
        toast.error(`Failed to add chain to ${wallet.info.name}`);
      }
    },
  });

  return {
    addChain: mutation.mutate,
    isAdding: mutation.isPending,
    pendingWalletId: mutation.variables?.wallet.info.uuid,
  };
}
