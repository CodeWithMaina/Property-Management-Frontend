// Layout.tsx
import { Outlet } from "react-router";
import Card from "./Card";
import { SideNav } from "../SideNav";
import { useState } from "react";

export const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex overflow-hidden">
      <SideNav onClose={() => setOpen(false)} />
      <main className="flex-1 overflow-y-auto p-1 md:p-4 bg-black">
        <Card className="min-h-[calc(100vh-2rem)]">
          <Outlet />
        </Card>
      </main>
    </div>
  );
};