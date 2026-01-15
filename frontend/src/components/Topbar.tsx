import { EthuiLogo } from "@ethui/ui/components/ethui-logo";
import { Button } from "@ethui/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ethui/ui/components/shadcn/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { useGetUser } from "~/hooks/useAuth";
import { useAuthStore } from "~/store/auth";

export function Topbar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { data: user } = useGetUser();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const handleLogoClick = () => {
    navigate({ to: "/dashboard" });
  };

  return (
    <nav className="flex w-full flex-row items-center justify-between border-b border-border/50 bg-accent px-6 py-4">
      <button
        type="button"
        onClick={handleLogoClick}
        className="flex cursor-pointer items-center gap-3 transition-opacity duration-200 hover:opacity-80"
        title="Go to dashboard"
      >
        <EthuiLogo size={28} />
        <span className="font-semibold text-foreground text-lg">
          ethui <span className="text-primary">stacks</span>
        </span>
      </button>

      {/* Right: Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            {user?.email && (
              <span className="text-sm text-muted-foreground">{user.email}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleLogout}
            className="gap-2 text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
