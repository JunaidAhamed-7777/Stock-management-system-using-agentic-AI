# API Endpoints

All endpoints are prefixed with `/api`.

---
## Authentication
- **POST** `/api/auth/register`
  - Create a new user. Body: `{ name, email, password, role? }`. Only `CUSTOMER`, `SUPPLIER`, or `ADMIN` allowed.
- **POST** `/api/auth/login`
  - Login and receive a JWT. Body: `{ email, password }`.
- **GET** `/api/auth/me`
  - Return authenticated user details. Requires `Authorization: Bearer <JWT>`.

---
## Users
- **GET** `/api/users/me`
  - Return authenticated user profile.
- **PATCH** `/api/users/me`
  - Update own `name` or `email`. Requires authentication.

---
## Products
- **GET** `/api/products`
  - List products. Supports query params: `search`, `category`, `supplier`, `lowStock` (boolean), `lowStockThreshold`.
- **GET** `/api/products/:id`
  - Retrieve product details.
- **POST** `/api/products`
  - Create a new product. Requires `ADMIN` or `SUPPLIER`. Body includes `name`, `description?`, `sku`, `price`, `quantity`, `lowStockThreshold`, `categoryId`, `supplierId` (if `ADMIN` provides; `SUPPLIER` auto‑sets). 
- **PUT** `/api/products/:id`
  - Update a product. Requires `ADMIN` or owning `SUPPLIER`.
- **DELETE** `/api/products/:id`
  - Delete a product. Only `ADMIN`.

---
## Orders
- **GET** `/api/orders`
  - For `CUSTOMER`: list own orders. For `ADMIN`: all orders.
- **GET** `/api/orders/:id`
  - Retrieve order details. Ownership checks based on role.
- **POST** `/api/orders`
  - Create an order. Body: `{ items: [{ productId, quantity }, …] }`. Validates stock, calculates totals, creates order, order items, and reduces stock.
- **PATCH** `/api/orders/:id/status`
  - Update order status. Requires `ADMIN` or `SUPPLIER` that owns any product in the order.

---
## Stock
- **GET** `/api/stock/low-stock`
  - List products where `quantity ≤ lowStockThreshold`. For suppliers, only their products.
- **GET** `/api/stock/transactions`
  - (Not yet implemented – returns 501). Intended to list stock transactions.
- **PATCH** `/api/stock/adjust`
  - Adjust stock. Payload: `{ productId, quantityChange, reason? }`. Only `ADMIN` or owning `SUPPLIER`.

---
## Discovery
- **GET** `/api/discovery/categories`
  - List all categories.
- **GET** `/api/discovery/suppliers`
  - List all suppliers (excluding sensitive user data).
- **GET** `/api/discovery/suppliers/:id`
  - Retrieve supplier details.

---
## Dashboard
- **GET** `/api/dashboard`
  - Role‑based metrics:
    - `ADMIN`: overall product, stock, orders, low‑stock, user counts.
    - `SUPPLIER`: own product count, stock, low‑stock, relevant orders.
    - `CUSTOMER`: order counts, spending, pending/delivered totals.

---
## AI/Agentic
- **GET** `/api/ai/forecast`
- **GET** `/api/ai/stockout`
- **GET** `/api/ai/recommendations`
  - All return `501 Not Implemented` with a JSON message.

---
## Health
- **GET** `/api/health`
  - Returns `{ success: true, message: "Stock Management API is running" }`.

---
# Notes
- All authenticated routes require a valid JWT (`Authorization: Bearer <token>`).
- Role based access: *ADMIN* has full access, *SUPPLIER* is limited to its own products/orders, *CUSTOMER* to its own orders/profile.
- Input validation is performed server‑side; invalid data triggers `400/422` responses.
- Stock transactions are recorded during order creation and manual adjustments.
