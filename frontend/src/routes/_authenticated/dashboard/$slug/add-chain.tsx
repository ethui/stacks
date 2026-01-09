import { Button } from "@ethui/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ethui/ui/components/shadcn/card";
import { Skeleton } from "@ethui/ui/components/shadcn/skeleton";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Wallet } from "lucide-react";
import { BackButton } from "~/components/BackButton";
import { useAddChain, useWalletProviders } from "~/hooks/useAddChain";
import { useGetStack } from "~/hooks/useStacks";
import { explorerUrl } from "~/utils/global";
import type { EIP6963ProviderDetail } from "~/utils/wallet";

export const Route = createFileRoute(
  "/_authenticated/dashboard/$slug/add-chain",
)({
  component: AddChainPage,
});

function AddChainPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { data: stack, isLoading } = useGetStack(slug);
  const wallets = useWalletProviders();
  const { addChain, isAdding, pendingWalletId } = useAddChain();

  const handleAddChain = (wallet: EIP6963ProviderDetail) => {
    if (!stack) return;
    addChain({ wallet, stack });
  };

  const handleGoToDashboard = () => {
    navigate({ to: "/dashboard" });
  };

  if (isLoading) {
    return (
      <div className="flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <Skeleton className="mb-4 h-9 w-40" />
          <Card>
            <CardHeader className="text-center">
              <Skeleton className="mx-auto mb-2 h-12 w-12 rounded-full" />
              <Skeleton className="mx-auto h-6 w-48" />
              <Skeleton className="mx-auto mt-2 h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!stack) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Stack not found</p>
            <Button
              variant="outline"
              onClick={handleGoToDashboard}
              className="mt-4"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <BackButton label="Back to Dashboard" onClick={handleGoToDashboard} />
        <Card className="animate-fade-in-up opacity-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Add Chain to Wallet</CardTitle>
            <CardDescription>
              Add "<span className="font-semibold">{stack.slug}</span>" to your
              Web3 wallet to start interacting with this network.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Chain Name: </span>
                  <span className="font-medium">{stack.slug}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Chain ID: </span>
                  <span className="font-mono">{stack.chain_id}</span>
                </div>
              </div>

              <UrlRow label="RPC URL" value={stack.rpc_url} />
              <UrlRow label="WebSocket URL" value={stack.ws_rpc} />
              <UrlRow label="Explorer URL" value={explorerUrl(stack.ws_rpc)} />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                Select wallet(s)
              </p>
              <WalletList
                wallets={wallets}
                isAdding={isAdding}
                pendingWalletId={pendingWalletId}
                onAddChain={handleAddChain}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UrlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <p className="truncate font-mono text-xs" title={value}>
        {value}
      </p>
    </div>
  );
}

interface WalletListProps {
  wallets: readonly EIP6963ProviderDetail[];
  isAdding: boolean;
  pendingWalletId: string | undefined;
  onAddChain: (wallet: EIP6963ProviderDetail) => void;
}

function WalletList({
  wallets,
  isAdding,
  pendingWalletId,
  onAddChain,
}: WalletListProps) {
  if (wallets.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No Web3 wallet detected. Please install a wallet extension.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {wallets.map((wallet) => {
        const isPending = isAdding && pendingWalletId === wallet.info.uuid;
        return (
          <button
            key={wallet.info.uuid}
            onClick={() => onAddChain(wallet)}
            disabled={isAdding}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted disabled:opacity-50"
          >
            <img
              src={wallet.info.icon}
              alt={wallet.info.name}
              className="h-8 w-8 rounded-md"
            />
            <span className="flex-1 text-left font-medium">
              {wallet.info.name}
            </span>
            {isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </button>
        );
      })}
    </div>
  );
}
