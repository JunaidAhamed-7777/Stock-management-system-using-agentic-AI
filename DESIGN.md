web application/stitch/projects/12804117146067154911/screens/9a71a5da7ede4487875dcde84369331b
# StockFlow Enterprise — Comprehensive Design System Specification (`design.md`)

## 1. Overview & Brand Identity

**Product Name:** StockFlow Enterprise  
**Archetype:** B2B Mission-Critical SaaS / Logistics, Inventory & Stock Orchestration Engine  
**Aesthetic:** Functionalist, ultra-clean, high-density, zero-fluff data architecture. Built for operations admins, plant procurement officers, and Tier-1 hardware suppliers.  
**Target Viewport:** Desktop (1440px+ optimized layout, collapsible sidebar, fluid responsive grid).  
**Core Principles:**
- **Scannability First:** Tabular numerals, monospaced SKUs/coordinates, strict semantic badge styling, and 40–44px row heights.
- **Single Accent Discipline:** Controlled Royal Navy / Electric Cobalt (`#2563EB`) reserved strictly for primary actions, active navigational states, and focus indicators.
- **Subtle Elevation:** Rely on 1px crisp hairline borders (`#E2E8F0`) and ambient micro-shadows rather than heavy cards, gradients, or blur effects.
- **Tri-Role Cohesion & Seamless Transition:** Unified visual grammar across Admin, Supplier, and Customer portals with role-switcher context and synchronized cross-portal data telemetry.

---

## 2. Portal Taxonomy & Information Architecture

### 2.1 Admin Portal (Global Operations & Governance)
- **Executive Command Center:** Global inventory valuation, DC capacity saturation, high-priority exception triage, and master SKU table.
- **Stock Transactions & Audit Ledger:** Cryptographic audit trail of stock movements, receipts, dispatches, cycle count adjustments, and Merkle root consensus.
- **Inventory & Multi-DC Allocations:** Real-time cross-facility stock allocation, safety floors, burn velocity, and automated rebalancing recommendations.
- **AI Forecasting & Stockout Hub:** Autonomous depletion predictions, 30-day Bayesian projection curves, and ARE replenishment guardrails.
- **Profile & RBAC Management:** User credentials, YubiKey hardware 2FA, granular permission matrix, and active session telemetry.

### 2.2 Supplier Portal (Precision Components Global)
- **Supplier Operations Dashboard:** Open PO fulfillment, on-time delivery (OTIF), ASN pipeline, and dock appointment scheduling.
- **Supplied Products Catalog:** Manufacturer part numbers, volume tier pricing, stock buffers, and RoHS/AEC-Q100 compliance badges.
- **Add & Edit Product Specification:** Tabbed enterprise form for hardware specifications, lead times, tiered pricing matrix, and X12 EDI 832 validation.
- **Purchase Orders & ASN Fulfillment:** Incoming order processing, dock arrival SLAs, freight BOL generation, and AS2 telemetry.
- **Inbound Stock Management:** Multi-DC buffer health, regional burn rates, and automated EDI 855 replenishment triggers.

### 2.3 Customer Portal (Apex Manufacturing Corp)
- **Customer Procurement Dashboard:** Net-30 available credit line ($184.5k/$250k), active wholesale orders, 30-day spend, and live carrier GPS tracking.
- **Contracted Product Catalog:** Search and multi-filter toolbar, category presets, contracted vs. MSRP pricing, and bulk selection drawer.
- **Product Details & Volume Tiers:** Engineering pinout diagrams, B2B price break matrix, warehouse availability, and BOM complementary pairing.
- **Wholesale Cart & Dispatch Checkout:** Single-node freight consolidation calculator, pallet counts, job site delivery routing, and Net-30 PO approval.
- **Customer Orders & Dispatch Tracking:** Filterable shipment table, freight tracking, waypoint route map, and trailer temperature telemetry.

### 2.4 Authentication & Identity Suite
- **Enterprise Split-Screen Login:** Side-by-side layout with high-impact brand/metrics hero, Okta/SAML SSO, role quick-switch, and FIDO2 MFA.
- **Organization & DC Registration:** 4-step onboarding wizard for corporate entity registration, warehouse node setup, and EDI protocol config.
- **User Profile & RBAC Security:** Superuser profile, granular permission matrix, hardware security key management, and cross-terminal session control.

