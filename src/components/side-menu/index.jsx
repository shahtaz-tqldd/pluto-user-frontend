import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Compass,
  HeartHandshake,
  House,
  MessageSquare,
  PawPrint,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/images/logo.svg";
import { useSelector } from "react-redux";

const SideMenu = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      id: 1,
      label: "Home Feed",
      link: "/",
      icon: <House size={18} />,
    },
    {
      id: 2,
      label: "Discover Pets",
      link: "/",
      icon: <Compass size={18} />,
    },
    {
      id: 3,
      label: "Adoption Requests",
      link: "/",
      icon: <HeartHandshake size={18} />,
    },
    {
      id: 4,
      label: "Messages",
      link: "/",
      icon: <MessageSquare size={18} />,
    },
    {
      id: 4,
      label: "Adopt a pet",
      link: "/feeds",
      icon: <PawPrint size={18} />,
    },
    {
      id: 5,
      label: "Saved Pets",
      link: "/",
      icon: <Bookmark size={18} />,
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

  const { user } = useSelector((state) => state.auth);
  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "Guest Adopter";
  const role = user ? user.role : "Adopter";
  const profileImage = user?.profile_picture_url;

  return (
    <aside className="hidden h-screen w-[290px] min-w-[290px] shrink-0 border-r border-black/5 bg-[linear-gradient(180deg,_rgba(255,255,255,0.94)_0%,_rgba(244,251,247,0.98)_100%)] px-5 py-6 xl:flex xl:flex-col">
      <div className="custom-scrollbar flex-1 overflow-y-auto pr-1">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} className="h-11 w-11" alt="Pawpal Logo" />
            <div>
              <h2 className="text-lg font-semibold text-primary">pawpal</h2>
              <p className="text-xs text-slate-500">rescue social feed</p>
            </div>
          </Link>

          <div className="overflow-hidden rounded-[28px] border border-primary/10 bg-white shadow-[0_18px_45px_rgba(2,24,19,0.08)]">
            <div className="h-22 bg-[radial-gradient(circle_at_top_left,_rgba(0,79,59,0.45),_transparent_48%),linear-gradient(135deg,_#0b3f34,_#1c6a55)]" />

            <div className="-mt-9 px-4 pb-4">
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
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.link);

              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-[0_14px_34px_rgba(0,79,59,0.22)]"
                      : "bg-white/75 text-slate-700 hover:bg-white hover:text-primary"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="rounded-[28px] border border-primary/10 bg-[#f6fbf8] p-4">
            <div className="mb-3 inline-flex rounded-2xl bg-primary/8 p-2 text-primary">
              <Sparkles size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Adoption Momentum
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Complete your profile and keep conversation response times fast to
              build trust with rescuers.
            </p>
          </div>
        </div>
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

export default SideMenu;
