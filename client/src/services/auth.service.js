import { api, unwrap } from "./api";

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  return unwrap(response);
}

export async function register(payload) {
  const response = await api.post("/auth/register", payload);
  return unwrap(response);
}

export async function getMe() {
  const response = await api.get("/auth/me");
  return unwrap(response);
}
