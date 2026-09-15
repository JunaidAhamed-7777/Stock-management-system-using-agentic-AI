import { api, unwrap } from "./api";

export async function getProfile() {
  const response = await api.get("/users/me");
  return unwrap(response);
}

export async function updateProfile(payload) {
  const response = await api.patch("/users/me", payload);
  return unwrap(response);
}
