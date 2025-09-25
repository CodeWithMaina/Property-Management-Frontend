// src/Dashboard/pages/Admin/InvoicesManagement.tsx
import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb } from "../../components/common/Breadcrumb";

/**
 * InvoicesManagementPage Component
 * 
 * Main container component for invoices management with tab navigation.
 * Handles redirects to default child route and provides navigation
 * between different invoices-related views.
 * 
 * @component
 * @example
 * return <InvoicesManagementPage />
 */
export const InvoicesManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Redirect to analytics when the parent route is accessed directly
   * Ensures users always land on a meaningful child route
   */
  useEffect(() => {
    if (location.pathname === "/admin/invoices" || 
        location.pathname === "/admin/invoices/") {
      navigate("analytics", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb navigation showing current location hierarchy */}
      <Breadcrumb />

      {/* Page header with title and primary action button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Invoices Management
        </h1>
        <button
          onClick={() => navigate("create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          aria-label="Create new invoice"
        >
          Create Invoice
        </button>
      </div>

      {/* Tab navigation for switching between invoices views */}
      <nav className="flex border-b border-gray-200 dark:border-gray-700" aria-label="Invoices management tabs">
        <NavLink
          to="analytics"
          className={({ isActive }) =>
            `px-4 py-2 -mb-px text-sm font-medium transition-colors border-b-2 ${
              isActive
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`
          }
          aria-current="page"
        >
          Analytics
        </NavLink>
        <NavLink
          to="list"
          className={({ isActive }) =>
            `px-4 py-2 -mb-px text-sm font-medium transition-colors border-b-2 ${
              isActive
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`
          }
        >
          Invoices List
        </NavLink>
      </nav>

      {/* Container for rendering child route components */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};