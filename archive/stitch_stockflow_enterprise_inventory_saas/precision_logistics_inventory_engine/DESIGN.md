---
name: Precision Logistics & Inventory Engine
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#1d4ed8'
  on-secondary: '#ffffff'
  secondary-container: '#4069f2'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b5'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: hankenGrotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: hankenGrotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: hankenGrotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: hankenGrotesk
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  body-md:
    fontFamily: geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  mono-data:
    fontFamily: geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-md:
    fontFamily: geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.025em
  caption:
    fontFamily: geist
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.375rem
  space-md: 0.5rem
  space-base: 0.75rem
  space-lg: 1rem
  space-xl: 1.25rem
  space-2xl: 1.5rem
  space-3xl: 2rem
  sidebar-width: 15rem
  header-height: 3.25rem
  table-row-dense: 2.25rem
  table-row-default: 2.75rem
---

## Brand & Style

This design system delivers an enterprise-grade, high-density instrumentation interface engineered for supply chain operations, fulfillment routing, and real-time inventory tracking. Drawing aesthetic discipline from developer-first infrastructure monitors and modern logistics consoles, it balances absolute utilitarian efficiency with subtle luxury finish.

### Design Principles
- **Instrument-Grade Precision:** Every pixel, border, and character serves operational accuracy. Interfaces avoid decorative fluff in favor of tabular clarity, predictable layouts, and immediate scannability.
- **Controlled High-Density:** Space is treated as a premium analytical surface. Tight vertical rhythms and compact typography maximize visible inventory telemetry without causing visual fatigue.
- **Tactile Restraint:** Surfaces rely on razor-thin 1px structural strokes, subtle tonal variations, and micro-shadows rather than layered drop shadows or frosted glass blurs.
- **State Transparency:** Semantic colors exist strictly to communicate urgency, threshold breaks, and operational states—never for generic decoration.

## Colors

The system uses a calibrated cold slate substrate designed for long-duration viewing. The primary anchor `#0F172A` establishes rigorous visual weight across primary actions, active states, and core headlines, supported by `#1D4ED8` for interactive links, selections, and system highlights.

### Palette Architecture
- **Surface Canvas (`#F8FAFC`):** Application base background across viewport windows, sidebars, and structural wells.
- **Card Surface (`#FFFFFF`):** High-contrast background for interactive modules, data grids, modals, and metric panels.
- **Structural Strokes (`#E2E8F0` / `#CBD5E1`):** Crisp 1px division lines providing strict structural definition without visual clutter.
- **Text Primary (`#0F172A`):** Core typography, inventory counts, and primary data readouts.
- **Text Muted (`#64748B`):** Auxiliary metadata, column headers, timestamps, and secondary identifiers.
- **Status Accents:**
  - `In-Stock / Fulfilled:` `#16A34A` background tint `#F0FDF4`, border `#BBF7D0`.
  - `Low-Stock / Pending:` `#D97706` background tint `#FFFBEB`, border `#FDE68A`.
  - `Depleted / Critical Alert:` `#DC2626` background tint `#FEF2F2`, border `#FECACA`.
  - `Draft / Inactive:` `#475569` background tint `#F1F5F9`, border `#CBD5E1`.

## Typography

Typography prioritizes high information density, sharp structural geometry, and numeric legibility. `Hanken Grotesk` governs top-tier headers and operational summaries, while `Geist` drives core interaction levels, dense lists, and data tables.

All numeric elements, serial numbers, SKU codes, and balance sheets must enforce `font-variant-numeric: tabular-nums` to ensure exact column alignment across deep multi-row data structures.

## Layout & Spacing

The structural layout uses an application shell framework built on a fixed-width left navigation rail (`15rem`), a sticky utility header (`3.25rem`), and an elastic dashboard canvas that conforms dynamically to desktop viewports.

### Grid Rhythm & Viewport Rules
- **Base Rhythm:** Built on a tight 4px baseline. Spacing steps leverage 4px, 8px, 12px, 16px, 24px, and 32px increments.
- **Dense Shell Mechanics:** Data views and dashboard grids default to fluid CSS Grid containers with 16px gutters on viewports up to 1440px, scaling to 24px gutters beyond.
- **Breakpoint Adjustments:**
  - **Desktop Large (≥1440px):** Full telemetry displays, multi-column inventory stats (4-up KPI matrices), split-pane inspector drawer on right.
  - **Desktop (1024px–1439px):** Collapsed KPI matrices (2-up), tables collapse optional columns (`updated_at`, `vendor_id`).
  - **Tablet (768px–1023px):** Left navigation collapses to an icon rail (`4rem` width), quick-filter toolbars transform into horizontally scrollable pill groups.

