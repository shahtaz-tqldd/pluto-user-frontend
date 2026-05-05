import MainHeader from "@/components/navbar/main-header";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  const isCommunityPage = location.pathname === "/";

  return (
    <main className={isCommunityPage ? "min-h-screen bg-[#fbfdff]" : "bg-primary/5 min-h-screen"}>
      <div className={isCommunityPage ? "w-full" : "mx-auto w-full max-w-7xl"}>
        <MainHeader />
        <Outlet />
      </div>
    </main>
  );
};

export default DashboardLayout;
