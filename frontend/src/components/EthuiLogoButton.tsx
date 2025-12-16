import { EthuiLogo } from "@ethui/ui/components/ethui-logo";

interface EthuiLogoButtonProps {
  size?: number;
}

export function EthuiLogoButton({ size = 96 }: EthuiLogoButtonProps) {
  return (
    <div className="flex animate-fade-in justify-center opacity-0">
      <button
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={() =>
          window.open("https://ethui.dev/", "_blank", "noopener,noreferrer")
        }
        title="Visit ethui.dev"
        type="button"
      >
        <EthuiLogo size={size} />
      </button>
    </div>
  );
}
