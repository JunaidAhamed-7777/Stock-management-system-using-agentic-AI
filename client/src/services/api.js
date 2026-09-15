import axios from "axios";
import { TOKEN_KEY, readStorage, removeStorage, USER_KEY } from "../utils/storage";

function normalizeApiBase(value) {
  return String(value || "http://localhost:3001/api")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api\/api$/i, "/api");
}

const API_BASE_URL = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);

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

function isAuthHandshake(url) {
  const path = String(url || "");
  return path.includes("/auth/login") || path.includes("/auth/register") || path.includes("/auth/me");
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!isAuthHandshake(error.config?.url)) {
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

export async function getHealth() {
  const response = await api.get("/health");
  return response.data;
}
