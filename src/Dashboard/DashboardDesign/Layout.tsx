// Layout.tsx
import { Outlet } from "react-router";
import Card from "./Card";
import { SideNav } from "../SideNav";
import { useState, useEffect } from "react";
import { Menu, Bell, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isSidebarOpen || !isMobile ? 0 : -280,
        }}
        transition={{ type: "tween", duration: 0.2 }}
        className="fixed md:relative h-screen z-50 md:z-auto shadow-lg md:shadow-none"
      >
        <SideNav onClose={() => setIsSidebarOpen(false)} />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with toggle button */}
        <header className="bg-surface border-b border-border py-3 px-5 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-text-secondary hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search bar */}
            <div className="ml-4 relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 text-sm rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-text-secondary" />
            </button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                <span className="text-sm font-medium text-primary">AD</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-text-primary">Admin User</p>
                <p className="text-xs text-text-secondary">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-hidden p-5 bg-background">
          <Card className="h-full overflow-y-auto">
            <Outlet />
          </Card>
        </main>
      </div>
    </div>
  );
};