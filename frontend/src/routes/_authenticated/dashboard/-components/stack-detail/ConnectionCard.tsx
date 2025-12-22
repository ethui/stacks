import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ethui/ui/components/shadcn/card";
import { Link as LinkIcon } from "lucide-react";
import type { Stack } from "~/api/stacks";
import { DetailRow } from "./DetailRow";

interface ConnectionCardProps {
  stack: Stack;
}

export function ConnectionCard({ stack }: ConnectionCardProps) {
  return (
    <Card className="animation-delay-100 animate-fade-in-up rounded-xl shadow-md opacity-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <LinkIcon className="h-4 w-4" />
          Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailRow label="RPC URL" value={stack.rpc_url} copyable />
        <DetailRow
          label="Explorer"
          value={stack.explorer_url}
          copyable
          external
        />
        {stack.ipfs_url && (
          <DetailRow label="IPFS" value={stack.ipfs_url} copyable />
        )}
      </CardContent>
    </Card>
  );
}

