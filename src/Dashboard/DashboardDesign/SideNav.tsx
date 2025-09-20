// src/components/SideNav.tsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { navGroups } from "../config/nav";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  ChevronRight,
  Home,
  Building2,
} from "lucide-react";
import { useWindowSize } from "../../hooks/useWindowSize";

export const SideNav: React.FC = () => {
  const { isMobile } = useWindowSize();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navGroups.map((g) => [g.name, true]))
  );

  const toggleGroup = (name: string) =>
    setExpanded((s) => ({ ...s, [name]: !s[name] }));

  const width = collapsed ? 72 : 280;

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="p-3 rounded-xl shadow-lg transition-all duration-200"
            style={{
              background: "rgb(var(--color-surface) / 1)",
              color: "rgb(var(--color-primary) / 1)",
            }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      )}

      {/* Desktop sidenav */}
      <motion.aside
        initial={false}
        animate={{ width }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col h-screen relative text-text-primary"
        style={{
          background: "rgb(255 255 255 / 1)", // White background
          borderRight: "1px solid rgb(var(--color-border) / 1)",
        }}
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between px-4 py-6 border-b"
          style={{ borderColor: "rgb(var(--color-border-muted) / 1)" }}
        >
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: "rgb(var(--color-primary) / 1)",
                  color: "rgb(var(--color-text-inverse) / 1)",
                }}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "rgb(var(--color-primary) / 1)" }}
                >
                  PropertyHub
                </h3>
                <p
                  className="text-xs"
                  style={{ color: "rgb(var(--color-text-muted) / 1)" }}
                >
                  Rental Management
                </p>
              </div>
            </div>
          ) : (
            <div
              className="p-2 rounded-lg mx-auto"
              style={{
                background: "rgb(var(--color-primary) / 1)",
                color: "rgb(var(--color-text-inverse) / 1)",
              }}
            >
              <Building2 className="w-6 h-6" />
            </div>
          )}

          {/* Collapse toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle collapse"
            onClick={() => setCollapsed((c) => !c)}
            className="p-2 rounded-lg hover:shadow-md"
            style={{
              background: "rgb(var(--color-surface) / 0.8)",
              color: "rgb(var(--color-primary) / 1)",
            }}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scroll">
          {navGroups.map((group) => (
            <div key={group.name} className="space-y-2">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                  style={{ color: "rgb(var(--color-text-muted) / 1)" }}
                >
                  {group.name}
                  <motion.div
                    animate={{ rotate: expanded[group.name] ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </motion.div>
                </button>
              )}

              <motion.div
                initial={false}
                animate={{
                  height: expanded[group.name] || collapsed ? "auto" : 0,
                  opacity: expanded[group.name] || collapsed ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center ${
                          collapsed ? "justify-center px-3" : "gap-4 px-4"
                        } py-3 rounded-xl text-sm font-medium transition-all duration-200
                         ${isActive ? "shadow-md" : "hover:shadow-sm"}`
                      }
                      style={({ isActive }) => ({
                        background: isActive
                          ? "linear-gradient(135deg, rgb(var(--color-primary) / 1), rgb(var(--color-primary) / 0.9))"
                          : "rgb(var(--color-surface) / 0.6)",
                        color: isActive
                          ? "rgb(var(--color-text-inverse) / 1)"
                          : "rgb(var(--color-text-secondary) / 1)",
                      })}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </nav>

        {/* FOOTER */}
        <div
          className="px-4 py-4 border-t"
          style={{ borderColor: "rgb(var(--color-border-muted) / 1)" }}
        >
          {!collapsed ? (
            <div className="text-center">
              <p
                className="text-xs font-medium"
                style={{ color: "rgb(var(--color-text-muted) / 1)" }}
              >
                Kenya Property Solutions
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgb(var(--color-text-secondary) / 1)" }}
              >
                v2.0.1
              </p>
            </div>
          ) : (
            <div
              className="w-8 h-8 mx-auto rounded-full flex items-center justify-center"
              style={{ background: "rgb(var(--color-primary) / 0.1)" }}
            >
              <Home
                className="w-4 h-4"
                style={{ color: "rgb(var(--color-primary) / 1)" }}
              />
            </div>
          )}
        </div>
      </motion.aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setMobileOpen(false)}
          className="fixed md:hidden inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}

      <motion.div
        initial={{ x: -320 }}
        animate={{ x: mobileOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed md:hidden top-0 left-0 h-full w-80 z-50 shadow-2xl flex flex-col"
        style={{
          background: "rgb(255 255 255 / 0.98)", // White background for mobile
        }}
      >
        {/* Mobile header */}
        <div
          className="flex items-center justify-between px-6 py-6 border-b"
          style={{ borderColor: "rgb(var(--color-border-muted) / 1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "rgb(var(--color-primary) / 1)",
                color: "rgb(var(--color-text-inverse) / 1)",
              }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3
                className="text-lg font-bold"
                style={{ color: "rgb(var(--color-primary) / 1)" }}
              >
                PropertyHub
              </h3>
              <p
                className="text-xs"
                style={{ color: "rgb(var(--color-text-muted) / 1)" }}
              >
                Mobile Dashboard
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg"
            style={{
              background: "rgb(var(--color-surface) / 0.8)",
              color: "rgb(var(--color-primary) / 1)",
            }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scroll">
          {navGroups.map((group) => (
            <div key={group.name} className="space-y-3">
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg"
                style={{ color: "rgb(var(--color-text-muted) / 1)" }}
              >
                {group.name}
                <motion.div
                  animate={{ rotate: expanded[group.name] ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: expanded[group.name] ? "auto" : 0,
                  opacity: expanded[group.name] ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                      style={({ isActive }) => ({
                        background: isActive
                          ? "rgb(var(--color-primary) / 1)"
                          : "rgb(var(--color-surface) / 0.6)",
                        color: isActive
                          ? "rgb(var(--color-text-inverse) / 1)"
                          : "rgb(var(--color-text-secondary) / 1)",
                      })}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default SideNav;
