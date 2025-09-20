import React from "react";
import { Outlet } from "react-router";
import SideNav from "./SideNav";
import Card from "./Card";

/**
 * Dashboard Layout
 * - Full height split: SideNav + main content
 * - White Card containers for sections
 */
export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="flex-shrink-0">
        <SideNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Example wrapper card for routed content */}
        <Card className="min-h-[200px]">
          <Outlet />
        </Card>
      </main>
    </div>
  );
};

export default Layout;
