import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ethui/ui/components/shadcn/card";
import { GitFork } from "lucide-react";
import type { Stack } from "~/api/stacks";
import { DetailRow } from "./DetailRow";

interface ForkConfigCardProps {
  stack: Stack;
}

export function ForkConfigCard({ stack }: ForkConfigCardProps) {
  return (
    <Card className="animation-delay-200 animate-fade-in-up rounded-xl shadow-md opacity-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitFork className="h-4 w-4" />
          Fork Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stack.anvil_opts ? (
          <>
            <DetailRow
              label="Fork URL"
              value={stack.anvil_opts.fork_url}
              copyable
            />
            <DetailRow
              label="Fork Block"
              value={`#${stack.anvil_opts.fork_block_number.toLocaleString()}`}
            />
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            This stack is not forked from any network.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
