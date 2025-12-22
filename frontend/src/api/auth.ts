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
  sendCode: async (data: SendCodeRequest) => {
    try {
      const res = await api.post("/auth/send-code", data);
      return res.data;
    } catch (error) {
      console.error("Failed to send code:", error);
      throw error;
    }
  },
  verifyCode: async (data: VerifyCodeRequest) => {
    try {
      const res = await api.post("/auth/verify-code", data);
      return res.data;
    } catch (error) {
      console.error("Failed to verify code:", error);
      throw error;
    }
  },
};
