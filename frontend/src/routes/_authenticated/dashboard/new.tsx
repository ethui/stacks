import { Form } from "@ethui/ui/components/form";
import { Button } from "@ethui/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ethui/ui/components/shadcn/card";
import { Label } from "@ethui/ui/components/shadcn/label";
import { Separator } from "@ethui/ui/components/shadcn/separator";
import { Switch } from "@ethui/ui/components/shadcn/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Database, GitFork, Layers, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { createStackInputSchema, stacks } from "~/api/stacks";
import { BackButton } from "~/components/BackButton";

export const Route = createFileRoute("/_authenticated/dashboard/new")({
  component: NewStackPage,
});

const stackFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Stack name is required")
    .regex(
      /^[a-z][a-z0-9-]*$/,
      "Must start with a letter and contain only lowercase letters, numbers, and hyphens",
    ),
  forkUrl: z.string().optional(),
  forkBlockNumber: z.number().optional(),
});

type StackFormData = z.infer<typeof stackFormSchema>;

const PRESET_NETWORKS = [
  { name: "Ethereum", url: "https://eth.llamarpc.com", chainId: 1 },
  { name: "Arbitrum One", url: "https://arb1.arbitrum.io/rpc", chainId: 42161 },
  { name: "OP Mainnet", url: "https://mainnet.optimism.io", chainId: 10 },
  { name: "Base", url: "https://mainnet.base.org", chainId: 8453 },
  { name: "Polygon", url: "https://polygon-rpc.com", chainId: 137 },
] as const;

function NewStackPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [enableFork, setEnableFork] = useState(false);
  const [enableGraph, setEnableGraph] = useState(false);

  const form = useForm<StackFormData>({
    mode: "onChange",
    resolver: zodResolver(stackFormSchema),
    defaultValues: {
      slug: "",
      forkUrl: "",
      forkBlockNumber: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: stacks.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
      toast.success("Stack created successfully");
      navigate({ to: "/dashboard" });
    },
    onError: () => {
      toast.error("Failed to create stack");
    },
  });

  const currentForkUrl = form.watch("forkUrl");

  const handleSubmit = (data: StackFormData) => {
    const input = createStackInputSchema.parse({
      slug: data.slug,
      anvil_opts: enableFork
        ? {
            fork_url: data.forkUrl,
            fork_block_number: data.forkBlockNumber,
          }
        : undefined,
      graph_opts: enableGraph ? { enabled: true } : undefined,
    });

    createMutation.mutate(input);
  };

  return (
    <div className="flex items-start justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <BackButton label="Back to Dashboard" />

        <Card className="animation-delay-100 animate-fade-in-up rounded-xl shadow-lg opacity-0">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Layers className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Stack</CardTitle>
            <CardDescription>
              Spin up a new on-demand Anvil node
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Form form={form} onSubmit={handleSubmit} className="space-y-6">
              <div className="w-full space-y-3">
                <Form.Text
                  name="slug"
                  label="Stack Name"
                  placeholder="my-dev-stack"
                />
                <p className="text-muted-foreground text-xs">
                  Your RPC URL: https://
                  <span className="font-medium text-foreground">
                    {form.watch("slug") || "my-stack"}
                  </span>
                  .stacks.ethui.dev
                </p>
              </div>

              <Separator />

              <ToggleSection
                icon={GitFork}
                title="Fork Network"
                description="Start from an existing network state"
                enabled={enableFork}
                onToggle={setEnableFork}
              >
                <div className="ml-12 space-y-4 rounded-lg border border-border bg-muted/50 p-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Quick Select
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_NETWORKS.map((network) => (
                        <button
                          key={network.url}
                          type="button"
                          onClick={() => form.setValue("forkUrl", network.url)}
                          className={`rounded-full cursor-pointer border px-3 py-1.5 text-xs font-medium transition-colors ${
                            currentForkUrl === network.url
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          {network.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Form.Text
                    name="forkUrl"
                    label="Fork RPC URL"
                    placeholder="https://eth.llamarpc.com"
                    className="w-full"
                  />

                  <Form.NumberField
                    name="forkBlockNumber"
                    label="Fork Block Number"
                    placeholder="Latest block if empty"
                    className="w-full"
                  />
                </div>
              </ToggleSection>

              <Separator />

              <ToggleSection
                icon={Database}
                title="Subgraph Indexing"
                description="Enable The Graph protocol"
                enabled={enableGraph}
                onToggle={setEnableGraph}
              >
                <div className="ml-12 rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-muted-foreground text-sm">
                    A Graph node will be provisioned alongside your Anvil
                    instance for deploying and querying subgraphs.
                  </p>
                </div>
              </ToggleSection>

              <Separator />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Form.Submit className="flex-1" label="Create Stack">
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Stack
                </Form.Submit>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ToggleSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children?: React.ReactNode;
}

function ToggleSection({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  children,
}: ToggleSectionProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <Label className="font-medium text-sm">{title}</Label>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && children}
    </div>
  );
}
