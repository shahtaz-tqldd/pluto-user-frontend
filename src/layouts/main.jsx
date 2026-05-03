import MainHeader from "@/components/navbar/main-header";
import SideMenu from "@/components/side-menu";
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <main className="bg-primary/5 min-h-screen">
      <div className="mx-auto w-full max-w-7xl">
        <MainHeader/>
        <Outlet />
      </div>
    </main>
  );
};

export default DashboardLayout;
