import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Bookmark,
  MessageSquare,
  UserRound,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import { cn, fallbackValue, getInitials } from "@/lib/utils";

const LeftSideBar = ({ className }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    {
      id: 1,
      label: "My Profile",
      link: `/profile/${user?.username || "my-profile"}`,
      icon: <UserRound size={18} />,
    },
    {
      id: 2,
      label: "Messages",
      link: "/",
      icon: <MessageSquare size={18} />,
    },
    {
      id: 3,
      label: "Saved Pets",
      link: "/",
      icon: <Bookmark size={18} />,
    },
    {
      id: 4,
      label: "Alerts",
      link: "/",
      icon: <Bell size={18} />,
    },
    {
      id: 5,
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

  const fullName = fallbackValue(
    user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
    "Guest User",
  );
  const role = fallbackValue(user?.role, "Adopter").toLowerCase();
  const profileImage = user?.avatar;
  const coverImage = user?.cover;
  const bio = fallbackValue(
    user?.bio,
    role === "rescuer"
      ? "Add a short rescue bio to build trust with adopters."
      : "Add a short adopter bio to help rescuers know your care style.",
  );
  const verificationLabel = user?.is_verified ? "Verified" : "Not verified";

  return (
    <aside className={cn("hidden xl:block", className)}>
      <div className="sticky top-5 max-h-[calc(100vh-2.5rem)] custom-scrollbar space-y-4 pr-1">
        <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white">
          <div className="relative h-24 overflow-hidden bg-[#edf7f1]">
            {coverImage ? (
              <img
                src={coverImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_18%_20%,rgba(255,214,107,0.5),transparent_32%),linear-gradient(135deg,rgba(0,79,59,0.96),rgba(19,129,91,0.82),rgba(255,248,240,0.92))]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-slate-950/10 to-transparent" />
          </div>

          <div className="-mt-10 border-b border-slate-100 px-5 pb-5">
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  className="h-20 w-20 rounded-3xl border-4 border-white object-cover shadow-sm"
                  alt={fullName}
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-[#d7efe2] text-2xl font-semibold text-primary shadow-sm">
                  {getInitials(fullName)}
                </div>
              )}

              <span className="absolute left-[4.25rem] top-2 inline-flex items-center gap-1 rounded-full border border-white bg-white/95 px-2.5 py-1 text-[11px] font-semibold capitalize text-primary shadow-sm">
                <ShieldCheck className="size-3" />
                {verificationLabel}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div>
                <h2 className="text-lg font-semibold leading-tight text-slate-900">
                  {fullName}
                </h2>
                <p className="mt-1 text-sm capitalize text-primary">{role}</p>
              </div>

              <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                {bio}
              </p>
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

const ProfileDetail = ({ icon, value }) => {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-primary/70">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
};

export default LeftSideBar;
