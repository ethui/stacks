import { useQuery } from "@tanstack/react-query";
import { useStack, useStackClient } from "~/components/StackProvider";

export const ANVIL_DEFAULT_MNEMONIC =
  "test test test test test test test test test test test junk";

export function useDefaultAddresses() {
  const client = useStackClient();
  const stack = useStack();

  return useQuery({
    queryKey: ["defaultAddresses", stack.slug],
    queryFn: async () => {
      return await client.getAddresses();
    },
  });
}
