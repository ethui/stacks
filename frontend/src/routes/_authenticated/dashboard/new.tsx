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
import { ArrowLeft, Database, GitFork, Layers, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createStack } from "~/api/stacks";
import type { CreateStackInput } from "~/types/stack";

export const Route = createFileRoute("/_authenticated/dashboard/new")({
  component: NewStackPage,
});

const PRESET_NETWORKS = [
  { name: "Ethereum Mainnet", url: "https://eth.llamarpc.com", chainId: 1 },
  { name: "Arbitrum One", url: "https://arb1.arbitrum.io/rpc", chainId: 42161 },
  { name: "Optimism", url: "https://mainnet.optimism.io", chainId: 10 },
  { name: "Base", url: "https://mainnet.base.org", chainId: 8453 },
  { name: "Polygon", url: "https://polygon-rpc.com", chainId: 137 },
];

const createStackSchema = z.object({
  slug: z
    .string()
    .min(1, "Stack name is required")
    .regex(
      /^[a-z][a-z0-9-]*$/,
      "Must start with a letter and contain only lowercase letters, numbers, and hyphens",
    ),
  forkUrl: z.string().optional(),
  forkBlockNumber: z.string().optional(),
});

type CreateStackFormData = z.infer<typeof createStackSchema>;

function NewStackPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [enableFork, setEnableFork] = useState(false);
  const [enableGraph, setEnableGraph] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const form = useForm<CreateStackFormData>({
    mode: "onBlur",
    resolver: zodResolver(createStackSchema),
    defaultValues: {
      slug: "",
      forkUrl: "",
      forkBlockNumber: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateStackInput) => createStack(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stacks"] });
      navigate({ to: "/dashboard" });
    },
  });

  const handlePresetSelect = (url: string) => {
    if (selectedPreset === url) {
      setSelectedPreset(null);
      form.setValue("forkUrl", "");
    } else {
      setSelectedPreset(url);
      form.setValue("forkUrl", url);
    }
  };

  const handleSubmit = (data: CreateStackFormData) => {
    const input: CreateStackInput = {
      slug: data.slug,
      anvilOpts: enableFork
        ? {
            forkUrl: data.forkUrl || undefined,
            forkBlockNumber: data.forkBlockNumber
              ? Number.parseInt(data.forkBlockNumber)
              : undefined,
          }
        : undefined,
      graphOpts: enableGraph ? { enabled: true } : undefined,
    };

    createMutation.mutate(input);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-start justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-6 animate-fade-in opacity-0">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/dashboard" })}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Single Card Form */}
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
              {/* Stack Name */}
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

              {/* Fork Network Toggle */}
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <GitFork className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Label className="font-medium text-sm">
                        Fork Network
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Start from an existing network state
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={enableFork}
                    onCheckedChange={setEnableFork}
                  />
                </div>

                {enableFork && (
                  <div className="ml-12 space-y-4 rounded-lg border border-border bg-muted/50 p-4">
                    {/* Preset Networks */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Quick Select
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_NETWORKS.map((network) => (
                          <button
                            key={network.url}
                            type="button"
                            onClick={() => handlePresetSelect(network.url)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              selectedPreset === network.url
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

                    <Form.Text
                      name="forkBlockNumber"
                      label="Fork Block Number"
                      placeholder="Latest block if empty"
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Subgraph Toggle */}
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Label className="font-medium text-sm">
                        Subgraph Indexing
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Enable The Graph protocol
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={enableGraph}
                    onCheckedChange={setEnableGraph}
                  />
                </div>

                {enableGraph && (
                  <div className="ml-12 rounded-lg border border-border bg-muted/50 p-4">
                    <p className="text-muted-foreground text-sm">
                      A Graph node will be provisioned alongside your Anvil
                      instance for deploying and querying subgraphs.
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Stack
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
