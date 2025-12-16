import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "~/store/auth";

export const Route = createFileRoute("/_unauthenticated")({
  ssr: false,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: UnauthenticatedLayout,
});

function UnauthenticatedLayout() {
  return <Outlet />;
}
