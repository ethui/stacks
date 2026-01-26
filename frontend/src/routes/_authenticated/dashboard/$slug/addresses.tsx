import { Button } from "@ethui/ui/components/shadcn/button";
import {
  Card,
  CardContent,
} from "@ethui/ui/components/shadcn/card";
import { Skeleton } from "@ethui/ui/components/shadcn/skeleton";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BackButton } from "~/components/BackButton";
import { DefaultAddresses } from "~/components/DefaultAddresses";
import { StackProvider } from "~/components/StackProvider";
import { useGetStack } from "~/hooks/useStacks";

export const Route = createFileRoute(
  "/_authenticated/dashboard/$slug/addresses",
)({
  component: AddressesPage,
});

function AddressesPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { data: stack, isLoading } = useGetStack(slug);

  const handleGoToDashboard = () => {
    navigate({ to: "/dashboard" });
  };

  if (isLoading) {
    return (
      <div className="flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <Skeleton className="mb-4 h-9 w-40" />
          <Card>
            <CardContent className="space-y-6 py-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
              <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
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
      <div className="w-full max-w-2xl">
        <BackButton label="Back to Dashboard" onClick={handleGoToDashboard} />
        <StackProvider stack={stack}>
          <DefaultAddresses className="animate-fade-in-up opacity-0" />
        </StackProvider>
      </div>
    </div>
  );
}
