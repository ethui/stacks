import { z } from "zod";
import { api } from "./axios";

export const stackSchema = z.object({
  slug: z.string(),
  status: z.enum(["running", "stopped"]),
  chain_id: z.number(),
  rpc_url: z.string(),
  explorer_url: z.string(),
  anvil_opts: z
    .object({
      fork_url: z.string(),
      fork_block_number: z.number().optional(),
    })
    .optional(),
  graph_url: z.string().optional(),
  ipfs_url: z.string().optional(),
  inserted_at: z.number(),
  updated_at: z.number(),
});

export const createStackInputSchema = z.object({
  slug: z.string(),
  anvil_opts: z
    .object({
      fork_url: z.string().optional(),
      fork_block_number: z.number().optional(),
    })
    .optional(),
  graph_opts: z
    .object({
      enabled: z.boolean().optional(),
    })
    .optional(),
});

export type Stack = z.infer<typeof stackSchema>;
export type CreateStackInput = z.infer<typeof createStackInputSchema>;

export const stacks = {
  list: async () => {
    try {
      const res = await api.get("/stacks");
      return z.array(stackSchema).parse(res.data.data);
    } catch (error) {
      console.error("Failed to fetch stacks list:", error);
      throw error;
    }
  },
  get: async (slug: string) => {
    try {
      const res = await api.get(`/stacks/${slug}`);
      return stackSchema.parse(res.data);
    } catch (error) {
      console.error("Failed to fetch stack:", error);
      throw error;
    }
  },
  create: async (data: CreateStackInput) => {
    try {
      await api.post("/stacks", data);
    } catch (error) {
      console.error("Failed to create stack:", error);
      throw error;
    }
  },
  delete: async (slug: string) => {
    try {
      const res = await api.delete(`/stacks/${slug}`);
      return res.data;
    } catch (error) {
      console.error("Failed to delete stack:", error);
      throw error;
    }
  },
};
