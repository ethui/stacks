/// TODO: add this to the ui library/change the current one
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ethui/ui/components/shadcn/tooltip";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={handleCopy} className={className}>
          <Copy className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : text}</TooltipContent>
    </Tooltip>
  );
}
