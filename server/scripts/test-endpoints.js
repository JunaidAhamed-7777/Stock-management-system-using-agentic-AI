"use strict";

const BASE = process.env.API_BASE || "http://localhost:3001/api";

const results = [];

function record(name, method, path, status, ok, detail = "") {
  results.push({ name, method, path, status, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`[${mark}] ${method} ${path} -> ${status}${detail ? ` (${detail})` : ""}`);
}

async function request(method, path, { token, body, expectStatus } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  const expected = Array.isArray(expectStatus) ? expectStatus : [expectStatus ?? 200];
  const ok = expected.includes(response.status);
  return { response, data, ok, status: response.status };
}

async function login(email, password) {
  const { data, ok, status } = await request("POST", "/auth/login", {
    body: { email, password },
    expectStatus: 200,
  });
  if (!ok) throw new Error(`Login failed for ${email}: ${status}`);
  return data.data.token;
}

async function main() {
  const creds = {
    admin: { email: "admin.test@stockflow.local", password: "AdminTest2026!" },
    supplier: { email: "supplier.test@stockflow.local", password: "SupplierTest2026!" },
    customer: { email: "customer.test@stockflow.local", password: "CustomerTest2026!" },
  };

  let adminToken;
  let supplierToken;
  let customerToken;
  let productId;
  let supplierId;
  let categoryId;
  let orderId;
  let createdProductId;

  // Health
  {
    const { ok, status, data } = await request("GET", "/health");
    record("Health", "GET", "/health", status, ok && data?.success === true);
  }

  // Auth register duplicate
  {
    const { ok, status } = await request("POST", "/auth/register", {
      body: { name: "Dup", email: creds.customer.email, password: "x" },
      expectStatus: 409,
    });
    record("Auth register duplicate", "POST", "/auth/register", status, ok);
  }

  // Auth login all roles
  for (const [role, cred] of Object.entries(creds)) {
    const { ok, status, data } = await request("POST", "/auth/login", {
      body: cred,
      expectStatus: 200,
    });
    const token = data?.data?.token;
    if (role === "admin") adminToken = token;
    if (role === "supplier") supplierToken = token;
    if (role === "customer") customerToken = token;
    record(`Auth login ${role}`, "POST", "/auth/login", status, ok && !!token);
  }

  // Auth me
  {
    const { ok, status } = await request("GET", "/auth/me", { token: customerToken, expectStatus: 200 });
    record("Auth me", "GET", "/auth/me", status, ok);
  }

  // Auth me unauthorized
  {
    const { ok, status } = await request("GET", "/auth/me", { expectStatus: 401 });
    record("Auth me unauthorized", "GET", "/auth/me", status, ok);
  }

  // Auth register new user
  {
    const email = `newcustomer.${Date.now()}@stockflow.local`;
    const { ok, status } = await request("POST", "/auth/register", {
      body: { name: "New Customer", email, password: "NewCustomer2026!" },
      expectStatus: 201,
    });
    record("Auth register", "POST", "/auth/register", status, ok);
  }

  // Public products
  {
    const { ok, status, data } = await request("GET", "/products", { expectStatus: 200 });
    productId = data?.data?.[0]?.id;
    record("List products", "GET", "/products", status, ok && Array.isArray(data?.data) && data.data.length > 0);
  }

  {
    const { ok, status } = await request("GET", `/products/${productId}`, { expectStatus: 200 });
    record("Product details", "GET", `/products/${productId}`, status, ok);
  }

  // Discovery
  {
    const { ok, status, data } = await request("GET", "/discovery/categories", { expectStatus: 200 });
    categoryId = data?.data?.[0]?.id;
    record("Discovery categories", "GET", "/discovery/categories", status, ok && data.data.length > 0);
  }

  {
    const { ok, status } = await request("GET", `/products?search=Mouse&category=${categoryId}&lowStock=true`, {
      expectStatus: 200,
    });
    record("List products with filters", "GET", "/products?filters", status, ok);
  }

  {
    const { ok, status, data } = await request("GET", "/discovery/suppliers", { expectStatus: 200 });
    supplierId = data?.data?.[0]?.id;
    const leakedPassword = JSON.stringify(data).includes("password");
    record("Discovery suppliers", "GET", "/discovery/suppliers", status, ok && !leakedPassword, leakedPassword ? "password leaked" : "");
  }

  {
    const { ok, status } = await request("GET", `/discovery/suppliers/${supplierId}`, { expectStatus: 200 });
    record("Discovery supplier detail", "GET", `/discovery/suppliers/${supplierId}`, status, ok);
  }

  // Users profile
  {
    const { ok, status } = await request("GET", "/users/me", { token: customerToken, expectStatus: 200 });
    record("Users get profile", "GET", "/users/me", status, ok);
  }

  {
    const { ok, status } = await request("PATCH", "/users/me", {
      token: customerToken,
      body: { name: "StockFlow Customer" },
      expectStatus: 200,
    });
    record("Users update profile", "PATCH", "/users/me", status, ok);
  }

  // Supplier creates product
  {
    const { ok, status, data } = await request("POST", "/products", {
      token: supplierToken,
      body: {
        name: "API Test Product",
        description: "Created during endpoint test",
        sku: `TEST-${Date.now()}`,
        price: 15.99,
        quantity: 20,
        lowStockThreshold: 5,
        categoryId,
      },
      expectStatus: 201,
    });
    createdProductId = data?.data?.id;
    record("Supplier create product", "POST", "/products", status, ok && !!createdProductId);
  }

  // Customer cannot create product
  {
    const { ok, status } = await request("POST", "/products", {
      token: customerToken,
      body: { name: "Nope", sku: "NOPE-1", price: 1, quantity: 1, lowStockThreshold: 1, categoryId },
      expectStatus: 403,
    });
    record("Customer create product forbidden", "POST", "/products", status, ok);
  }

  // Supplier update own product
  {
    const { ok, status } = await request("PUT", `/products/${createdProductId}`, {
      token: supplierToken,
      body: { quantity: 25 },
      expectStatus: 200,
    });
    record("Supplier update own product", "PUT", "/products/:id", status, ok);
  }

  // Admin update product
  {
    const { ok, status } = await request("PUT", `/products/${productId}`, {
      token: adminToken,
      body: { lowStockThreshold: 12 },
      expectStatus: 200,
    });
    record("Admin update product", "PUT", "/products/:id", status, ok);
  }

  // Stock low
  {
    const { ok, status, data } = await request("GET", "/stock/low-stock", { token: supplierToken, expectStatus: 200 });
    record("Stock low-stock", "GET", "/stock/low-stock", status, ok && Array.isArray(data?.data));
  }

  // Stock transactions not implemented
  {
    const { ok, status } = await request("GET", "/stock/transactions", { token: adminToken, expectStatus: 501 });
    record("Stock transactions", "GET", "/stock/transactions", status, ok);
  }

  // Stock adjust
  {
    const { ok, status } = await request("PATCH", "/stock/adjust", {
      token: supplierToken,
      body: { productId: createdProductId, quantityChange: 5, reason: "Restock test" },
      expectStatus: 200,
    });
    record("Stock adjust", "PATCH", "/stock/adjust", status, ok);
  }

  // Customer creates order
  {
    const { ok, status, data } = await request("POST", "/orders", {
      token: customerToken,
      body: { items: [{ productId: createdProductId, quantity: 2 }] },
      expectStatus: 201,
    });
    orderId = data?.data?.id;
    record("Create order", "POST", "/orders", status, ok && !!orderId);
  }

  // Customer list orders
  {
    const { ok, status, data } = await request("GET", "/orders", { token: customerToken, expectStatus: 200 });
    record("Customer list orders", "GET", "/orders", status, ok && data.data.some((o) => o.id === orderId));
  }

  // Admin list orders
  {
    const { ok, status } = await request("GET", "/orders", { token: adminToken, expectStatus: 200 });
    record("Admin list orders", "GET", "/orders", status, ok);
  }

  // Supplier list orders
  {
    const { ok, status, data } = await request("GET", "/orders", { token: supplierToken, expectStatus: 200 });
    record("Supplier list orders", "GET", "/orders", status, ok && data.data.some((o) => o.id === orderId));
  }

  // Order details
  {
    const { ok, status } = await request("GET", `/orders/${orderId}`, { token: customerToken, expectStatus: 200 });
    record("Order details customer", "GET", `/orders/${orderId}`, status, ok);
  }

  {
    const { ok, status } = await request("GET", `/orders/${orderId}`, { token: supplierToken, expectStatus: 200 });
    record("Order details supplier", "GET", `/orders/${orderId}`, status, ok);
  }

  // Update order status
  {
    const { ok, status, data } = await request("PATCH", `/orders/${orderId}/status`, {
      token: adminToken,
      body: { status: "DELIVERED" },
      expectStatus: 200,
    });
    record("Update order status", "PATCH", `/orders/${orderId}/status`, status, ok && data?.data?.status === "DELIVERED");
  }

  // Dashboards
  for (const [role, token] of [["admin", adminToken], ["supplier", supplierToken], ["customer", customerToken]]) {
    const { ok, status, data } = await request("GET", "/dashboard", { token, expectStatus: 200 });
    record(`Dashboard ${role}`, "GET", "/dashboard", status, ok && data?.metrics);
  }

  // AI endpoints
  for (const path of ["/ai/forecast", "/ai/stockout", "/ai/recommendations"]) {
    const { ok, status } = await request("GET", path, { token: adminToken, expectStatus: 501 });
    record(`AI ${path}`, "GET", path, status, ok);
  }

  // Admin delete product (use a product that is not referenced by orders)
  {
    const { data: createData, ok: createOk, status: createStatus } = await request("POST", "/products", {
      token: adminToken,
      body: {
        name: "Disposable Test Product",
        sku: `DISPOSE-${Date.now()}`,
        price: 9.99,
        quantity: 1,
        lowStockThreshold: 1,
        categoryId,
        supplierId,
      },
      expectStatus: 201,
    });
    const disposableId = createData?.data?.id;
    const { ok, status } = await request("DELETE", `/products/${disposableId}`, {
      token: adminToken,
      expectStatus: 200,
    });
    record("Admin delete product", "DELETE", "/products/:id", status, ok && createOk, createOk ? "" : `create status ${createStatus}`);
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log(`\nSummary: ${passed}/${results.length} passed`);
  if (failed.length) {
    console.log("Failures:");
    failed.forEach((f) => console.log(` - ${f.name}: ${f.status} ${f.detail}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Test run failed:", error.message);
  process.exit(1);
});
