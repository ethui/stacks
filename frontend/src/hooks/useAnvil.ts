import { useQuery } from "@tanstack/react-query";
import { anvil } from "~/api/anvil";

export function useAnvilNodeInfo(
  stackSlug: string,
  rpcUrl: string | undefined,
) {
  return useQuery({
    queryKey: ["anvilNodeInfo", stackSlug],
    queryFn: () => anvil.getNodeInfo(rpcUrl!),
    enabled: !!rpcUrl,
  });
}

export function useForkChainId(stackSlug: string, forkUrl: string | undefined) {
  return useQuery({
    queryKey: ["forkChainId", stackSlug],
    queryFn: () => anvil.getChainId(forkUrl!),
    enabled: !!forkUrl,
  });
}
