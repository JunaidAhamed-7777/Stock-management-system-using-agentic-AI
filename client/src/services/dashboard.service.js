import { api } from "./api";

export async function getDashboard() {
  const response = await api.get("/dashboard");
  return {
    role: response.data?.role,
    metrics: response.data?.metrics || {},
  };
}
