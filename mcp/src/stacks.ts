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
    // The create/show `urls` omit the per-stack key until provisioning catches
    // up; resolve it from the api-key endpoint, which is populated immediately,
    // then wait until anvil actually answers.
    const stack = await this.resolveStack(data.slug);
    await this.waitForAnvil(stack.urls.http_rpc);
    return stack;
  }

  async listStacks(): Promise<Stack[]> {
    const { data } = await this.req<{ data: Stack[] }>("/stacks");
    return data;
  }

  async getStack(slug: string): Promise<Stack> {
    const { data } = await this.req<{ data: Stack }>(`/stacks/${slug}`);
    return data;
  }

  async apiKeyToken(slug: string): Promise<string> {
    const { data } = await this.req<{ data: { token: string } }>(
      `/stacks/${slug}/api-keys`,
    );
    return data.token;
  }

  // Stack services live at {scheme}//{slug}.{baseHost}; baseHost is the api
  // host without its "api." prefix (api.stacks.ethui.dev -> stacks.ethui.dev).
  private origins(slug: string) {
    const api = new URL(this.cfg.stacksApi);
    const baseHost = api.host.replace(/^api\./, "");
    const ws = api.protocol === "https:" ? "wss:" : "ws:";
    return {
      http: `${api.protocol}//${slug}.${baseHost}`,
      ws: `${ws}//${slug}.${baseHost}`,
    };
  }

  // The show/list `urls` lag behind provisioning, but the api-key exists at
  // once — so build the keyed urls ourselves and wait for anvil to answer.
  async resolveStack(slug: string): Promise<Stack> {
    const token = await this.apiKeyToken(slug);
    const o = this.origins(slug);
    const urls: StackUrls = {
      http_rpc: `${o.http}/${token}`,
      ws_rpc: `${o.ws}/${token}`,
      explorer: `${o.http}/${token}`,
    };
    return { slug, status: "running", urls };
  }

  async waitForAnvil(rpc: string, tries = 45, delayMs = 2000): Promise<void> {
    for (let i = 0; i < tries; i++) {
      try {
        const r = await fetch(rpc, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
        });
        if (r.ok && (await r.json())?.result) return;
      } catch {}
      await new Promise((res) => setTimeout(res, delayMs));
    }
    throw new Error(`anvil for ${rpc} did not respond in time`);
  }

  async rpcFor(slug: string): Promise<string> {
    return (await this.resolveStack(slug)).urls.http_rpc;
  }

  async deleteStack(slug: string): Promise<void> {
    await this.req<void>(`/stacks/${slug}`, { method: "DELETE" });
  }
}
