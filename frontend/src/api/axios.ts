import axios from "axios";
import { useAuthStore } from "~/store/auth";

export const api = axios.create({
  baseURL: "https://api.stacks.ethui.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const jwt = useAuthStore.getState().jwt;
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
