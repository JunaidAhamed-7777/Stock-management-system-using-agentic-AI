import { api, unwrap } from "./api";

export async function listProducts(params = {}) {
  const response = await api.get("/products", { params });
  return unwrap(response);
}

export async function getProduct(id) {
  const response = await api.get(`/products/${id}`);
  return unwrap(response);
}

export async function createProduct(payload) {
  const response = await api.post("/products", payload);
  return unwrap(response);
}

export async function updateProduct(id, payload) {
  const response = await api.put(`/products/${id}`, payload);
  return unwrap(response);
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
