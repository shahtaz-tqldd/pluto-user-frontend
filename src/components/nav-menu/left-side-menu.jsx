import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Bookmark,
  House,
  MessageSquare,
  PawPrint,
  Settings,
  Sparkles,
} from "lucide-react";

const LeftSideMenu = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      id: 1,
      label: "Paw Feed",
      link: "/",
      icon: <House size={18} />,
    },
    {
      id: 2,
      label: "Adopt Pets",
      link: "/feeds",
      icon: <PawPrint size={18} />,
    },
    {
      id: 3,
      label: "Messages",
      link: "/chat",
      icon: <MessageSquare size={18} />,
    },
    {
      id: 5,
      label: "Saved Pets",
      link: "/saved-pets",
      icon: <Bookmark size={18} />,
    },
    {
      id: 7,
      label: "Alerts",
      link: "/alerts",
      icon: <Bell size={18} />,
    },
    {
      id: 8,
      label: "Settings",
      link: "/settings",
      icon: <Settings size={18} />,
    },
  ];

  const isActiveRoute = (link) => {
    if (link === "/") {
      return pathname === "/";
    }

    return pathname === link || pathname.startsWith(`${link}/`);
  };

  const totalRescued = 200;

  return (
    <div className="w-[300px] p-6 h-screen border-r border-primary/10 sticky top-0 flex flex-col justify-between">
      <div className="space-y-6">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Pawpal home feed"
        >
          <img src="/favicon.png" className="size-8 shrink-0" alt="" />
          <span className="hidden min-w-0 sm:block">
            <span className="block pt-1 truncate text-2xl logo-font font-bold text-primary">
              Pawpal
            </span>
          </span>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.link);

            return (
              <Link
                key={item.id}
                to={item.link}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive ? "text-primary" : "hover:text-primary"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <section className="p-4 border border-primary/10 rounded-xl flx gap-3">
        <Sparkles size={40} strokeWidth={1.5} className="text-primary" />
        <article className="">
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {totalRescued}+
          </p>
          <p className=" text-xs text-slate-500">Successful Rescues</p>
        </article>
      </section>
    </div>
  );
};

export default LeftSideMenu;
