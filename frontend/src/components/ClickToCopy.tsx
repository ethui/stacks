/// TODO: add this to the ui library/change the current one
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ethui/ui/components/shadcn/tooltip";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface ClickToCopyProps {
  text: string;
  className?: string;
}

export function ClickToCopy({ text, className }: ClickToCopyProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setOpen(true);
  };

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={40}>
      <TooltipTrigger className="cursor-pointer" asChild>
        <button type="button" onClick={handleCopy} className={className}>
          <Copy className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : text}</TooltipContent>
    </Tooltip>
  );
}
