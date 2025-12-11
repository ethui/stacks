import { Button } from "@ethui/ui/components/shadcn/button";
import {
  ErrorComponent,
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import { AlertCircle, Home, RotateCcw } from "lucide-react";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent p-8">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 font-bold text-2xl text-foreground">
          Something went wrong
        </h1>
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <ErrorComponent error={error} />
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.invalidate()}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          {isRoot ? (
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          ) : (
            <Button asChild className="gap-2">
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
              >
                Go Back
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
