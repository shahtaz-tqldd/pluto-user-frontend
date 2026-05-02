import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Bookmark,
  ChevronDown,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import logo from "@/assets/images/logo.svg";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userLoggedOut } from "@/features/auth/authSlice";
import { cn, fallbackValue, getInitials } from "@/lib/utils";

const filterGroups = [
  {
    id: "petType",
    label: "Pets",
    options: [
      { value: "all", label: "Any pet" },
      { value: "Cat", label: "Cat" },
      { value: "Dog", label: "Dog" },
      { value: "Rabbit", label: "Rabbit" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    id: "size",
    label: "Size",
    options: [
      { value: "all", label: "Any size" },
      { value: "Small", label: "Small" },
      { value: "Medium", label: "Medium" },
      { value: "Large", label: "Large" },
    ],
  },
  {
    id: "location",
    label: "Location",
    options: [
      { value: "nearby", label: "Nearby" },
      { value: "anywhere", label: "Anywhere" },
    ],
  },
  {
    id: "color",
    label: "Color",
    options: [
      { value: "all", label: "Any color" },
      { value: "Black", label: "Black" },
      { value: "White", label: "White" },
    ],
  },
];

const FeedHeader = ({
  searchTerm,
  setSearchTerm,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const fullName = fallbackValue(
    user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
    "Guest User",
  );
  const role = fallbackValue(user?.role, "Adopter");
  const profileImage = user?.avatar || user?.profile_picture_url;
  const profilePath = `/profile/${user?.username || "my-profile"}`;
  const activeFilterCount = [
    filters.petType !== "all",
    filters.size !== "all",
    filters.location !== "anywhere",
    filters.color !== "all",
  ].filter(Boolean).length;

  const handleLogout = () => {
    dispatch(userLoggedOut());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 -mx-1 border-b border-primary/10 bg-[#f8fbf7]/95 px-1 py-3 backdrop-blur md:static md:mx-0 md:rounded-3xl md:border md:bg-white md:px-4 md:py-4 md:shadow-[0_14px_42px_rgba(2,24,19,0.05)]">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 lg:grid-cols-[minmax(190px,1fr)_minmax(320px,560px)_minmax(160px,1fr)]">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Pawpal home feed"
        >
          <img src={logo} className="size-10 shrink-0" alt="" />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold leading-tight text-primary">
              pawpal
            </h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              rescue social feed
            </p>
          </div>
        </Link>

        <div className="order-3 col-span-2 flex min-w-0 items-center gap-2 lg:order-none lg:col-span-1">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search feed</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary/55" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search pets, breeds, or places"
              className="h-11 rounded-full border-primary/15 bg-[#fcfdfb] pl-11 pr-4 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </label>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-white text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
                  activeFilterCount > 0 && "border-primary bg-primary text-white",
                )}
                aria-label="Open feed filters"
              >
                <SlidersHorizontal className="size-5" />
                {activeFilterCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#ffd66b] text-[11px] font-bold text-primary">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[min(calc(100vw-2rem),22rem)] rounded-2xl border-primary/10 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.14)]"
            >
              <div className="flex items-center justify-between gap-3 px-1 pb-2">
                <DropdownMenuLabel className="px-0 py-0 text-sm font-semibold text-slate-900">
                  Feed filters
                </DropdownMenuLabel>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-3">
                {filterGroups.map((group) => (
                  <div key={group.id} className="space-y-1">
                    <DropdownMenuLabel className="px-1 py-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {group.label}
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={filters[group.id]}
                      onValueChange={(value) => onFilterChange(group.id, value)}
                      className="grid grid-cols-2 gap-1"
                    >
                      {group.options.map((option) => (
                        <DropdownMenuRadioItem
                          key={option.value}
                          value={option.value}
                          className="rounded-xl px-3 py-2 pl-8 text-sm text-slate-700 focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold data-[state=checked]:text-primary"
                        >
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex max-w-[12rem] items-center gap-2 rounded-full border border-primary/10 bg-white p-1.5 pr-2.5 text-left transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                aria-label="Open profile menu"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    className="size-9 rounded-full object-cover"
                    alt=""
                  />
                ) : (
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#d7efe2] text-sm font-semibold text-primary">
                    {getInitials(fullName)}
                  </span>
                )}
                <span className="hidden min-w-0 sm:block">
                  <span className="block truncate text-sm font-semibold leading-tight text-slate-900">
                    {fullName}
                  </span>
                  <span className="block truncate text-xs capitalize text-slate-500">
                    {role}
                  </span>
                </span>
                <ChevronDown className="hidden size-4 shrink-0 text-slate-400 sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 rounded-2xl border-primary/10 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.14)]"
            >
              <DropdownMenuLabel className="flex items-center gap-3 rounded-xl bg-[#f4fbf7] p-3">
                {profileImage ? (
                  <img
                    src={profileImage}
                    className="size-11 rounded-full object-cover"
                    alt=""
                  />
                ) : (
                  <span className="flex size-11 items-center justify-center rounded-full bg-[#d7efe2] text-sm font-semibold text-primary">
                    {getInitials(fullName)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {fullName}
                  </span>
                  <span className="block truncate text-xs capitalize text-slate-500">
                    {role}
                  </span>
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ProfileMenuItem to={profilePath} icon={<UserRound />}>
                My profile
              </ProfileMenuItem>
              <ProfileMenuItem to="/" icon={<MessageCircle />}>
                Messages
              </ProfileMenuItem>
              <ProfileMenuItem to="/" icon={<Bookmark />}>
                Saved pets
              </ProfileMenuItem>
              <ProfileMenuItem to="/settings" icon={<Settings />}>
                Settings
              </ProfileMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleLogout}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut className="size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

const ProfileMenuItem = ({ to, icon, children }) => (
  <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 text-sm">
    <Link to={to} className="flex items-center gap-2">
      {React.cloneElement(icon, { className: "size-4" })}
      <span>{children}</span>
    </Link>
  </DropdownMenuItem>
);

export default FeedHeader;
