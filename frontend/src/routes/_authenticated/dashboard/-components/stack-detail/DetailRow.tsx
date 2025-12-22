import { ClickToCopy } from "@ethui/ui/components/click-to-copy";
import { Copy, ExternalLink } from "lucide-react";

interface DetailRowProps {
  label: string;
  value: string;
  copyable?: boolean;
  external?: boolean;
}

export function DetailRow({
  label,
  value,
  copyable,
  external,
}: DetailRowProps) {
  if (copyable) {
    return (
      <ClickToCopy text={value}>
        <div className="-m-2 cursor-pointer rounded-md p-2 hover:bg-accent/50">
          <DetailRowContent
            label={label}
            value={value}
            copyable={copyable}
            external={external}
          />
        </div>
      </ClickToCopy>
    );
  }

  return (
    <div className="-m-2 p-2">
      <DetailRowContent
        label={label}
        value={value}
        copyable={copyable}
        external={external}
      />
    </div>
  );
}

interface DetailRowContentProps {
  label: string;
  value: string;
  copyable?: boolean;
  external?: boolean;
}

function DetailRowContent({
  label,
  value,
  copyable,
  external,
}: DetailRowContentProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex items-center gap-2">
        <span className="break-all font-mono text-foreground text-sm">
          {value}
        </span>
        {copyable && <Copy className="h-3 w-3 shrink-0 opacity-50" />}
        {external && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
