import { useQuery } from "@tanstack/react-query";
import { stacks } from "~/api/stacks";

export function useListStacks() {
  return useQuery({
    queryKey: ["stacks"],
    queryFn: stacks.list,
  });
}

interface UseGetStackOptions {
  enabled?: boolean;
}

export function useGetStack(slug: string, options?: UseGetStackOptions) {
  const { enabled = true } = options ?? {};
  return useQuery({
    queryKey: ["stack", slug],
    queryFn: () => stacks.get(slug),
    enabled: enabled && !!slug,
  });
}
