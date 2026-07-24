import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  decodeFunctionData,
  parseAbiItem,
  parseEventLogs,
  slice,
  type Abi,
  type Hex,
  type Log,
} from "viem";

export interface Artifact {
  name: string;
  abi: Abi;
  bytecode: Hex;
}

interface Loaded {
  out: string;
  byName: Map<string, Artifact>;
  merged: Abi;
}

let cache: Loaded | null = null;

function walkJson(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...walkJson(full));
    else if (entry.endsWith(".json")) found.push(full);
  }
  return found;
}

function load(out: string): Loaded {
  if (cache && cache.out === out) return cache;

  const byName = new Map<string, Artifact>();
  const merged: Abi[number][] = [];

  for (const file of walkJson(out)) {
    let json: { abi?: Abi; bytecode?: { object?: string } };
    try {
      json = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      continue;
    }
    if (!json.abi) continue;

    const name = file.split("/").pop()!.replace(/\.json$/, "");
    const bytecode = (json.bytecode?.object ?? "0x") as Hex;
    byName.set(name, { name, abi: json.abi, bytecode });
    merged.push(...json.abi);
  }

  cache = { out, byName, merged };
  return cache;
}

export function getArtifact(out: string, name: string): Artifact {
  const artifact = load(out).byName.get(name);
  if (!artifact) throw new Error(`Contract "${name}" not found in ${out}`);
  return artifact;
}

export function decodeCalldata(out: string, data: Hex) {
  if (!data || data === "0x") return null;
  try {
    return decodeFunctionData({ abi: load(out).merged, data });
  } catch {
    return null;
  }
}

export function decodeLogs(out: string, logs: Log[]) {
  try {
    return parseEventLogs({ abi: load(out).merged, logs });
  } catch {
    return [];
  }
}

// Fallback when the selector isn't in out/: resolve the signature via the
// openchain/4byte database, then decode args from the recovered signature.
export async function decodeVia4byte(data: Hex) {
  if (!data || data.length < 10) return null;
  const selector = slice(data, 0, 4);
  try {
    const res = await fetch(
      `https://api.openchain.xyz/signature-database/v1/lookup?function=${selector}&filter=true`,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      result?: { function?: Record<string, { name: string }[]> };
    };
    const candidates = json.result?.function?.[selector] ?? [];
    for (const { name } of candidates) {
      try {
        const item = parseAbiItem(`function ${name}`);
        const decoded = decodeFunctionData({ abi: [item], data });
        return { signature: name, ...decoded, source: "4byte" as const };
      } catch {}
    }
  } catch {}
  return null;
}
