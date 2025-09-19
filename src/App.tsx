// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider, useSelector } from "react-redux";
import { useSystemThemeSync } from "./hooks/useSystemThemeSync";
import { useEffect } from "react";

import "./App.css";

import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./Dashboard/pages/Admin/Analytics";
import { Users } from "./Dashboard/pages/Admin/Users";
import { Organizations } from "./Dashboard/pages/Admin/Organizations";
import { Properties } from "./Dashboard/pages/Admin/Properties";
import { Units } from "./Dashboard/pages/Admin/Units";
import { Leases } from "./Dashboard/pages/Admin/Leases";
import { Invoices } from "./Dashboard/pages/Admin/Invoices";
import { Maintenance } from "./Dashboard/pages/Admin/Maintenance";
import { Settings } from "./Dashboard/pages/Admin/Settings";
import { Reports } from "./Dashboard/pages/Admin/Reports";
import { Payments } from "./Dashboard/pages/Admin/Payments";
import { store, type RootState } from "./redux/store/store";

/**
 * Component that applies the current theme to the document
 * This ensures proper theming for all components including third-party libraries
 */
// src/App.tsx - ThemeApplier component
function ThemeApplier() {
  const resolvedTheme = useSelector((state: RootState) => state.theme.resolvedMode);

  useEffect(() => {
    // Apply theme to document element for CSS variable usage
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    
    // Also set theme-color meta tag for mobile browsers
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content", 
        resolvedTheme === "dark" ? "#111827" : "#ffffff"
      );
    } else {
      // Create the meta tag if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = resolvedTheme === "dark" ? "#111827" : "#ffffff";
      document.head.appendChild(meta);
    }
  }, [resolvedTheme]);

  return null;
}

function AppContent() {
  // Auto-sync with system theme
  useSystemThemeSync();

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <Dashboard />,
      children: [
        { path: "analytics", element: <Analytics /> },
        { path: "users", element: <Users /> },
        { path: "organizations", element: <Organizations /> },
        { path: "properties", element: <Properties /> },
        { path: "units", element: <Units /> },
        { path: "leases", element: <Leases /> },
        { path: "payments", element: <Payments /> },
        { path: "invoices", element: <Invoices /> },
        { path: "maintenance", element: <Maintenance /> },
        { path: "reports", element: <Reports /> },
        { path: "settings", element: <Settings /> },
      ],
    },
  ]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 
        bg-background text-text-primary`}
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