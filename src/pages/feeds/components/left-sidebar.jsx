import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Compass,
  MessageSquare,
  UserRound,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

const LeftSideBar = ({ className }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useSelector((state) => state.auth);
  const username =
    user?.username ||
    `${user?.first_name || ""}-${user?.last_name || ""}`
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-") ||
    "my-profile";

  const navItems = [
    {
      id: 2,
      label: "Discover Pets",
      link: "/",
      icon: <Compass size={18} />,
    },
    {
      id: 3,
      label: "My Profile",
      link: `/profile/${username}`,
      icon: <UserRound size={18} />,
    },
    {
      id: 4,
      label: "Messages",
      link: "/",
      icon: <MessageSquare size={18} />,
    },
    {
      id: 5,
      label: "Saved Pets",
      link: "/",
      icon: <Bookmark size={18} />,
    },
    {
      id: 6,
      label: "Trust & Reviews",
      link: "/",
      icon: <ShieldCheck size={18} />,
    },
    {
      id: 7,
      label: "Alerts",
      link: "/",
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

  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "Guest Adopter";
  const role = user ? user.role : "Adopter";
  const profileImage = user?.profile_picture_url;

  return (
    <aside className={cn("hidden xl:block", className)}>
      <div className="sticky top-5 max-h-[calc(100vh-2.5rem)] custom-scrollbar space-y-4 pr-1">
        <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            {profileImage ? (
              <img
                src={profileImage}
                className="h-18 w-18 rounded-3xl border-4 border-white object-cover shadow-sm"
                alt={fullName}
              />
            ) : (
              <div className="flex h-18 w-18 items-center justify-center rounded-3xl border-4 border-white bg-[#d7efe2] text-2xl font-semibold text-primary shadow-sm">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="mt-3 space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">
                {fullName}
              </h2>
              <p className="text-sm capitalize text-slate-500">{role}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <ProfileMetric label="Saved" value="16" />
              <ProfileMetric label="Chats" value="08" />
              <ProfileMetric label="Reviews" value="12" />
            </div>
          </div>
        </section>
        <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.link);

              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "text-primary"
                      : "bg-white/75 text-slate-700 hover:bg-white hover:text-primary"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </section>
      </div>
    </aside>
  );
};

const ProfileMetric = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-[#f7faf8] px-2 py-3">
      <p className="text-sm font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
    </div>
  );
};

export default LeftSideBar;
