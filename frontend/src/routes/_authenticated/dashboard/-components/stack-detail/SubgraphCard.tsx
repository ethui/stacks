import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ethui/ui/components/shadcn/card";
import { Database, Globe } from "lucide-react";
import type { Stack } from "~/api/stacks";
import { DetailRow } from "./DetailRow";

interface SubgraphCardProps {
  stack: Stack;
}

export function SubgraphCard({ stack }: SubgraphCardProps) {
  return (
    <Card className="animation-delay-300 animate-fade-in-up rounded-xl shadow-md opacity-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-4 w-4" />
          Subgraph
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stack.graph_url ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-success text-xs">
                <Globe className="h-3 w-3" />
                Enabled
              </span>
            </div>
            <DetailRow label="Graph URL" value={stack.graph_url} copyable />
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            Subgraph indexing is not enabled for this stack.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
