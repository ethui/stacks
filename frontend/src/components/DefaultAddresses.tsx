import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ethui/ui/components/shadcn/card";
import { Skeleton } from "@ethui/ui/components/shadcn/skeleton";
import { ExternalLink as ExternalLinkIcon, Key } from "lucide-react";
import type { Address } from "viem";
import { formatEther } from "viem";
import { useBalance } from "wagmi";
import { useStack } from "~/components/StackProvider";
import {
  ANVIL_DEFAULT_MNEMONIC,
  useDefaultAddresses,
} from "~/hooks/useDefaultAddresses";
import { explorerUrl } from "~/utils/global";
import { ClickToCopy } from "./ClickToCopy";
import { ExternalLink } from "./ExternalLink";

interface DefaultAddressesProps {
  className?: string;
}

export function DefaultAddresses({ className }: DefaultAddressesProps) {
  const { data: addresses, isLoading, error } = useDefaultAddresses();
  const stack = useStack();
  const explorerBaseUrl = explorerUrl(stack.ws_rpc);

  if (isLoading) {
    return <DefaultAddressesSkeleton className={className} />;
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <p className="text-destructive">Failed to load addresses</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Accounts</CardTitle>
            <CardDescription>
              Pre-funded Anvil accounts for development
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <MnemonicSection />
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Accounts ({addresses?.length ?? 0})
          </p>
          <div className="space-y-1">
            {addresses?.map((address, index) => (
              <AddressRow
                key={address}
                address={address}
                index={index}
                explorerBaseUrl={explorerBaseUrl}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MnemonicSection() {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Mnemonic Phrase
      </p>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
        <code className="flex-1 text-xs break-all">
          {ANVIL_DEFAULT_MNEMONIC}
        </code>
        <ClickToCopy
          text={ANVIL_DEFAULT_MNEMONIC}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        />
      </div>
    </div>
  );
}

interface AddressRowProps {
  address: Address;
  index: number;
  explorerBaseUrl: string;
}

function AddressRow({ address, index, explorerBaseUrl }: AddressRowProps) {
  const { data: balance, isLoading } = useBalance({ address });

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
      <span className="w-7 shrink-0 text-xs text-muted-foreground">
        #{index + 1}
      </span>
      <code className="truncate font-mono text-xs">{address}</code>
      <div className="ml-auto flex items-center gap-2">
        <ClickToCopy
          text={address}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        />
        <ExternalLink
          href={`${explorerBaseUrl}/address/${address}`}
          tooltip="View in Explorer"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <ExternalLinkIcon className="h-3.5 w-3.5" />
        </ExternalLink>
        {isLoading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <span className="w-24 text-right text-xs text-muted-foreground">
            {balance
              ? `${Number(formatEther(balance.value)).toFixed(2)} ETH`
              : "0 ETH"}
          </span>
        )}
      </div>
    </div>
  );
}

function DefaultAddressesSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
