import { z } from "zod";
import { api } from "./axios";

export const stackSchema = z.object({
  slug: z.string(),
  status: z.enum(["running", "error"]),
  chain_id: z.number(),
  rpc_url: z.string(),
  explorer_url: z.string(),
  anvil_opts: z
    .object({
      fork_url: z.string(),
      fork_block_number: z.number(),
    })
    .optional(),
  graph_url: z.string().optional(),
  ipfs_url: z.string().optional(),
  inserted_at: z.string(),
  updated_at: z.string(),
});

export const createStackInputSchema = z.object({
  slug: z.string(),
  anvilOpts: z
    .object({
      forkUrl: z.string().optional(),
      forkBlockNumber: z.number().optional(),
    })
    .optional(),
  graphOpts: z
    .object({
      enabled: z.boolean().optional(),
    })
    .optional(),
});

export type Stack = z.infer<typeof stackSchema>;
export type CreateStackInput = z.infer<typeof createStackInputSchema>;

export const stacks = {
  list: (): Promise<Stack[]> => api.get("/stacks"),
  get: (slug: string): Promise<Stack> => api.get(`/stacks/${slug}`),
  create: (data: CreateStackInput): Promise<Stack> => api.post("/stacks", data),
  delete: (slug: string): Promise<void> => api.delete(`/stacks/${slug}`),
};
