import { cn } from "@ethui/ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ethui/ui/components/shadcn/tooltip";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
}

export function ExternalLink({
  href,
  children,
  className,
  tooltip,
}: ExternalLinkProps) {
  const link = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-xs text-solidity-value hover:text-sky-700",
        className,
      )}
    >
      {children}
    </a>
  );

  if (!tooltip) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
