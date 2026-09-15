import { api, unwrap } from "./api";

export async function getLowStock() {
  const response = await api.get("/stock/low-stock");
  return unwrap(response);
}

export async function adjustStock(payload) {
  const response = await api.patch("/stock/adjust", payload);
  return unwrap(response);
}

export async function getStockTransactions() {
  const response = await api.get("/stock/transactions");
  return unwrap(response);
}
