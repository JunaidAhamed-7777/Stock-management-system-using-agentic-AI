import { api, unwrap } from "./api";
import { asArray, toId } from "../utils/apiData";

export async function getLowStock() {
  const response = await api.get("/stock/low-stock");
  return asArray(unwrap(response));
}

export async function adjustStock(payload) {
  const response = await api.patch("/stock/adjust", {
    productId: toId(payload.productId),
    quantityChange: Number(payload.quantityChange),
    reason: payload.reason || undefined,
  });
  return unwrap(response);
}

export async function getStockTransactions() {
  const response = await api.get("/stock/transactions");
  return asArray(unwrap(response));
}
