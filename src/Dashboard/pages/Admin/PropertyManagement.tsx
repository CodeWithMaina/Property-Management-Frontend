// src/Dashboard/pages/Admin/PropertyManagement.tsx
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { useEffect } from "react";

export const Properties = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to analytics when the parent route is accessed directly
  useEffect(() => {
    if (location.pathname === "/admin/properties" || 
        location.pathname === "/admin/properties/") {
      navigate("analytics", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Property Management
        </h1>
        <button
          onClick={() => navigate("create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Create Property
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <NavLink
          to="analytics"
          end
          className={({ isActive }) =>
            `px-4 py-2 -mb-px text-sm font-medium transition-colors border-b-2 ${
              isActive
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`
          }
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
          Properties List
        </NavLink>
      </div>

      {/* Render child routes */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};