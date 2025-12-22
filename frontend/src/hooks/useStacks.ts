import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stacks, type CreateStackInput } from "~/api/stacks";

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

export function useCreateStack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStackInput) => stacks.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
    },
  });
}

export function useDeleteStack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => stacks.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
    },
  });
}
