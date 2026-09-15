import axios from "axios";
import { TOKEN_KEY, readStorage, removeStorage, USER_KEY } from "../utils/storage";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api").replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = readStorage(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = String(error.config?.url || "");
      const isAuthAttempt = url.includes("/auth/login") || url.includes("/auth/register");
      if (!isAuthAttempt) {
        removeStorage(TOKEN_KEY);
        removeStorage(USER_KEY);
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);

export function unwrap(response) {
  return response.data?.data ?? response.data;
}
