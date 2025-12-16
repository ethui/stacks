import { z } from "zod";
import { api } from "./axios";

export const sendCodeSchema = z.object({
  email: z.string().email(),
});

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(1),
});

export const sendCodeResponseSchema = z.object({
  token: z.string(),
});

export const verifyCodeResponseSchema = z.object({
  token: z.string(),
});

export type SendCodeRequest = z.infer<typeof sendCodeSchema>;
export type VerifyCodeRequest = z.infer<typeof verifyCodeSchema>;
export type SendCodeResponse = z.infer<typeof sendCodeResponseSchema>;
export type VerifyCodeResponse = z.infer<typeof verifyCodeResponseSchema>;

export const auth = {
  sendCode: (data: SendCodeRequest) => api.post("/auth/send-code", data),
  verifyCode: (data: VerifyCodeRequest): Promise<VerifyCodeResponse> =>
    api.post("/auth/verify-code", data),
};
