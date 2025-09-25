// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider, useSelector } from "react-redux";
import { useSystemThemeSync } from "./hooks/useSystemThemeSync";
import { useEffect } from "react";

import "./App.css";

import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./Dashboard/pages/Admin/Analytics";
import { OrganizationManagement } from "./Dashboard/pages/Admin/OrganizationManagement";
import { Properties } from "./Dashboard/pages/Admin/PropertyManagement";
import { UnitManagementPage } from "./Dashboard/pages/Admin/UnitManagementPage";
import { LeasesManagement } from "./Dashboard/pages/Admin/LeasesManagement";
import { Maintenance } from "./Dashboard/pages/Admin/Maintenance";
import { Settings } from "./Dashboard/pages/Admin/Settings";
import { Reports } from "./Dashboard/pages/Admin/Reports";
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
import { UsersManagement } from "./Dashboard/pages/Admin/UsersManagement";
import { UsersAnalytics } from "./Dashboard/components/users/UsersAnalytics";
import { UsersList } from "./Dashboard/components/users/UsersList";
import { CreateUser } from "./Dashboard/components/users/CreateUser";
import { EditUser } from "./Dashboard/components/users/EditUser";
import { DisplayUser } from "./Dashboard/components/users/DisplayUser";
import { LeasesAnalytics } from "./Dashboard/components/leases/LeasesAnalytics";
import { LeasesList } from "./Dashboard/components/leases/LeasesList";
import { CreateLease } from "./Dashboard/components/leases/CreateLease";
import { EditLease } from "./Dashboard/components/leases/EditLease";
import { DisplayLease } from "./Dashboard/components/leases/DisplayLease";
import { PaymentsManagement } from "./Dashboard/pages/Admin/PaymentsManagement";
import { PaymentsAnalytics } from "./Dashboard/components/payments/PaymentsAnalytics";
import { PaymentsList } from "./Dashboard/components/payments/PaymentsList";
import { CreatePayment } from "./Dashboard/components/payments/CreatePayment";
import { EditPayment } from "./Dashboard/components/payments/EditPayment";
import { DisplayPayment } from "./Dashboard/components/payments/DisplayPayment";
import { InvoicesManagement } from "./Dashboard/pages/Admin/InvoicesManagement";
import { InvoicesAnalytics } from "./Dashboard/components/invoices/InvoicesAnalytics";
import { InvoicesList } from "./Dashboard/components/invoices/InvoicesList";
import { CreateInvoice } from "./Dashboard/components/invoices/CreateInvoice";
import { EditInvoice } from "./Dashboard/components/invoices/EditInvoice";
import { DisplayInvoice } from "./Dashboard/components/invoices/DisplayInvoice";
import { AmenityManagement } from "./Dashboard/pages/Admin/AmenityManagement";
import { AmenitiesList } from "./Dashboard/components/amenities/AmenitiesList";
import { CreateAmenity } from "./Dashboard/components/amenities/CreateAmenity";
import { EditAmenity } from "./Dashboard/components/amenities/EditAmenity";
import { DisplayAmenity } from "./Dashboard/components/amenities/DisplayAmenity";
import { AmenitiesAnalytics } from "./Dashboard/components/amenities/AmenitiesAnalytics";
import { Toaster } from "react-hot-toast";

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
          element: <UsersManagement />,
          handle: { breadcrumb: "Users" },
          children: [
            {
              index: true, // ✅ Default route
              element: <UsersAnalytics />,
              handle: { breadcrumb: "User Analytics" },
            },
            {
              path: "analytics",
              element: <UsersAnalytics />,
              handle: { breadcrumb: "User Analytics" },
            },
            {
              path: "list",
              element: <UsersList />,
              handle: { breadcrumb: "User List" },
            },
            {
              path: "create",
              element: <CreateUser />,
              handle: { breadcrumb: "Create User" },
            },
            {
              path: "edit/:id",
              element: <EditUser />,
              handle: { breadcrumb: "Edit User" },
            },
            {
              path: "display/:id",
              element: <DisplayUser />,
              handle: { breadcrumb: "Display User" },
            },
          ],
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
          element: <LeasesManagement />,
          handle: { breadcrumb: "Leases" },
          children: [
            {
              index: true,
              element: <LeasesAnalytics />,
              handle: { breadcrumb: "Lease Analytics" },
            },
            {
              path: "analytics",
              element: <LeasesAnalytics />,
              handle: { breadcrumb: "Lease Analytics" },
            },
            {
              path: "list",
              element: <LeasesList />,
              handle: { breadcrumb: "Lease List" },
            },
            {
              path: "create",
              element: <CreateLease />,
              handle: { breadcrumb: "Create Lease" },
            },
            {
              path: "edit/:id",
              element: <EditLease />,
              handle: { breadcrumb: "Edit Lease" },
            },
            {
              path: "display/:id",
              element: <DisplayLease />,
              handle: { breadcrumb: "Display Lease" },
            },
          ],
        },
        {
          path: "payments",
          element: <PaymentsManagement />,
          handle: { breadcrumb: "Payments" },
          children: [
            {
              index: true,
              element: <PaymentsAnalytics />,
              handle: { breadcrumb: "Payment Analytics" },
            },
            {
              path: "analytics",
              element: <PaymentsAnalytics />,
              handle: { breadcrumb: "Payment Analytics" },
            },
            {
              path: "list",
              element: <PaymentsList />,
              handle: { breadcrumb: "Payment List" },
            },
            {
              path: "create",
              element: <CreatePayment />,
              handle: { breadcrumb: "Create Payment" },
            },
            {
              path: "edit/:id",
              element: <EditPayment />,
              handle: { breadcrumb: "Edit Payment" },
            },
            {
              path: "display/:id",
              element: <DisplayPayment />,
              handle: { breadcrumb: "Display Payment" },
            },
          ],
        },
        {
          path: "invoices",
          element: <InvoicesManagement />,
          handle: { breadcrumb: "Invoices" },
          children: [
            {
              index: true,
              element: <InvoicesAnalytics />,
              handle: { breadcrumb: "Invoice Analytics" },
            },
            {
              path: "analytics",
              element: <InvoicesAnalytics />,
              handle: { breadcrumb: "Invoice Analytics" },
            },
            {
              path: "list",
              element: <InvoicesList />,
              handle: { breadcrumb: "Invoice List" },
            },
            {
              path: "create",
              element: <CreateInvoice />,
              handle: { breadcrumb: "Create Invoice" },
            },
            {
              path: "edit/:id",
              element: <EditInvoice />,
              handle: { breadcrumb: "Edit Invoice" },
            },
            {
              path: "display/:id",
              element: <DisplayInvoice />,
              handle: { breadcrumb: "Display Invoice" },
            },
          ],
        },
        {
          path: "amenities",
          element: <AmenityManagement />,
          handle: { breadcrumb: "Organizations" },
          children: [
            {
              index: true,
              element: <AmenitiesAnalytics />,
              handle: { breadcrumb: "Organization Analytics" },
            },
            {
              path: "analytics",
              element: <AmenitiesAnalytics />,
              handle: { breadcrumb: "Organization Analytics" },
            },
            {
              path: "list",
              element: <AmenitiesList />,
              handle: { breadcrumb: "Organization List" },
            },
            {
              path: "create",
              element: <CreateAmenity />,
              handle: { breadcrumb: "Create Organization" },
            },
            {
              path: "edit/:id",
              element: <EditAmenity />,
              handle: { breadcrumb: "Edit Organization" },
            },
            {
              path: "display/:id",
              element: <DisplayAmenity />,
              handle: { breadcrumb: "Display Organization" },
            },
          ],
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

      {/* 🔥 Global Toaster mounted once here */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background:
              document.documentElement.getAttribute("data-theme") === "dark"
                ? "#1e293b"
                : "#f8fafc",
            color:
              document.documentElement.getAttribute("data-theme") === "dark"
                ? "#f8fafc"
                : "#1e293b",
          },
        }}
      />
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
