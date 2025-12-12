import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Topbar } from "~/components/Topbar";
import { useAuthStore } from "~/store/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
