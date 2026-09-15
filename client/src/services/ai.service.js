import { api, unwrap } from "./api";

export async function getForecast() {
  const response = await api.get("/ai/forecast");
  return unwrap(response);
}

export async function getStockout() {
  const response = await api.get("/ai/stockout");
  return unwrap(response);
}

export async function getRecommendations() {
  const response = await api.get("/ai/recommendations");
  return unwrap(response);
}
