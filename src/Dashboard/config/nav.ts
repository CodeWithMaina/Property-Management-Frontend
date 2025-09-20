// src/config/nav.ts
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Landmark,
  Building2,
  Grid3x3,
  Users,
  CreditCard,
  FileSpreadsheet,
  Wrench,
  FileText,
  Settings,
} from "lucide-react";

export type NavItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: string | number;
};

export type NavGroup = {
  name: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    name: "Dashboard",
    items: [{ name: "Analytics", path: "/admin/analytics", icon: BarChart3 }],
  },
  {
    name: "Management",
    items: [
      { name: "Organizations", path: "/admin/organizations", icon: Landmark },
      { name: "Properties", path: "/admin/properties", icon: Building2 },
      { name: "Units", path: "/admin/units", icon: Grid3x3 },
      { name: "Users", path: "/admin/users", icon: Users },
    ],
  },
  {
    name: "Financial",
    items: [
      { name: "Payments", path: "/admin/payments", icon: CreditCard },
      { name: "Invoices", path: "/admin/invoices", icon: FileSpreadsheet },
      { name: "Reports", path: "/admin/reports", icon: FileSpreadsheet },
    ],
  },
  {
    name: "Operations",
    items: [
      { name: "Maintenance", path: "/admin/maintenance", icon: Wrench },
      { name: "Leases", path: "/admin/leases", icon: FileText },
    ],
  },
  {
    name: "System",
    items: [{ name: "Settings", path: "/admin/settings", icon: Settings }],
  },
];

export default navGroups;
