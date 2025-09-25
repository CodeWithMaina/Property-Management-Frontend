// src/Dashboard/pages/Admin/AmenityManagement.tsx
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { useEffect } from "react";

/**
 * AmenityManagement Component
 * 
 * Main layout component for amenity management section.
 * Handles routing, navigation, and breadcrumb display for amenity-related operations.
 * 
 * Features:
 * - Automatic redirect to analytics page when accessing the base route
 * - Tab-based navigation between analytics and list views
 * - Breadcrumb navigation
 * - Create amenity button
 * 
 * Child routes:
 * - /analytics: Amenity analytics dashboard
 * - /list: Amenities list view
 * - /create: Create new amenity form
 * - /edit/:id: Edit existing amenity form
 * - /display/:id: Amenity details view
 */
export const AmenityManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Redirect to analytics when the parent route is accessed directly
   * This ensures users always land on a meaningful page
   */
  useEffect(() => {
    if (location.pathname === "/admin/amenities" || 
        location.pathname === "/admin/amenities/") {
      navigate("analytics", { replace: true });
    }
  }, [location.pathname, navigate]);

  /**
   * Navigation link styling function
   * Applies active state styling based on current route
   */
  const getNavLinkClass = (isActive: boolean): string => {
    return `px-4 py-2 -mb-px text-sm font-medium transition-colors border-b-2 ${
      isActive
        ? "border-blue-500 text-blue-600 font-semibold"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;
  };

  /**
   * Handler for creating a new amenity
   * Navigates to the create amenity form
   */
  const handleCreateAmenity = (): void => {
    navigate("create");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Amenity Management
        </h1>
        <button
          onClick={handleCreateAmenity}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          aria-label="Create new amenity"
        >
          Create Amenity
        </button>
      </div>

      {/* Tab Navigation */}
      <nav aria-label="Amenity management sections">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <NavLink
            to="analytics"
            end
            className={({ isActive }) => getNavLinkClass(isActive)}
            aria-current="page"
          >
            Analytics
          </NavLink>
          <NavLink
            to="list"
            className={({ isActive }) => getNavLinkClass(isActive)}
            aria-current="page"
          >
            Amenities List
          </NavLink>
        </div>
      </nav>

      {/* Child Route Content */}
      <div className="mt-6" role="main">
        <Outlet />
      </div>
    </div>
  );
};