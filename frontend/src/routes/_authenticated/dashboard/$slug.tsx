import { Button } from "@ethui/ui/components/shadcn/button";
import { Skeleton } from "@ethui/ui/components/shadcn/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { stacks } from "~/api/stacks";
import { ConnectionCard } from "./-components/stack-detail/ConnectionCard";
import { ForkConfigCard } from "./-components/stack-detail/ForkConfigCard";
import { MetadataCard } from "./-components/stack-detail/MetadataCard";
import { StackDetailHeader } from "./-components/stack-detail/StackDetailHeader";
import { SubgraphCard } from "./-components/stack-detail/SubgraphCard";

export const Route = createFileRoute("/_authenticated/dashboard/$slug")({
  component: StackDetailPage,
});

function StackDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: stack, isLoading } = useQuery({
    queryKey: ["stack", slug],
    queryFn: () => stacks.get(slug),
  });

  const deleteMutation = useMutation({
    mutationFn: () => stacks.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
      navigate({ to: "/dashboard" });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-6 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!stack) {
    return (
      <div className="container mx-auto max-w-5xl px-6 py-8">
        <div className="text-center">
          <h2 className="font-medium text-foreground text-xl">
            Stack not found
          </h2>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/dashboard" })}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 py-8">
      <StackDetailHeader
        stack={stack}
        onDelete={() => deleteMutation.mutate()}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <ConnectionCard stack={stack} />
        <ForkConfigCard stack={stack} />
        <SubgraphCard stack={stack} />
        <MetadataCard stack={stack} />
      </div>
    </div>
  );
}
