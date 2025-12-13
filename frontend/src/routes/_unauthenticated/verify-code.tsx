import { Form } from "@ethui/ui/components/form";
import { Button } from "@ethui/ui/components/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EthuiLogoButton } from "~/components/EthuiLogoButton";
import { VerificationCodeInput } from "~/components/VerificationCodeInput";
import { useVerifyCode } from "~/hooks/useAuth";

export const Route = createFileRoute("/_unauthenticated/verify-code")({
  validateSearch: z.object({
    email: z.string().email(),
  }),
  component: RouteComponent,
});

const verifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

type VerifyFormData = z.infer<typeof verifySchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const { email } = Route.useSearch();
  const { mutateAsync: verifyCode, isPending: isVerifying } = useVerifyCode();

  const form = useForm<VerifyFormData>({
    mode: "onBlur",
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = async (data: VerifyFormData) => {
    await verifyCode({ email, code: data.code });
    navigate({ to: "/dashboard" });
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  const code = form.watch("code");

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent p-8">
      <div className="w-full max-w-lg animate-fade-in space-y-8 opacity-0 justify-center flex flex-col">
        <EthuiLogoButton />

        <div className="animate-fade-in space-y-3 text-center opacity-0">
          <h1 className="font-bold text-4xl text-foreground">Verify Code</h1>
          <p className="text-lg text-muted-foreground">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        <Form
          form={form}
          onSubmit={handleSubmit}
          className="space-y-6 items-center flex flex-1 flex-col"
        >
          <VerificationCodeInput name="code" disabled={isVerifying} />
          <div className="space-y-3 items-center flex flex-col">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isVerifying || code.length !== 6}
            >
              Verify Code
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
