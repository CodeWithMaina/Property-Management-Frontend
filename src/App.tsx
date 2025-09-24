// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider, useSelector } from "react-redux";
import { useSystemThemeSync } from "./hooks/useSystemThemeSync";
import { useEffect } from "react";

import "./App.css";

import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./Dashboard/pages/Admin/Analytics";
import { Users } from "./Dashboard/pages/Admin/Users";
import { OrganizationManagement } from "./Dashboard/pages/Admin/OrganizationManagement";
import { Properties } from "./Dashboard/pages/Admin/PropertyManagement";
import { UnitManagementPage } from "./Dashboard/pages/Admin/UnitManagementPage";
import { Leases } from "./Dashboard/pages/Admin/Leases";
import { Invoices } from "./Dashboard/pages/Admin/Invoices";
import { Maintenance } from "./Dashboard/pages/Admin/Maintenance";
import { Settings } from "./Dashboard/pages/Admin/Settings";
import { Reports } from "./Dashboard/pages/Admin/Reports";
import { Payments } from "./Dashboard/pages/Admin/Payments";
import { store, type RootState } from "./redux/store/store";
import { UnitsAnalytics } from "./Dashboard/components/units/UnitsAnalytics";
import { UnitsPage } from "./Dashboard/components/units/UnitsPage";
import { PropertiesAnalytics } from "./Dashboard/components/properties/PropertiesAnalytics";
import { PropertiesList } from "./Dashboard/components/properties/PropertiesList";
import { CreateProperty } from "./Dashboard/components/properties/CreateProperty";
import { EditProperty } from "./Dashboard/components/properties/EditProperty";
import { CreateUnit } from "./Dashboard/components/units/CreateUnit";
import { EditUnit } from "./Dashboard/components/units/EditUnit";
import { DisplayUnit } from "./Dashboard/components/units/DisplayUnit";
import { DisplayProperty } from "./Dashboard/components/properties/DisplayProperty";
import { OrganizationsAnalytics } from "./Dashboard/components/organizations/OrganizationsAnalytics";
import { OrganizationsList } from "./Dashboard/components/organizations/OrganizationsList";
import { CreateOrganization } from "./Dashboard/components/organizations/CreateOrganization";
import { EditOrganization } from "./Dashboard/components/organizations/EditOrganization";
import { DisplayOrganization } from "./Dashboard/components/organizations/DisplayOrganization";

function ThemeApplier() {
  const resolvedTheme = useSelector(
    (state: RootState) => state.theme.resolvedMode
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);

    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        resolvedTheme === "dark" ? "#111827" : "#ffffff"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = resolvedTheme === "dark" ? "#111827" : "#ffffff";
      document.head.appendChild(meta);
    }
  }, [resolvedTheme]);

  return null;
}

function AppContent() {
  useSystemThemeSync();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className="flex items-center justify-center min-h-screen">
          Welcome to Property Management System
        </div>
      ),
    },
    {
      path: "/admin",
      element: <Dashboard />,
      handle: { breadcrumb: "Dashboard" },
      children: [
        {
          index: true,
          element: <Analytics />,
          handle: { breadcrumb: "Analytics" },
        },
        {
          path: "analytics",
          element: <Analytics />,
          handle: { breadcrumb: "Analytics" },
        },
        {
          path: "users",
          element: <Users />,
          handle: { breadcrumb: "Users" },
        },
        {
          path: "organizations",
          element: <OrganizationManagement />,
          handle: { breadcrumb: "Organizations" },
          children: [
            {
              index: true, // ✅ Default route
              element: <OrganizationsAnalytics />,
              handle: { breadcrumb: "Organization Analytics" },
            },
            {
              path: "analytics",
              element: <OrganizationsAnalytics />,
              handle: { breadcrumb: "Organization Analytics" },
            },
            {
              path: "list",
              element: <OrganizationsList />,
              handle: { breadcrumb: "Organization List" },
            },
            {
              path: "create",
              element: <CreateOrganization />,
              handle: { breadcrumb: "Create Organization" },
            },
            {
              path: "edit/:id",
              element: <EditOrganization />,
              handle: { breadcrumb: "Edit Organization" },
            },
            {
              path: "display/:id",
              element: <DisplayOrganization />,
              handle: { breadcrumb: "Display Organization" },
            },
          ],
        },

        {
          path: "properties",
          element: <Properties />,
          handle: { breadcrumb: "Properties" },
          children: [
            {
              index: true,
              element: <PropertiesAnalytics />,
              handle: { breadcrumb: "Property Analytics" },
            },
            {
              path: "analytics",
              element: <PropertiesAnalytics />,
              handle: { breadcrumb: "Property Analytics" },
            },
            {
              path: "list",
              element: <PropertiesList />,
              handle: { breadcrumb: "Property List" },
            },
            {
              path: "display/:id",
              element: <DisplayProperty />,
              handle: { breadcrumb: "Display Property" },
            },
            {
              path: "create",
              element: <CreateProperty />,
              handle: { breadcrumb: "Create Property" },
            },
            {
              path: "edit/:id",
              element: <EditProperty />,
              handle: { breadcrumb: "Edit Property" },
            },
          ],
        },
        {
          path: "units",
          element: <UnitManagementPage />,
          handle: { breadcrumb: "Units" },
          children: [
            {
              index: true, // ✅ Default route
              element: <UnitsAnalytics />,
              handle: { breadcrumb: "Unit Analytics" },
            },
            {
              path: "analytics",
              element: <UnitsAnalytics />,
              handle: { breadcrumb: "Unit Analytics" },
            },
            {
              path: "display/:id",
              element: <DisplayUnit />,
              handle: { breadcrumb: "Display Unit" },
            },
            {
              path: "list",
              element: <UnitsPage />,
              handle: { breadcrumb: "Unit List" },
            },
            {
              path: "create",
              element: <CreateUnit />,
              handle: { breadcrumb: "Create Unit" },
            },
            {
              path: "edit/:id",
              element: <EditUnit />,
              handle: { breadcrumb: "Edit Unit" },
            },
          ],
        },
        {
          path: "leases",
          element: <Leases />,
          handle: { breadcrumb: "Leases" },
        },
        {
          path: "payments",
          element: <Payments />,
          handle: { breadcrumb: "Payments" },
        },
        {
          path: "invoices",
          element: <Invoices />,
          handle: { breadcrumb: "Invoices" },
        },
        {
          path: "maintenance",
          element: <Maintenance />,
          handle: { breadcrumb: "Maintenance" },
        },
        {
          path: "reports",
          element: <Reports />,
          handle: { breadcrumb: "Reports" },
        },
        {
          path: "settings",
          element: <Settings />,
          handle: { breadcrumb: "Settings" },
        },
      ],
    },
  ]);

  return (
    <div
      className="min-h-screen transition-colors duration-300 
      bg-background text-text-primary"
    >
      <ThemeApplier />
      <RouterProvider router={router} />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
