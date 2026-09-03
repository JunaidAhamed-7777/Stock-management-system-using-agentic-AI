web application/stitch/projects/12804117146067154911/screens/d607508005ee447d94c5ad8ca38c9993
# StockFlow — Design System Specification (`design.md`)

## 1. Overview & Brand Identity

**Product Name:** StockFlow Enterprise  
**Archetype:** B2B Mission-Critical SaaS / Logistics & Inventory Engine  
**Aesthetic:** Functionalist, ultra-clean, dense, high-contrast, zero-fluff data architecture.  
**Target Viewport:** Desktop (1440px+ optimized layout, collapsible sidebar, fluid responsive grid).  
**Core Principles:**
- **Scannability First:** Tabular figures, monospaced SKUs/coordinates, strict badge color semantics, and 40–44px row heights.
- **Single Accent Discipline:** Controlled Royal Navy / Electric Cobalt (`#2563EB`) strictly reserved for primary actions, active navigational states, and focus boundaries.
- **Subtle Elevation:** Rely on 1px crisp hairline borders (`#E2E8F0`) and soft, ambient shadows rather than heavy cards or blur effects.
- **Tri-Role Cohesion:** Unified visual grammar across Admin, Supplier, and Customer portals with role switcher context.

---

## 2. Color Palette & Token System

### 2.1 Neutral Surfaces & Backgrounds
| Token Name | Hex Value | Tailwind Class / Usage |
| :--- | :--- | :--- |
| `surface-canvas` | `#F8FAFC` | `bg-slate-50` — Global dashboard background |
| `surface-card` | `#FFFFFF` | `bg-white` — Data containers, modal backdrops, table bodies |
| `surface-subtle` | `#F1F5F9` | `bg-slate-100` — Table headers, disabled states, stat card wells |
| `surface-hover` | `#F8FAFC` | `hover:bg-slate-50` — Table row hover, menu item hover |
| `surface-active` | `#E2E8F0` | `bg-slate-200` — Active segmented button background |

### 2.2 Neutral Borders & Dividers
| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `border-default` | `#E2E8F0` | `border-slate-200` — Standard card borders, table dividers |
| `border-subtle` | `#F1F5F9` | `border-slate-100` — Subtle inner dividers |
| `border-strong` | `#CBD5E1` | `border-slate-300` — Input outlines, active dropdown triggers |

### 2.3 Typography & Text Content
| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `text-primary` | `#0F172A` | `text-slate-900` — Headings, key figures, table headers |
| `text-secondary` | `#475569` | `text-slate-600` — Data row values, descriptions, metadata |
| `text-muted` | `#64748B` | `text-slate-500` — Subtitles, helper text, breadcrumbs |
| `text-subtle` | `#94A3B8` | `text-slate-400` — Icon strokes, placeholder text, timestamps |

### 2.4 Primary Accent (Brand)
| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `primary-50` | `#EFF6FF` | Soft active background, selected table rows |
| `primary-100` | `#DBEAFE` | Soft badge background, focused input glow |
| `primary-500` | `#3B82F6` | Secondary accent, link underlines, progress indicators |
| `primary-600` | `#2563EB` | **Primary Brand Color** — Main CTA buttons, active tab indicators |
| `primary-700` | `#1D4ED8` | Primary button hover state |
| `primary-900` | `#1E3A8A` | High-contrast brand elements |

### 2.5 Semantic Status & Telemetry Tokens
| Status | Background (`bg-*`) | Border (`border-*`) | Text (`text-*`) | Meaning / Application |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `#ECFDF5` (`emerald-50`) | `#A7F3D0` (`emerald-200`) | `#065F46` (`emerald-800`) | In Stock (>80%), Fulfilled, Delivered, AS2 Connected |
| **Warning** | `#FFFBEB` (`amber-50`) | `#FDE68A` (`amber-200`) | `#92400E` (`amber-800`) | Low Stock Warning, Pending Approval, In Production |
| **Danger** | `#FEF2F2` (`red-50`) | `#FECACA` (`red-200`) | `#991B1B` (`red-800`) | Out of Stock / Stockout, High Density (>85%), SLA Breach |
| **Info / Neutral** | `#EFF6FF` (`blue-50`) | `#BFDBFE` (`blue-200`) | `#1E40AF` (`blue-800`) | In Transit, Dispatched, EDI Synced |
| **Draft / Inactive** | `#F1F5F9` (`slate-100`) | `#CBD5E1` (`slate-300`) | `#475569` (`slate-600`) | Draft, Canceled, Offline Telemetry |

---

## 3. Typography Hierarchy

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

## 4. Spacing, Elevation & Layout Grid

### 4.1 Spacing Scale (8pt Grid System)
- `2xs` = 2px (`p-0.5` / `gap-0.5`)
- `xs` = 4px (`p-1` / `gap-1`)
- `sm` = 8px (`p-2` / `gap-2`)
- `md` = 12px (`p-3` / `gap-3`)
- `base` = 16px (`p-4` / `gap-4`)
- `lg` = 20px (`p-5` / `gap-5`)
- `xl` = 24px (`p-6` / `gap-6`)
- `2xl` = 32px (`p-8` / `gap-8`)

### 4.2 Border Radius
- **Micro (Inputs, Badges, Table Buttons):** `rounded` (4px / 0.25rem)
- **Cards & Containers:** `rounded-lg` (6px to 8px / 0.5rem)
- **Pills / Status Dots:** `rounded-full` (9999px)

