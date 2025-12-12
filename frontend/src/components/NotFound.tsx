import { Button } from "@ethui/ui/components/shadcn/button";
import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-accent p-8">
      <div className="text-center">
        <h1 className="font-bold text-6xl text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground text-xl">Page not found</p>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-8 gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
