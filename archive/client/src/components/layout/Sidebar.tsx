import React from "react";
import { Link } from "react-router-dom";

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  currentPath,
  onNavigate,
}) => {
  const navLinks = [
    { path: "dashboard", label: "Dashboard", icon: "📊" },
    { path: "products", label: "Products", icon: "📦" },
    { path: "stock", label: "Stock", icon: "📈" },
    { path: "orders", label: "Orders", icon: "🛒" },
  ];

  const sidebarWidth = isCollapsed ? "16px" : "240px";
  const navLinkWidth = isCollapsed ? "calc(100% - 24px)" : "auto";

  return (
    <div
      className="
        h-screen
        bg-white
        border-r
        border-border-default
        flex
        flex-col
        shadow-sm
        transition-transform
        duration-300
      "
      style={{ width: sidebarWidth }}
    >
      <div className="flex h-14 items-center px-4 border-b border-border-subtle">
        <span className="text-xs font-medium text-slate-600">
          StockFlow
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-px px-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <li key={link.path} className="group">
                <Link
                  to={link.path}
                  className="
                    flex
                    items-center
                    rounded-md
                    h-10
                    px-3
                    text-xs
                    font-medium
                    text-slate-500
                    group-hover:text-primary-600
                    transition-colors
                    select-none
                  "
                  style={{ width: navLinkWidth }}
                >
                  <span className="shrink-0 w-5">{link.icon}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {onToggleCollapse && (
        <div
          className="border-t border-border-subtle"
        >
          <button
            onClick={onToggleCollapse}
            className="
              w-full
              rounded-md
              px-2
              py-1
              text-xs
              font-medium
              text-slate-500
              text-center
              transition-colors
              hover:text-slate-700
            "
          >
            {isCollapsed
              ? "Expand Sidebar"
              : "Collapse Sidebar"}
          </button>
        </div>
      </div>
    </div>
  );
};