import { api, unwrap } from "./api";
import { asArray, toId } from "../utils/apiData";

export async function getCategories() {
  const response = await api.get("/discovery/categories");
  return asArray(unwrap(response));
}

export async function getSuppliers() {
  const response = await api.get("/discovery/suppliers");
  return asArray(unwrap(response));
}

export async function getSupplier(id) {
  const response = await api.get(`/discovery/suppliers/${toId(id)}`);
  return unwrap(response);
}
