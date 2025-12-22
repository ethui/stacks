import { Form } from "@ethui/ui/components/form";
import { Button } from "@ethui/ui/components/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GitFork, Globe, Layers, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EthuiLogoButton } from "~/components/EthuiLogoButton";
import { useSendCode } from "~/hooks/useAuth";

export const Route = createFileRoute("/_unauthenticated/")({
  component: RouteComponent,
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Deploy",
    description: "Spin up nodes in seconds",
  },
  {
    icon: GitFork,
    title: "Fork Networks",
    description: "Fork mainnet or any chain",
  },
  {
    icon: Globe,
    title: "Subgraph Ready",
    description: "Built-in Graph indexing",
  },
  {
    icon: Layers,
    title: "Explorer",
    description: "Integrated block explorer",
  },
];

function RouteComponent() {
  const navigate = useNavigate();
  const { mutateAsync: sendCode, isPending: isSendingCode } = useSendCode();
  const form = useForm<LoginFormData>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    await sendCode(data);
    navigate({ to: "/verify-code", search: { email: data.email } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent p-8">
      <div className="w-full max-w-lg animate-fade-in space-y-8 opacity-0">
        <EthuiLogoButton />

        <div className="animate-fade-in space-y-3 text-center opacity-0">
          <h1 className="font-bold text-4xl text-foreground">ethui Stacks</h1>
          <p className="text-lg text-muted-foreground">
            On-demand Anvil nodes in the cloud. Spin up isolated Ethereum
            environments for development and testing.
          </p>
        </div>

        <div className="animate-fade-in grid grid-cols-2 gap-4 opacity-0">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={<feature.icon className="h-5 w-5 text-primary" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="animate-fade-in opacity-0">
          <Form form={form} onSubmit={handleSubmit} className="space-y-4">
            <Form.Text
              name="email"
              placeholder="Enter your email"
              className="w-full text-center"
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSendingCode}
            >
              Send Code
            </Button>
          </Form>
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
