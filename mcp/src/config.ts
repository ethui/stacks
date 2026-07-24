export interface Config {
  stacksApi: string;
  stacksToken: string | undefined;
  explorerBase: string;
  foundryOut: string | undefined;
}

export function loadConfig(): Config {
  return {
    stacksApi: process.env.STACKS_API ?? "https://api.stacks.ethui.dev",
    stacksToken: process.env.STACKS_TOKEN,
    explorerBase: process.env.EXPLORER_BASE ?? "https://explorer.ethui.dev",
    foundryOut: process.env.FOUNDRY_OUT,
  };
}
