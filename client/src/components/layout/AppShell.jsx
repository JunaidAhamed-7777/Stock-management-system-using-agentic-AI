import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
      />
      <div className={`${collapsed ? "lg:pl-16" : "lg:pl-sidebar-width"}`}>
        <Header onMenu={() => setMobileOpen(true)} collapsed={collapsed} />
        <main className="relative pt-14 min-h-screen w-full p-space-lg">
          <div className="flex flex-col w-full space-y-space-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
