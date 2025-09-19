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
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface SideNavProps {
  onClose?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ onClose }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Dashboard: true,
    Management: true,
    Financial: true,
    Operations: true,
    System: true,
  });

  const navGroups = [
    {
      name: "Dashboard",
      items: [{ name: "Analytics", icon: BarChart3, path: "/admin/analytics" }],
    },
    {
      name: "Management",
      items: [
        { name: "Organizations", icon: Landmark, path: "/admin/organizations" },
        { name: "Properties", icon: Building2, path: "/admin/properties" },
        { name: "Units", icon: Grid3x3, path: "/admin/units" },
        { name: "Users", icon: Users, path: "/admin/users" },
      ],
    },
    {
      name: "Financial",
      items: [
        { name: "Payments", icon: CreditCard, path: "/admin/payments" },
        { name: "Invoices", icon: FileSpreadsheet, path: "/admin/invoices" },
        { name: "Reports", icon: FileSpreadsheet, path: "/admin/reports" },
      ],
    },
    {
      name: "Operations",
      items: [
        { name: "Maintenance", icon: Wrench, path: "/admin/maintenance" },
        { name: "Leases", icon: FileText, path: "/admin/leases" },
      ],
    },
    {
      name: "System",
      items: [{ name: "Settings", icon: Settings, path: "/admin/settings" }],
    },
  ];

  const toggleGroup = (groupName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.2 },
    }),
  };

  return (
    <div className="flex flex-col h-full w-64 bg-background text-text-primary border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-lg font-heading font-bold text-primary">PropertyHub</h2>
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="md:hidden p-1.5 rounded-md hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {navGroups.map((group) => (
          <div key={group.name} className="mb-2">
            <button
              onClick={() => toggleGroup(group.name)}
              className="flex items-center justify-between w-full px-2 py-2 rounded-md text-sm font-semibold text-text-primary hover:bg-surface transition-colors"
            >
              <span>{group.name}</span>
              <motion.div
                animate={{ rotate: expandedItems[group.name] ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: expandedItems[group.name] ? "auto" : 0,
                opacity: expandedItems[group.name] ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-2 mt-1 space-y-0.5">
                {group.items.map(({ name, icon: Icon, path }, index) => (
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
                        `group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                        ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-text-secondary hover:bg-surface hover:text-text-primary"
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 text-text-secondary group-hover:text-primary" />
                      <span>{name}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-secondary">
            v2.1.0 • {new Date().getFullYear()}
          </p>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">AD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
