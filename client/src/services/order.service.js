import { api, unwrap } from "./api";

export async function listOrders() {
  const response = await api.get("/orders");
  return unwrap(response);
}

export async function getOrder(id) {
  const response = await api.get(`/orders/${id}`);
  return unwrap(response);
}

export async function createOrder(items) {
  const response = await api.post("/orders", { items });
  return unwrap(response);
}

export async function updateOrderStatus(id, status) {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return unwrap(response);
}
