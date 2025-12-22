import { Button } from "@ethui/ui/components/shadcn/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
}

export function BackButton({ onClick, label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate({ to: ".." });
    }
  };

  return (
    <div className="mb-6 animate-fade-in opacity-0">
      <Button variant="ghost" onClick={handleClick} className="mb-4 -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </div>
  );
}
