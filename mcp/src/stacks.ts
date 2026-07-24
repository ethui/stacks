import type { Config } from "./config.js";

export interface StackUrls {
  http_rpc: string;
  ws_rpc: string;
  explorer: string;
  [key: string]: string;
}

export interface Stack {
  slug: string;
  status: string;
  urls: StackUrls;
  chain_id?: string;
  anvil_opts?: Record<string, unknown>;
}

export interface CreateStackParams {
  slug?: string;
  fork_url?: string;
  fork_block_number?: number;
}

export class StacksClient {
  constructor(private cfg: Config) {}

  private async req<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      "content-type": "application/json",
      ...(init?.headers as Record<string, string>),
    };
    if (this.cfg.stacksToken) {
      headers.authorization = `Bearer ${this.cfg.stacksToken}`;
    }

    const res = await fetch(`${this.cfg.stacksApi}${path}`, { ...init, headers });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Stacks ${init?.method ?? "GET"} ${path} -> ${res.status}: ${body}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  async createStack(params: CreateStackParams): Promise<Stack> {
    const anvil_opts: Record<string, unknown> = {};
    if (params.fork_url) anvil_opts.fork_url = params.fork_url;
    if (params.fork_block_number != null)
      anvil_opts.fork_block_number = params.fork_block_number;

    const body: Record<string, unknown> = { anvil_opts };
    if (params.slug) body.slug = params.slug;

    const { data } = await this.req<{ data: Stack }>("/stacks", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return data;
  }

  async listStacks(): Promise<Stack[]> {
    const { data } = await this.req<{ data: Stack[] }>("/stacks");
    return data;
  }

  async deleteStack(slug: string): Promise<void> {
    await this.req<void>(`/stacks/${slug}`, { method: "DELETE" });
  }
}
