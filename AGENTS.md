# Stock Management System using Agentic AI

## Project Goal

Build a production-quality stock and inventory management web application called StockFlow.

The application has three roles:

- CUSTOMER
- SUPPLIER
- ADMIN

The frontend is implemented using React, Vite and TypeScript.

The backend is implemented using Node.js, Express, Prisma and PostgreSQL.

---

## Repository Structure

client/
    Production React frontend

server/
    Existing backend API

stitch_stockflow_enterprise_inventory_saas/
    Stitch-generated visual references.
    These files are design references and must not be treated as the production frontend.

DESIGN.md
    Main frontend design system.

---

## Critical Rule

During frontend implementation, DO NOT modify server/ unless explicitly instructed.

The existing backend API is the source of truth.

Do not:
- modify Prisma schema
- modify database structure
- create arbitrary new backend endpoints
- change authentication behavior
- rewrite backend routes

If a frontend feature cannot currently be implemented because the backend does not support it, report the limitation instead of changing the backend.

---

## Frontend Architecture

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

Use reusable components.

Do not duplicate components unnecessarily.

Use centralized API services.

Do not make raw Axios requests directly inside page components.

Use centralized authentication state.

Use protected routes.

Use role-based routes.

---

## Roles

CUSTOMER:
- Product catalog
- Product details
- Cart
- Orders
- Profile

SUPPLIER:
- Dashboard
- Products
- Product creation/editing
- Orders
- Stock
- Profile

ADMIN:
- Dashboard
- Products
- Suppliers
- Customers
- Orders
- Inventory
- Stock transactions
- AI dashboard
- Profile

---

## Design

DESIGN.md is the primary design-system reference.

The Stitch-generated screens inside:

stitch_stockflow_enterprise_inventory_saas/

are visual references.

The production React application must reproduce the visual language of these designs while using reusable React components.

Do not blindly copy Stitch HTML.

---

## AI

AI functionality is not implemented yet.

The AI dashboard should exist as a UI.

Do not fabricate AI responses.

Do not display fake predictions or fake recommendations.

Future AI functionality will be connected through n8n.

---

## Quality

After significant changes:

- run TypeScript checks
- run the frontend build
- fix errors
- check browser console errors
- check routing
- check responsive behavior
- check loading states
- check empty states
- check error states

Do not leave known TypeScript or build errors unresolved.