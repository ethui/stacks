import { createContext, useContext, useMemo } from "react";
import { WagmiProvider } from "wagmi";
import type { Stack } from "~/api/stacks";
import { createStackClient, createStackConfig } from "~/utils/stackClient";

type StackClient = ReturnType<typeof createStackClient>;

interface StackContextValue {
  client: StackClient;
  stack: Stack;
}

const StackContext = createContext<StackContextValue | null>(null);

export function useStackClient(): StackClient {
  const context = useContext(StackContext);
  if (!context) {
    throw new Error("useStackClient must be used within a StackProvider");
  }
  return context.client;
}

export function useStack(): Stack {
  const context = useContext(StackContext);
  if (!context) {
    throw new Error("useStack must be used within a StackProvider");
  }
  return context.stack;
}

interface StackProviderProps {
  stack: Stack;
  children: React.ReactNode;
}

export function StackProvider({ stack, children }: StackProviderProps) {
  const config = useMemo(() => createStackConfig(stack), [stack]);
  const client = useMemo(() => createStackClient(stack), [stack]);
  const contextValue = useMemo(
    () => ({ client, stack }),
    [client, stack],
  );

  return (
    <WagmiProvider config={config}>
      <StackContext.Provider value={contextValue}>
        {children}
      </StackContext.Provider>
    </WagmiProvider>
  );
}
