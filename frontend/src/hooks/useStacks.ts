import { useQuery } from "@tanstack/react-query";
import { stacks } from "~/api/stacks";

export function useListStacks() {
  return useQuery({
    queryKey: ["stacks"],
    queryFn: stacks.list,
  });
}

export function useGetStack(slug: string) {
  return useQuery({
    queryKey: ["stack", slug],
    queryFn: () => stacks.get(slug),
  });
}
