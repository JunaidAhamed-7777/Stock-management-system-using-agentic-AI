import React from "react";
import { Link } from "react-router-dom";

export interface HeaderProps {
  title?: string;
  showUserMenu?: boolean;
  onLogout?: () => void;
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = "StockFlow",
  showUserMenu = true,
  onLogout,
  currentPath,
}) => {
  return (
    <header
      className="
        h-[3.25rem]
        bg-white
        border-b
        border-border-default
        shadow-sm
        flex
        items-center
        px-4
        sticky
        top-0
        z-20
      "
    >
      <div className="flex items-center">
        <Link
          to="/"
          className="
            text-slate-900
            font-semibold
            text-lg
            hover:underline
          "
        >
          StockFlow
        </Link>
      </div>

      {showUserMenu && (
        <div className="ml-8 flex items-center gap-3">
          {/* User avatar/button would go here */}
          {/* Placeholder for role-specific user menu */}
        </div>
      )}
    </header>
  );
};