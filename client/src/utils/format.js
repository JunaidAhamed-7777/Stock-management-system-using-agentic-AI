export function formatCurrency(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatNumber(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "0";
  return new Intl.NumberFormat("en-US").format(amount);
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateShort(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function stockStatus(product) {
  const quantity = Number(product?.quantity) || 0;
  const threshold = Number(product?.lowStockThreshold) || 0;
  if (quantity <= 0) return "OUT";
  if (quantity <= threshold) return "LOW";
  return "IN";
}

export function enrichProducts(products = [], categories = [], suppliers = []) {
  const categoryMap = new Map(categories.map((item) => [item.id, item]));
  const supplierMap = new Map(suppliers.map((item) => [item.id, item]));
  return products.map((product) => ({
    ...product,
    category: product.category || categoryMap.get(product.categoryId) || null,
    supplier: product.supplier || supplierMap.get(product.supplierId) || null,
  }));
}

export function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "SF";
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}
