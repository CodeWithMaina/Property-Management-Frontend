// SideNav.tsx
import { NavLink } from "react-router-dom";
import {
  Building2,
  Grid3x3,
  CreditCard,
  Wrench,
  Users,
  FileText,
  FileSpreadsheet,
  Landmark,
  Settings,
  X,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

interface SideNavProps {
  onClose?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ onClose }) => {
  const navItems = [
    { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { name: "Organizations", icon: Landmark, path: "/admin/organizations" },
    { name: "Properties", icon: Building2, path: "/admin/properties" },
    { name: "Units", icon: Grid3x3, path: "/admin/units" },
    { name: "Payments", icon: CreditCard, path: "/admin/payments" },
    { name: "Maintenance", icon: Wrench, path: "/admin/maintenance" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Leases", icon: FileText, path: "/admin/leases" },
    { name: "Invoices", icon: FileSpreadsheet, path: "/admin/invoices" },
    { name: "Reports", icon: FileSpreadsheet, path: "/admin/reports" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white text-neutral border-r border-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
        <h2 className="text-h4 font-semibold">PMS</h2>
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg hover:bg-background"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Navigation - Now with independent scrolling */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map(({ name, icon: Icon, path }, index) => (
          <motion.div
            key={name}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-background text-neutral"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{name}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 px-4 py-3">
        <p className="text-xs text-neutral-60">© {new Date().getFullYear()} PMS</p>
      </div>
    </div>
  );
};