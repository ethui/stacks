import { Card } from "@ethui/ui/components/shadcn/card";
import type { Stack } from "~/api/stacks";
import { useStackInfo } from "~/hooks/useStackInfo";
import { StackCardContent } from "./StackCardContent";
import { StackCardHeader } from "./StackCardHeader";

interface StackCardProps {
  stack: Stack;
  onDelete: (slug: string) => void;
}

export function StackCard({ stack, onDelete }: StackCardProps) {
  const { data: stackInfo } = useStackInfo(stack);

  const { liveInfo, anvilInfo, forkChainId } = stackInfo;

  return (
    <Card className="stack-card flex animate-fade-in-up flex-col rounded-xl shadow-md opacity-0">
      <StackCardHeader stack={stack} onDelete={onDelete} />
      <StackCardContent
        stack={stack}
        liveInfo={liveInfo}
        anvilInfo={anvilInfo}
        forkChainId={forkChainId}
      />
    </Card>
  );
}