### 4.3 Shadows (Elevation)
- **Card Flat (Default):** `shadow-none` with `border border-slate-200`
- **Interactive Hover:** `shadow-sm` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`)
- **Dropdowns & Popovers:** `shadow-md` (`0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`)
- **Modals & Flyouts:** `shadow-xl` (`0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`)

---

## 5. Component Patterns & Anatomy

### 5.1 App Shell Frame
- **Sidebar Navigation:**
  - Width: `240px` (standard), collapsible to `64px` icon rail.
  - Background: `bg-white` with `border-r border-slate-200`.
  - Brand Unit: 40px icon logo (`#1E293B` container with layered blue glyph) + "StockFlow" wordmark + `v2.4 Enterprise` pill badge.
  - Active Role Selector: Select/switch input at the top (`Admin Portal`, `Supplier Portal`, `Customer Portal`).
  - Section Headings: 11px uppercase `tracking-wider` slate-400 headers (`CORE`, `PROCUREMENT & SUPPLY`, `SALES & FULFILLMENT`, `SYSTEM & GOVERNANCE`).
  - Nav Item: 36px height, rounded-md, `text-slate-600 hover:text-slate-900 hover:bg-slate-50`. Active state: `bg-blue-50 text-blue-700 font-semibold`.
  - Footer: Real-time telemetry pulse dot (Green `14ms Sync`) and Collapse toggle.
- **Top Header Bar:**
  - Height: `56px`, `bg-white border-b border-slate-200`.
  - Left: Facility selector dropdown (`Chicago Central DC-01` with quick chevron).
  - Center: Global Omnisearch input with keyboard shortcut pill (`⌘K`).
  - Right: Action CTA button (`+ Quick PO`), notification bell with counter badge (`3`), user avatar, name, and role (`Elena Rostova • Operations Admin`).

### 5.2 Metric / KPI Stat Cards
- Layout: 4-column grid (`grid-cols-4 gap-4`).
- Container: White card with 1px slate-200 border, `p-4 rounded-lg`.
- Top: Metric label (`text-xs uppercase font-semibold text-slate-500`) + trailing pill badge (e.g. `+3.2%`, `Action Req.`, `98.4% SLA`).
- Value: 28px–32px bold number in `#0F172A`.
- Footer: Micro-sparkline, mini progress ratio bar, or secondary metric detail (`vs $4.74M LM`, `4 stockouts imminent`).

### 5.3 High-Density Data Tables
- **Table Density:** 40px–44px row heights for rapid scanning of large inventory catalogs.
- **Header (`<thead>`):** `bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200`.
- **Data Rows (`<tbody>`):**
  - Text: 13px–14px `#0F172A`.
  - Border: 1px border between rows (`border-b border-slate-100`).
  - Hover: `hover:bg-slate-50/80 transition-colors`.
  - Checkbox: Custom 16px square checkbox with 3px border radius.
- **Status Badges:** Compact inline badge, `px-2 py-0.5 rounded text-xs font-medium` with colored dot (`h-1.5 w-1.5 rounded-full mr-1.5`).
- **Row Actions:** Small icon buttons or outline pill buttons (`Approve PO`, `Track`, `Gate Pass`, `...`).
- **Pagination Bar:** Showing records 1–10 of N, items per page dropdown, and numeric page navigator.

### 5.4 Buttons & Interactive Controls
- **Primary Button:**
  - Style: `bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-1.5 rounded text-sm shadow-sm transition-colors`.
  - Used for: Primary creation tasks (`+ Create New Product SKU`, `+ New Wholesale Order`, `Approve PO`).
- **Secondary / Outline Button:**
  - Style: `bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-3 py-1.5 rounded text-sm transition-colors`.
  - Used for: Filter toggles, CSV bulk export, report downloads.
- **Dark Neutral Button (Operations):**
  - Style: `bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-1.5 rounded text-sm`.
  - Used for: Quick Action triggers (`+ Quick PO`, `Acknowledge PO`).
- **Danger Button:**
  - Style: `bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded text-sm`.

### 5.5 Form Controls & Filter Bars
- **Inputs:** `h-9 px-3 text-sm bg-white border border-slate-300 rounded text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none`.
- **Filter Presets:** Horizontal pill tabs (`All`, `Fast Moving`, `Quarantine (14)`, `Allocated > 80%`).
- **Multi-Filter Bar:** Search input + facility dropdown + stock level filter + category filter + view toggles.

### 5.6 Telemetry & Edge Resilience States
- **Live Sync Badge:** Pill with green pulse dot + latency stamp (`14ms Sync`, `Real-Time Sync 0.4s ago`).
- **Empty State Card:** Neutral bordered card with centered icon illustration, bold heading (`No Backordered Items Currently`), descriptive copy, and a secondary action button (`View Fulfilled Archive`).
- **Inline Alert Banner:** Crisp callout banner with 1px border (`border-blue-200 bg-blue-50/70 text-blue-900`) and inline action link (`AUDIT DELTA BINS`).
- **Telemetry Skeleton:** Subtle pulsating slate-100 placeholder blocks representing streaming data channels.

---

## 6. Accessibility & Implementation Rules

1. **Strict WCAG AAA Contrast:** All text tokens against neutral backgrounds maintain >= 7:1 contrast for body copy and >= 4.5:1 for data captions.
2. **Tabular Numerals:** Always apply CSS `font-variant-numeric: tabular-nums` or `font-mono` on inventory counts, serials, and currency.
3. **No Gratuitous Animation:** Confine animations to instant `<150ms` UI state transitions (button press, dropdown display, modal opacity).
4. **Resilient Fallbacks:** Every data table must supply an integrated empty state and error recovery button.
