import SideMenu from "@/components/side-menu";
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <main className="bg-primary/10 min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <Outlet />
      </div>
    </main>
  );
};

export default DashboardLayout;
