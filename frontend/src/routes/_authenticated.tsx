import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { Topbar } from "~/components/Topbar";
import { useAuthStore } from "~/store/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    console.log("isAuthenticated", isAuthenticated);
    if (!isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isAuthenticated } = useAuthStore.getState();

  useEffect(() => {
    if (!isAuthenticated) {
      throw redirect({ to: "/" });
    }
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
