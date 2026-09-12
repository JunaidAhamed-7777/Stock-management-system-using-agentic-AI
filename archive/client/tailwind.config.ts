import { defineConfig } from "tailwindcss";
import autoprefixer from "autoprefixer";
import plugin from "tailwindcss/plugin";

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral Surfaces
        "surface-canvas": "#F8FAFC",
        "surface-card": "#FFFFFF",
        "surface-subtle": "#F1F5F9",
        "surface-hover": "#F8FAFC",
        "surface-active": "#E2E8F0",

        // Neutral Borders
        "border-default": "#E2E8F0",
        "border-subtle": "#F1F5F9",
        "border-strong": "#CBD5E1",

        // Primary Accent (Brand)
        "primary-50": "#EFF6FF",
        "primary-100": "#DBEAFE",
        "primary-500": "#3B82F6",
        "primary-600": "#2563EB",
        "primary-700": "#1D4ED8",
        "primary-900": "#1E3A8A",

        // Semantic Status Tokens
        "success-bg": "#ECFDF5",
        "success-border": "#A7F3D0",
        "success-text": "#065F46",

        "warning-bg": "#FFFBEB",
        "warning-border": "#FDE68A",
        "warning-text": "#92400E",

        "danger-bg": "#FEF2F2",
        "danger-border": "#FECACA",
        "danger-text": "#991B1B",

        "info-bg": "#EFF6FF",
        "info-border": "#BFDBFE",
        "info-text": "#1E40AF",

        "draft-bg": "#F1F5F9",
        "draft-border": "#CBD5E1",
        "draft-text": "#475569",
      },
      borderRadius: {
        micro: "4px",
        card: "6px",
        pill: "9999px",
      },
      boxShadow: {
        flat: "none",
        hover: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      },
      fontFamily: {
        sans: ["Hanken Grotesk", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        monospace: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        // Typography hierarchy from DESIGN.md
        display: ["24px", { lineHeight: "1.25", weight: 700 }],
        h2: ["18px", { lineHeight: "1.35", weight: 600 }],
        "metric-title": ["12px", { lineHeight: "1.4", weight: 600, tracking: "0.05em" }],
        kpi: ["32px", { lineHeight: "1.1", weight: 700 }],
        body: ["14px", { lineHeight: "1.5", weight: 400 }],
        "body-semibold": ["14px", { lineHeight: "1.5", weight: 600 }],
        caption: ["12px", { lineHeight: "1.4", weight: 400 }],
        code: ["12px", { lineHeight: "1.2", weight: 500 }],
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        normal: "1.35",
        loose: "1.5",
      },
      spacing: {
        // 8pt Grid System from DESIGN.md
        "2xs": "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        base: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
      },
    },
  },
  plugins: [
    autoprefixer({
      grid: true,
    }),
    // Plugin to add line-height and weight as separate utilities
    plugin(function ({ matchUtilities, addUtilities }) {
      const fontUtilities = {
        "font-display": "var(--font-display)",
        "font-h2": "var(--font-h2)",
        "font-metric": "var(--font-metric)",
        "font-kpi": "var(--font-kpi)",
        "font-body": "var(--font-body)",
        "font-body-semibold": "var(--font-body-semibold)",
        "font-caption": "var(--font-caption)",
        "font-code": "var(--font-code)",
      };
      addUtilities(fontUtilities, ["responsive"]);
    }),
  ],
});