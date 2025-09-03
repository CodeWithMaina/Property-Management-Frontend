import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider, useSelector } from "react-redux";
import { useSystemThemeSync } from "./hooks/useSystemThemeSync";

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

function AppContent() {
  // Auto-sync with system theme
  useSystemThemeSync();

  const theme = useSelector((state: RootState) => state.theme.mode);

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
      ${theme === "dark" ? "dark bg-dark-background text-dark-text-primary" : "bg-light-background text-light-text-primary"}`}
    >
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
