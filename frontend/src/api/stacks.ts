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
  inserted_at: z.number(),
  updated_at: z.number(),
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
  list: (): Promise<Stack[]> =>
    api.get("/stacks").then((res) => z.array(stackSchema).parse(res.data.data)),
  get: (slug: string): Promise<Stack> =>
    api.get(`/stacks/${slug}`).then((res) => stackSchema.parse(res.data)),
  create: (data: CreateStackInput): Promise<Stack> =>
    api.post("/stacks", data).then((res) => stackSchema.parse(res.data)),
  delete: (slug: string): Promise<void> => api.delete(`/stacks/${slug}`),
};