## Elevation & Depth

This system intentionally departs from diffused dropshadows, relying on structural framing via 1px solid edges and micro-elevations.

### Depth Mechanics
- **Ground Floor (`Level 0`):** `#F8FAFC` raw workspace background.
- **Container Floor (`Level 1`):** `#FFFFFF` cards, table containers, and KPI widgets bounded by a strict `1px solid #E2E8F0` stroke. Micro-shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`.
- **Raised Interactive Surfaces (`Level 2`):** Dropdowns, context menus, and quick-filter trays. Bound by `1px solid #CBD5E1` with structured shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Overlay Panels (`Level 3`):** Modal dialogues, batch adjustment drawers, and inventory lookup command palettes (`Cmd+K`). Styled with `1px solid #94A3B8` and focused shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`.

## Shapes

The design system employs controlled geometric precision. The corner radius is governed by level `1` (`rounded-md: 0.375rem / 6px`, `rounded-lg: 0.5rem / 8px`), communicating architectural stability and alignment with technical data tables.

- **Base Components:** Inputs, buttons, filter chips, and badges employ a 4px to 6px radius (`0.25rem` to `0.375rem`).
- **Data Cards & Dialogs:** Modals, telemetry enclosures, and KPI tiles utilize 6px to 8px (`0.375rem` to `0.5rem`).
- **Status Indicators:** Pill badges utilize full rounding (`9999px`) to create an immediate shape-distinction against rectangular input fields and square cells.

## Components

### Buttons
- **Primary:** Background `#0F172A`, text `#FFFFFF`, 1px solid `#0F172A`. Hover: `#1E293B`. Active: `#020617`. Height: 32px (`label-md`).
- **Secondary Outline:** Background `#FFFFFF`, text `#0F172A`, 1px solid `#E2E8F0`. Hover: `#F8FAFC`, border `#CBD5E1`. Height: 32px.
- **Ghost:** Background transparent, text `#475569`. Hover: `#F1F5F9`, text `#0F172A`. Height: 32px.
- **Destructive:** Background `#FEF2F2`, text `#DC2626`, 1px solid `#FECACA`. Hover: `#DC2626`, text `#FFFFFF`. Height: 32px.

### Inputs & Selectors
- Height 32px, horizontal padding 10px. Typography: `body-sm`.
- Rest: Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`.
- Focus: Border `1px solid #1D4ED8`, outline `2px solid rgba(29, 78, 216, 0.15)`.
- Compact Table Filter Inputs: Height 28px, font size 12px.

### Status Badges & Chips
- Compact pills: Height 20px, horizontal padding 8px, font: `label-sm`.
- Structure: 1px border with matching pastel tint background and darkened text for WCAG AAA legibility.
  - Fulfilled / Active: Text `#15803D`, BG `#F0FDF4`, Border `#DCFCE7`.
  - Low Stock: Text `#B45309`, BG `#FFFBEB`, Border `#FEF3C7`.
  - Critical Depleted: Text `#B91C1C`, BG `#FEF2F2`, Border `#FEE2E2`.

### Enterprise Data Grid
- Header row: Height 32px, background `#F8FAFC`, border-bottom `1px solid #E2E8F0`, typography: `label-sm` uppercase, tracking `0.05em`, color `#64748B`.
- Body rows: Height 40px (compact 34px), border-bottom `1px solid #F1F5F9`. Hover: background `#F8FAFC`. Selected: background `#EFF6FF`.
- Numeric columns right-aligned with `tabular-nums`.

### KPI Metric Tiles
- Background `#FFFFFF`, border `1px solid #E2E8F0`, padding 16px.
- Title: `label-sm` in `#64748B`. Value: `headline-md` in `#0F172A`.
- Auxiliary sparklines or delta chips positioned top-right with `label-sm` inline badges.

### Command Palette (`Cmd+K`) & Modals
- Backdrop: `rgba(15, 23, 42, 0.4)` with zero blur for instant frame rates.
- Palette frame: Width 600px, border `1px solid #CBD5E1`, background `#FFFFFF`, search input 44px with integrated keyboard shortcut hints (`ESC`, `ENTER`).