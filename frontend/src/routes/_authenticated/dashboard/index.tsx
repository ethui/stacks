import { Button } from "@ethui/ui/components/shadcn/button";
import { Skeleton } from "@ethui/ui/components/shadcn/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layers, Plus } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { stacks } from "~/api/stacks";
import { EmptyState } from "~/components/EmptyState";
import { useListStacks } from "~/hooks/useStacks";
import { trackPageView } from "~/utils/analytics";
import { StackCard } from "./-components/StackCard";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardPage,
});

const SKELETON_ITEMS = Array.from({ length: 6 }, (_, i) => i);

function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: stacksList, isLoading } = useListStacks();

  useEffect(() => {
    trackPageView("dashboard");
  }, []);

  const { mutate: deleteStack } = useMutation({
    mutationFn: stacks.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
      toast.success("Stack deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete stack");
    },
  });

  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="animate-fade-in opacity-0">
          <h1 className="font-bold text-3xl text-foreground">Your Stacks</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your on-demand Anvil nodes
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/dashboard/new" })}
          className="animation-delay-100 animate-fade-in gap-2 opacity-0"
        >
          <Plus className="h-4 w-4" />
          New Stack
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SKELETON_ITEMS.map((id) => (
            <Skeleton key={`skeleton-${id}`} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : stacksList && stacksList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stacksList.map((stack) => (
            <StackCard key={stack.slug} stack={stack} onDelete={deleteStack} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Layers className="h-6 w-6 text-primary" />}
          title="No stacks yet"
          description="Create your first stack to get started with on-demand Anvil nodes."
        >
          <Button
            onClick={() => navigate({ to: "/dashboard/new" })}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Stack
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
