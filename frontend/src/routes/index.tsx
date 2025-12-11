import { EthuiLogo } from "@ethui/ui/components/ethui-logo";
import { Form } from "@ethui/ui/components/form";
import { Button } from "@ethui/ui/components/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GitFork, Globe, Layers, Zap } from "lucide-react";
import { type FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "~/store/auth";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const loginSchema = z.object({
  accessKey: z.string().min(1, "Access key is required"),
});

function RouteComponent() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      accessKey: "",
    },
  });

  const handleSubmit = (data: FieldValues) => {
    login(data.accessKey);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent p-8">
      <div className="w-full max-w-lg animate-fade-in space-y-8 opacity-0">
        <div className="animation-delay-200 flex animate-fade-in justify-center opacity-0">
          <button
            className="cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={() =>
              window.open("https://ethui.dev/", "_blank", "noopener,noreferrer")
            }
            title="Visit ethui.dev"
            type="button"
          >
            <EthuiLogo size={96} />
          </button>
        </div>

        <div className="animation-delay-400 animate-fade-in space-y-3 text-center opacity-0">
          <h1 className="font-bold text-4xl text-foreground">ethui Stacks</h1>
          <p className="text-lg text-muted-foreground">
            On-demand Anvil nodes in the cloud. Spin up isolated Ethereum
            environments for development and testing.
          </p>
        </div>

        {/* Features */}
        <div className="animation-delay-500 animate-fade-in grid grid-cols-2 gap-4 opacity-0">
          <FeatureCard
            icon={<Zap className="h-5 w-5 text-primary" />}
            title="Instant Deploy"
            description="Spin up nodes in seconds"
          />
          <FeatureCard
            icon={<GitFork className="h-5 w-5 text-primary" />}
            title="Fork Networks"
            description="Fork mainnet or any chain"
          />
          <FeatureCard
            icon={<Globe className="h-5 w-5 text-primary" />}
            title="Subgraph Ready"
            description="Built-in Graph indexing"
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5 text-primary" />}
            title="Explorer"
            description="Integrated block explorer"
          />
        </div>

        <div className="animation-delay-600 animate-fade-in opacity-0">
          <Form form={form} onSubmit={handleSubmit} className="space-y-4">
            <Form.Text
              name="accessKey"
              placeholder="Enter your access key"
              className="w-full text-center"
            />
            <Button type="submit" className="w-full" size="lg">
              Connect to Stacks
            </Button>
          </Form>
        </div>

        <div className="animation-delay-800 animate-fade-in text-center opacity-0">
          <p className="text-muted-foreground text-sm">
            Don't have an access key?{" "}
            <a
              href="https://ethui.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Request access
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
      <div className="mt-0.5">{icon}</div>
      <div>
        <h3 className="font-medium text-foreground text-sm">{title}</h3>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
  );
}