---

## 3. Color Palette & Token System

### 3.1 Neutral Surfaces & Backgrounds
| Token Name | Hex Value | Tailwind Class / Usage |
| :--- | :--- | :--- |
| `surface-canvas` | `#F8FAFC` | `bg-slate-50` — Global dashboard background |
| `surface-card` | `#FFFFFF` | `bg-white` — Data containers, modal backdrops, table bodies |
| `surface-subtle` | `#F1F5F9` | `bg-slate-100` — Table headers, disabled states, stat card wells |
| `surface-hover` | `#F8FAFC` | `hover:bg-slate-50` — Table row hover, menu item hover |
| `surface-active` | `#E2E8F0` | `bg-slate-200` — Active segmented button background |

### 3.2 Neutral Borders & Dividers
| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `border-default` | `#E2E8F0` | `border-slate-200` — Standard card borders, table dividers |
| `border-subtle` | `#F1F5F9` | `border-slate-100` — Subtle inner dividers |
| `border-strong` | `#CBD5E1` | `border-slate-300` — Input outlines, active dropdown triggers |

### 3.3 Typography & Text Content
| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `text-primary` | `#0F172A` | `text-slate-900` — Headings, key figures, table headers |
| `text-secondary` | `#475569` | `text-slate-600` — Data row values, descriptions, metadata |
| `text-muted` | `#64748B` | `text-slate-500` — Subtitles, helper text, breadcrumbs |
| `text-subtle` | `#94A3B8` | `text-slate-400` — Icon strokes, placeholder text, timestamps |

### 3.4 Primary Accent (Brand)
| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `primary-50` | `#EFF6FF` | Soft active background, selected table rows |
| `primary-100` | `#DBEAFE` | Soft badge background, focused input glow |
| `primary-500` | `#3B82F6` | Secondary accent, link underlines, progress indicators |
| `primary-600` | `#2563EB` | **Primary Brand Color** — Main CTA buttons, active tab indicators |
| `primary-700` | `#1D4ED8` | Primary button hover state |
| `primary-900` | `#1E3A8A` | High-contrast brand elements |

### 3.5 Semantic Status & Telemetry Tokens
| Status | Background (`bg-*`) | Border (`border-*`) | Text (`text-*`) | Meaning / Application |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `#ECFDF5` (`emerald-50`) | `#A7F3D0` (`emerald-200`) | `#065F46` (`emerald-800`) | In Stock (>80%), Fulfilled, Delivered, AS2 Connected |
| **Warning** | `#FFFBEB` (`amber-50`) | `#FDE68A` (`amber-200`) | `#92400E` (`amber-800`) | Low Stock Warning, Pending Approval, In Production |
| **Danger** | `#FEF2F2` (`red-50`) | `#FECACA` (`red-200`) | `#991B1B` (`red-800`) | Out of Stock / Stockout, High Density (>85%), SLA Breach |
| **Info / Neutral** | `#EFF6FF` (`blue-50`) | `#BFDBFE` (`blue-200`) | `#1E40AF` (`blue-800`) | In Transit, Dispatched, EDI Synced |
| **Draft / Inactive** | `#F1F5F9` (`slate-100`) | `#CBD5E1` (`slate-300`) | `#475569` (`slate-600`) | Draft, Canceled, Offline Telemetry |

---

## 4. Typography Hierarchy

