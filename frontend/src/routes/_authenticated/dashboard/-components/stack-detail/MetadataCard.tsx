import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ethui/ui/components/shadcn/card";
import { format, formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import type { Stack } from "~/api/stacks";
import { DetailRow } from "./DetailRow";

interface MetadataCardProps {
  stack: Stack;
}

export function MetadataCard({ stack }: MetadataCardProps) {
  return (
    <Card className="animation-delay-400 animate-fade-in-up rounded-xl shadow-md opacity-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-4 w-4" />
          Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailRow
          label="Created"
          value={`${format(new Date(stack.inserted_at), "PPp")} (${formatDistanceToNow(new Date(stack.inserted_at))} ago)`}
        />
        <DetailRow
          label="Last Updated"
          value={`${format(new Date(stack.updated_at), "PPp")} (${formatDistanceToNow(new Date(stack.updated_at))} ago)`}
        />
      </CardContent>
    </Card>
  );
}
