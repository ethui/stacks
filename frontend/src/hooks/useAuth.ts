import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { type SendCodeRequest, type VerifyCodeRequest, auth } from "~/api/auth";
import { useAuthStore } from "~/store/auth";

export function useSendCode() {
  return useMutation({
    mutationFn: (data: SendCodeRequest) => auth.sendCode(data),
    onSuccess: () => {
      toast.success("Code sent to email");
    },
    onError: () => {
      toast.error("Failed to send code");
    },
  });
}

export function useVerifyCode() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: VerifyCodeRequest) => auth.verifyCode(data),
    onSuccess: (data) => {
      login(data.token);
      toast.success("Code verified");
    },
    onError: () => {
      toast.error("Failed to verify code");
    },
  });
}

export function useGetUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => auth.me(),
  });
}
