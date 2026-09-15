import { api, unwrap } from "./api";

export async function getCategories() {
  const response = await api.get("/discovery/categories");
  return unwrap(response);
}

export async function getSuppliers() {
  const response = await api.get("/discovery/suppliers");
  return unwrap(response);
}

export async function getSupplier(id) {
  const response = await api.get(`/discovery/suppliers/${id}`);
  return unwrap(response);
}