- **Primary Font Family:** `Hanken Grotesk`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`
- **Monospace Family (Data/SKUs):** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `monospace`

| Level | Size | Weight | Line Height | Tracking | Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Page Title** | 24px (`text-2xl`) | 700 (`font-bold`) | 1.25 | `-0.02em` | Main dashboard & portal headers |
| **Section Title (H2)** | 18px (`text-lg`) | 600 (`font-semibold`) | 1.35 | `-0.01em` | Card titles, matrix headers, table titles |
| **Subhead / Metric Title** | 12px (`text-xs`) | 600 (`font-semibold`) | 1.4 | `+0.05em` | All-caps metric titles (`tracking-wider`) |
| **KPI Big Numbers** | 32px (`text-3xl`) | 700 (`font-bold`) | 1.1 | `-0.02em` | Currency values, total order counts |
| **Body (Standard)** | 14px (`text-sm`) | 400 (`font-normal`) | 1.5 | `0` | Standard table cell data, form labels |
| **Body Semibold** | 14px (`text-sm`) | 600 (`font-semibold`) | 1.5 | `0` | Key cell descriptors, PO numbers, user names |
| **Caption / Helper** | 12px (`text-xs`) | 400 (`font-normal`) | 1.4 | `0` | Sub-labels, sync stamps, warehouse rack tags |
| **Code / Data Coordinates** | 12px (`text-xs`) | 500 (`font-medium`) | 1.2 | `0` | SKUs (`SKU-9932-SN`), Bin codes (`Aisle 4 • Bin B2-11`) |

---

## 5. Spacing, Elevation & Layout Grid

### 5.1 Spacing Scale (8pt Grid System)
- `2xs` = 2px (`p-0.5` / `gap-0.5`)
- `xs` = 4px (`p-1` / `gap-1`)
- `sm` = 8px (`p-2` / `gap-2`)
- `md` = 12px (`p-3` / `gap-3`)
- `base` = 16px (`p-4` / `gap-4`)
- `lg` = 20px (`p-5` / `gap-5`)
- `xl` = 24px (`p-6` / `gap-6`)
- `2xl` = 32px (`p-8` / `gap-8`)

### 5.2 Border Radius
- **Micro (Inputs, Badges, Table Buttons):** `rounded` (4px / 0.25rem)
- **Cards & Containers:** `rounded-lg` (6px to 8px / 0.5rem)
- **Pills / Status Dots:** `rounded-full` (9999px)

### 5.3 Shadows (Elevation)
- **Card Flat (Default):** `shadow-none` with `border border-slate-200`
- **Interactive Hover:** `shadow-sm` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`)
- **Dropdowns & Popovers:** `shadow-md` (`0 4px 6px -1px rgb(0 0 0 / 0.1)`)
- **Modals & Flyouts:** `shadow-xl` (`0 20px 25px -5px rgb(0 0 0 / 0.1)`)

---

## 6. Component Patterns & Anatomy

### 6.1 App Shell Frames
- **Persistent Header:** 56px height, white background, 1px border-b, facility dropdown selector, omnisearch `⌘K`, notification bell with count badge, and user avatar.
- **Collapsible Sidebar:** 240px width (expandable/collapsible to 64px rail), role switch dropdown, categorised nav sections (`CORE`, `PROCUREMENT & SUPPLY`, `SALES & FULFILLMENT`, `SYSTEM & GOVERNANCE`), and real-time sync telemetry footer (`14ms Sync`).

### 6.2 High-Density Data Tables
- Row height: 40px to 44px.
- Table header: `bg-slate-50`, uppercase 12px tracking-wider, border-b border-slate-200.
- Data cells: Tabular figures for quantities, monospaced codes for SKUs and serials, status badges with color-coded dot indicator, right-aligned monetary values.
- Bulk Drawer: Sticky floating tray at bottom on multi-row checkbox selection.

### 6.3 Form Architecture & Inputs
- Standard input height: 36px (`h-9`), crisp border (`border-slate-300`), focus ring (`focus:border-blue-600 focus:ring-1 focus:ring-blue-600`).
- Multi-Step Stepper: Horizontal flow bar with step numbers, titles, and active indicator.
- Spec Matrix: Structured two-column key-value grids with monospace values and unit selectors.

### 6.4 Telemetry & Edge Resilience States
- **Live Sync Indicator:** Pulsing green indicator dot + latency display (`14ms Sync • SAP S/4HANA`).
- **Cryptographic Audit Hash:** Merkle root hash verification bar with consensus node checkmarks.
- **Offline / Degraded Banner:** High-visibility amber/red banner indicating pending local cache reconciliation.
