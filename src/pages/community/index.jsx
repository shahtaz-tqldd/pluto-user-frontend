import React from "react";
import {
  Binoculars,
  Bookmark,
  Bot,
  Camera,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Clock,
  Heart,
  HelpCircle,
  Home,
  Info,
  LifeBuoy,
  Map,
  MapPin,
  Megaphone,
  MessageCircle,
  MoreVertical,
  Navigation,
  Package,
  PawPrint,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ThumbsUp,
  Truck,
  UploadCloud,
  User,
  UserPlus,
  Users,
  WandSparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const catImage =
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=520&q=80";
const dogImage =
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=520&q=80";
const dogPortrait =
  "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&w=360&q=80";

const lostPetGallery = [
  {
    src: dogImage,
    alt: "Golden retriever near a lake",
  },
  {
    src: dogPortrait,
    alt: "Golden retriever portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=760&q=80",
    alt: "Golden retriever sitting outdoors",
  },
  {
    src: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=760&q=80",
    alt: "Golden retriever on grass",
  },
];

const tagPillClass = "bg-slate-100 text-slate-700";

const communityLinks = [
  { label: "All posts", icon: Home, active: true },
  { label: "Urgent rescue", icon: LifeBuoy, count: 12, tone: "red" },
  { label: "Lost & found", icon: MapPin, count: 8, tone: "blue" },
  { label: "Adoption", icon: Heart, count: 23, tone: "green" },
  { label: "Medical help", icon: Stethoscope },
  { label: "Foster needed", icon: Users, count: 15, tone: "purple" },
  { label: "Supplies & donations", icon: Sparkles },
  { label: "Success stories", icon: ShieldCheck },
];

const postTypes = [
  { label: "Questions", icon: CheckCircle2 },
  { label: "Updates", icon: Megaphone },
  { label: "Rescue alert", icon: Info },
  { label: "Advice", icon: MessageCircle },
];

const rescueStats = [
  {
    value: 18,
    label: "Open rescue requests",
    detail: "Needs help now",
    icon: LifeBuoy,
    className: "bg-orange-100 text-primary",
  },
  {
    value: 142,
    label: "Verified rescuers online",
    detail: "Active in last 24h",
    icon: Users,
    className: "bg-emerald-100 text-emerald-700",
  },
  {
    value: 37,
    label: "Pets rehomed this week",
    detail: "New happy tails",
    icon: PawPrint,
    className: "bg-blue-100 text-blue-700",
  },
  {
    value: 126,
    label: "Posts resolved",
    detail: "In the last 7 days",
    icon: CheckCircle2,
    className: "bg-violet-100 text-violet-700",
  },
];

const createActions = [
  { id: "help", label: "Need Help", icon: LifeBuoy, className: "text-primary" },
  { id: "lost", label: "Lost Pet", icon: MapPin, className: "text-blue-700" },
  { id: "found", label: "Found Pet", icon: Users, className: "text-emerald-700" },
  { id: "discussion", label: "Discussion", icon: Users, className: "text-blue-700" },
];

const helpOptions = [
  { id: "rescue", label: "Rescue", icon: LifeBuoy },
  { id: "medical", label: "Medical", icon: Stethoscope },
  { id: "foster", label: "Foster", icon: Home },
  { id: "transport", label: "Transport", icon: Truck },
  { id: "supplies", label: "Supplies", icon: Package },
];

const posts = [
  {
    id: 1,
    author: "Sadia Akter",
    initials: "SA",
    verified: true,
    time: "2h ago",
    location: "Dhanmondi, Dhaka",
    badge: "Urgent Foster",
    badgeClass: "bg-red-50 text-red-600",
    title: "Injured kitten needs temporary foster in Dhanmondi",
    body: "Found a kitten hit by a car near Dhanmondi 15. Leg injury but stable. Looking for a quiet foster home and vet support for the next 48-72 hours.",
    image: catImage,
    chips: [
      { label: "Cat", className: "bg-slate-100 text-slate-700", icon: PawPrint },
      { label: "Injury", className: "bg-amber-100 text-amber-700", icon: Stethoscope },
      { label: "Dhanmondi 15", className: "bg-green-100 text-green-700", icon: MapPin },
      { label: "Needs Foster", className: "bg-red-100 text-red-700", icon: Heart },
    ],
    helpful: 24,
  },
  {
    id: 2,
    author: "Rashed Khan",
    initials: "RK",
    verified: true,
    time: "4h ago",
    location: "Banani, Dhaka",
    badge: "Lost & Found",
    badgeClass: "bg-amber-50 text-amber-700",
    title: "Friendly dog found near Banani Lake",
    body: "Golden retriever found around Banani Lake at 9:30 AM. Very friendly, wearing a blue collar. Looking for the owner.",
    image: dogImage,
    chips: [
      { label: "Dog", className: "bg-slate-100 text-slate-700", icon: PawPrint },
      { label: "Blue collar", className: "bg-blue-100 text-blue-700", icon: ShieldCheck },
      { label: "Banani Lake", className: "bg-green-100 text-green-700", icon: MapPin },
    ],
    helpful: 18,
  },
];

const trendingTopics = [
  ["#urgent-foster", 236],
  ["#lostfound", 184],
  ["#adoption", 142],
  ["#vet-help", 98],
  ["#dogrescue", 76],
];

const checklist = [
  "Include exact location",
  "Describe pet's condition clearly",
  "Mention urgency level",
  "Add photos (if possible)",
  "Include contact details",
];

const sadiaComments = [
  {
    id: "comment-1",
    author: "Nadia Rahman",
    initials: "NR",
    badge: "Vet volunteer",
    time: "18 min ago",
    score: 42,
    body: "Keep her in a small box or carrier with a towel, and avoid touching the injured leg. If she is breathing normally, quiet and warm is the safest first step until transport is ready.",
    replies: [
      {
        id: "reply-1",
        author: "Sadia Akter",
        initials: "SA",
        badge: "Original poster",
        time: "12 min ago",
        body: "Got it. I have her in a box now and she is calmer. I can meet near Dhanmondi 15 if someone can help with transport.",
      },
    ],
  },
  {
    id: "comment-2",
    author: "Arif Chowdhury",
    initials: "AC",
    badge: "Nearby rescuer",
    time: "9 min ago",
    score: 31,
    body: "I am 10 minutes away with a carrier. I can take her to the vet, but I need someone to confirm a foster spot after the checkup.",
    replies: [
      {
        id: "reply-2",
        author: "Rima Sultana",
        initials: "RS",
        badge: "Foster offer",
        time: "6 min ago",
        body: "I can keep her tonight in a quiet room. Please send me the vet update and food instructions after the visit.",
      },
    ],
  },
  {
    id: "comment-3",
    author: "Tanvir Hossain",
    initials: "TH",
    badge: "Supplies",
    time: "4 min ago",
    score: 18,
    body: "I can drop off wet food, pads, and a soft towel around 7 PM. Marking this so others know supplies are covered.",
    replies: [],
  },
];

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fbf7] px-4 py-4 text-slate-900 sm:px-5">
      <div className="mx-auto grid w-full max-w-[1820px] grid-cols-1 items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <CommunitySidebar />

        <div className="min-w-0">
          <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
            <main className="min-w-0 space-y-5">
              <CommunityIntroHeader />
              <CreatePost />
              <PublishedLostPetPost />
              <div className="space-y-4">
                {posts.map((post) => (
                  <CommunityPost key={post.id} post={post} />
                ))}
              </div>
            </main>

            <CommunityRightRail />
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunitySidebar = () => (
  <aside className="custom-scrollbar hidden space-y-4 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_18px_48px_rgba(2,24,19,0.06)]">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="mb-3 inline-flex rounded-2xl bg-primary/8 p-2 text-primary">
            <Users className="size-4" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Community
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Rescue posts, local help, and updates
          </p>
        </div>

        <nav className="space-y-2 px-5 py-5">
          {communityLinks.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
                  item.active
                    ? "bg-primary text-white shadow-[0_14px_34px_rgba(209,70,28,0.18)]"
                    : "bg-[#fcfdfb] text-slate-700 hover:bg-primary/5 hover:text-primary",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.count ? (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      item.active ? "bg-white/20 text-white" : tagPillClass,
                    )}
                  >
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_18px_48px_rgba(2,24,19,0.06)]">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="mb-3 inline-flex rounded-2xl bg-[#fff4c7] p-2 text-[#8a5b00]">
            <MessageCircle className="size-4" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Post Type
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Filter the conversation
          </p>
        </div>

        <div className="space-y-2 px-5 py-5">
          {postTypes.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-3 rounded-2xl bg-[#fcfdfb] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-primary/5 hover:text-primary"
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_18px_48px_rgba(2,24,19,0.06)]">
        <div className="relative aspect-[1.35/1] overflow-hidden bg-gradient-to-br from-primary/8 to-orange-50 p-5">
          <div className="max-w-[9.75rem]">
            <div className="mb-3 inline-flex rounded-2xl bg-primary/8 p-2 text-primary">
              <ShieldCheck className="size-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Make a bigger impact
            </h3>
            <p className="mt-3 text-sm leading-5 text-slate-600">
              Verify your profile to build trust and help more pets.
            </p>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(209,70,28,0.28)]"
            >
              <ShieldCheck className="size-4" />
              Verify now
            </button>
          </div>
          <img
            src={dogPortrait}
            alt=""
            className="absolute -bottom-2 right-2 h-32 w-24 rounded-[1.6rem] object-cover"
          />
        </div>
      </section>
    </div>
  </aside>
);

const CommunityIntroHeader = () => (
  <section className="relative mx-auto max-w-[860px] overflow-hidden rounded-[24px] border border-orange-100 bg-white px-5 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.045)] sm:px-7 sm:py-6">
    <div className="absolute -right-12 -top-20 h-32 w-48 rounded-bl-[5rem] rounded-br-[7rem] bg-orange-50" />
    <div className="absolute -bottom-24 right-0 h-32 w-64 rounded-tl-[6rem] bg-emerald-50" />

    <div className="relative z-10">
      <h1 className="max-w-3xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl xl:text-4xl">
        Find help, share updates, bring pets home.
      </h1>

      <div className="mt-5 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <DoodleTile tone="orange" step={1} icon={<PawPrint className="size-11 fill-current" />} />
        <DoodleArrow step={1} />
        <DoodleTile tone="blue" step={2} icon={<MapPin className="size-12" />} />
        <DoodleArrow step={2} />
        <DoodleTile tone="green" step={3} icon={<MessageCircle className="size-12" />} />
        <DoodleArrow step={3} />
        <DoodleTile tone="emerald" step={4} icon={<Home className="size-12" />} heart />
      </div>
    </div>
  </section>
);

const DoodleTile = ({ tone, icon, step, heart = false }) => (
  <div
    className={cn(
      "pawpal-doodle-tile relative mx-auto flex h-20 w-full max-w-[8rem] items-center justify-center rounded-[1.25rem] bg-white/70",
      step === 1 && "pawpal-doodle-step-1",
      step === 2 && "pawpal-doodle-step-2",
      step === 3 && "pawpal-doodle-step-3",
      step === 4 && "pawpal-doodle-step-4",
      tone === "orange" && "text-primary",
      tone === "blue" && "text-blue-600",
      tone === "green" && "text-emerald-600",
      tone === "emerald" && "text-emerald-700",
    )}
  >
    <span className="opacity-95 [filter:drop-shadow(0_12px_0_rgba(15,23,42,0.04))]">
      {icon}
    </span>
    {heart ? (
      <Heart className="pawpal-doodle-heart absolute size-7 text-primary" />
    ) : null}
  </div>
);

const DoodleArrow = ({ step }) => (
  <div className="hidden items-center justify-center sm:flex">
    <span
      className={cn(
        "pawpal-doodle-line h-1 w-9 rounded-full border-t-2 border-dashed border-orange-200",
        step === 1 && "pawpal-doodle-step-1",
        step === 2 && "pawpal-doodle-step-2",
        step === 3 && "pawpal-doodle-step-3",
      )}
    />
    <span
      className={cn(
        "pawpal-doodle-arrowhead -ml-2 size-3 rotate-45 border-r-2 border-t-2 border-orange-300",
        step === 1 && "pawpal-doodle-step-1",
        step === 2 && "pawpal-doodle-step-2",
        step === 3 && "pawpal-doodle-step-3",
      )}
    />
  </div>
);

const CreatePost = () => {
  const [activeType, setActiveType] = React.useState("");
  const [helpType, setHelpType] = React.useState("");
  const [isHelpMenuOpen, setIsHelpMenuOpen] = React.useState(false);

  const selectedHelp = helpOptions.find((option) => option.id === helpType);
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_54px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Start a post
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {activeType === "lost"
              ? "Share clear details so nearby people can help identify and reunite your pet."
              : activeType === "discussion"
                ? "Ask a question, share advice, or post an update for the community."
                : "Choose what you'd like to share with the community."}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-[0_14px_32px_rgba(209,70,28,0.24)]"
        >
          <Plus className="size-4" />
          New Post
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {createActions.map((action) => {
          const Icon = action.icon;

          if (action.id === "help") {
            return (
              <div key={action.id} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (activeType === "help" && (helpType || isHelpMenuOpen)) {
                      setActiveType("");
                      setHelpType("");
                      setIsHelpMenuOpen(false);
                      return;
                    }

                    setActiveType("help");
                    setIsHelpMenuOpen(true);
                  }}
                  className={cn(
                    "flex h-11 w-full items-center justify-between gap-2 rounded-xl border px-4 text-sm font-bold transition",
                    activeType === "help"
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary/20 hover:bg-primary/5",
                  )}
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <span className="truncate">Need Help</span>
                  </span>
                  <span className="inline-flex min-w-0 items-center gap-1 rounded-lg bg-white/80 px-2 py-1 text-xs text-slate-600">
                    <span className="truncate">
                      {selectedHelp?.label || "Select"}
                    </span>
                    {activeType === "help" && (helpType || isHelpMenuOpen) ? (
                      <ChevronUp className="size-3.5 shrink-0" />
                    ) : (
                      <ChevronDown className="size-3.5 shrink-0" />
                    )}
                  </span>
                </button>

                {isHelpMenuOpen ? (
                  <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                    {helpOptions.map((option) => {
                      const OptionIcon = option.icon;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setActiveType("help");
                            setHelpType(option.id);
                            setIsHelpMenuOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold transition hover:bg-primary/5",
                            helpType === option.id ? "text-primary" : "text-slate-700",
                          )}
                        >
                          <OptionIcon className="size-4" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          }

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                setActiveType((current) => (current === action.id ? "" : action.id));
                setHelpType("");
                setIsHelpMenuOpen(false);
              }}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition",
                activeType === action.id
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/20 hover:bg-primary/5",
              )}
            >
              <Icon className={cn("size-5", activeType === action.id ? "text-primary" : action.className)} />
              <span className="min-w-0 flex-1 truncate text-left">{action.label}</span>
              {activeType === action.id ? (
                <ChevronUp className="size-4 shrink-0" />
              ) : (
                <ChevronDown className="size-4 shrink-0 text-slate-400" />
              )}
            </button>
          );
        })}
      </div>

      {activeType === "help" && helpType ? (
        <NeedHelpFields helpType={helpType} />
      ) : null}

      {activeType === "lost" ? <LostPetFields /> : null}
      {activeType === "found" ? <FoundPetFields /> : null}
      {activeType === "discussion" ? <DiscussionFields /> : null}
    </section>
  );
};

const NeedHelpFields = ({ helpType }) => {
  const helpCopy = {
    rescue: {
      title: "e.g., Cat trapped under car near apartment garage",
      detail: "Describe the rescue scene, safety risks, and whether the pet can be approached.",
      chip: "Needs rescue team",
    },
    medical: {
      title: "e.g., Kitten needs vet check after road injury",
      detail: "Describe symptoms, visible injuries, breathing, eating, and any first aid already given.",
      chip: "Vet follow-up",
    },
    foster: {
      title: "e.g., Injured kitten needs temporary foster",
      detail: "Describe what happened in detail...",
      chip: "Temporary foster",
    },
    transport: {
      title: "e.g., Need transport from Dhanmondi to vet clinic",
      detail: "Share pickup/dropoff areas, timing, crate status, and whether an escort is available.",
      chip: "Transport needed",
    },
    supplies: {
      title: "e.g., Need kitten food, litter, and basic medicine",
      detail: "List items needed, quantity, urgency, and pickup/dropoff options.",
      chip: "Supplies needed",
    },
  };
  const copy = helpCopy[helpType] || helpCopy.foster;

  return (
    <div className="relative z-10 mt-5 space-y-4 rounded-[28px] border border-primary/10 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.1)] ring-1 ring-primary/5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)_minmax(0,0.75fr)]">
        <Field label="1. Title" placeholder={copy.title} required />
        <SelectField label="2. Pet type" value="Cat" />
        <SelectField label="3. Urgency" value="Urgent" tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="4. Location" placeholder="Enter city, area, or full address" icon={<Navigation className="size-4" />} />
        <Field label="5. What happened?" placeholder={copy.detail} />
      </div>

      {helpType === "transport" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="6. Pickup area" placeholder="e.g., Dhanmondi 15" />
          <Field label="7. Dropoff area" placeholder="e.g., Vet clinic in Banani" />
          <Field label="8. Time window" placeholder="Today, 5 PM - 8 PM" icon={<Clock className="size-4" />} />
        </div>
      ) : helpType === "supplies" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="6. Needed items" placeholder="Food, litter, medicine, crate..." />
          <Field label="7. Quantity" placeholder="e.g., 2kg food, one crate" />
          <SelectField label="8. Delivery method" value="Pickup or drop-off" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1fr)]">
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              6. What help is needed?
            </label>
            <div className="flex flex-wrap gap-2">
              {[copy.chip, "Vet follow-up", "Quiet indoor space"].map((chip) => (
                <span
                  key={chip}
                  className={cn("inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold", tagPillClass)}
                >
                  {chip}
                  <X className="size-3" />
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              7. Pet condition
            </label>
            <div className="flex flex-wrap gap-2">
              {["Stable", "Needs care", "Critical"].map((condition) => (
                <span
                  key={condition}
                  className={cn("inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold", tagPillClass)}
                >
                  <Heart className="size-3" />
                  {condition}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField label="8. Contact method" value="Phone call" />
            <Field label="Phone number" placeholder="+1 555-123-4567" />
          </div>
        </div>
      )}

      <PhotoPicker title="9. Add photos (up to 5)" images={[catImage, "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=280&q=80"]} />

      <FormFooter
        tip="The more details you provide, the faster the right people can help."
        actionLabel="Post Request"
      />
    </div>
  );
};

const LostPetFields = () => (
  <div className="mt-5 space-y-4">
    <div className="grid gap-4 lg:grid-cols-2">
      <Field label="1. Pet name" placeholder="Milo" required />
      <SelectField label="2. Pet type" value="Dog" required />
      <Field label="3. Breed / color / key features" placeholder="Golden Retriever, golden coat, blue collar, friendly" />
      <Field label="4. Last seen location" placeholder="Banani Lake, Road 12, Dhaka" required />
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      <Field label="5. Date & time" placeholder="May 18, 2025" icon={<Clock className="size-4" />} />
      <Field label="Time" placeholder="6:30 PM" icon={<Clock className="size-4" />} />
      <Field label="6. Identifying details" placeholder="Blue collar with name tag 'Milo' and phone number" />
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      <SelectField label="7. Contact method" value="Phone" required />
      <Field label="Phone number" placeholder="+880 1712 345678" />
      <PhotoPicker title="8. Add photos" images={[dogImage, dogPortrait]} compact />
    </div>
    <FormFooter
      tip="Include clear photos and accurate details to increase the chances of a safe reunion."
      actionLabel="Post Lost Pet Report"
    />
  </div>
);

const FoundPetFields = () => (
  <div className="mt-5 space-y-4">
    <div className="grid gap-4 lg:grid-cols-2">
      <Field label="1. Pet description" placeholder="Golden retriever with blue collar" required />
      <Field label="2. Found location" placeholder="Banani Lake, Dhaka" required />
      <SelectField label="3. Current safety status" value="Safe with me" />
      <Field label="4. Contact details" placeholder="Phone or WhatsApp number" />
    </div>
    <TextAreaField label="5. More details" placeholder="Share behavior, collar/tag details, photos, and pickup requirements." />
    <PhotoPicker title="6. Add photos" images={[dogImage]} compact />
    <FormFooter tip="Found pet posts should include safe handoff details." actionLabel="Post Found Pet" />
  </div>
);

const DiscussionFields = () => (
  <div className="mt-5">
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      {[
        { label: "Question", icon: <HelpCircle className="size-4" /> },
        { label: "Advice", icon: <Stethoscope className="size-4" /> },
        { label: "Community Update", icon: <Megaphone className="size-4" /> },
      ].map((item) => (
        <button
          key={item.label}
          type="button"
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-bold",
            item.label === "Question"
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-slate-600",
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-4">
        <Field label="1. Post title" placeholder="Keep it short and clear" />
        <TextAreaField label="2. Write your message" placeholder="Share details, ask your question, or write your update..." />
        <Field label="5. Add tags (optional)" placeholder="Add up to 5 tags (e.g., vaccines, kitten care, adoption)" />
      </div>
      <div className="space-y-4">
        <PhotoPicker title="3. Optional photo (up to 5)" images={[]} compact />
        <Field label="4. Optional location" placeholder="Add location (e.g., Dhaka)" icon={<MapPin className="size-4" />} />
      </div>
    </div>
    <FormFooter tip="Be kind and respectful. Follow our Community Guidelines." actionLabel="Post Discussion" />
  </div>
);

const Field = ({ label, placeholder, icon, required = false }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold text-slate-700">
      {label}
      {required ? <span className="text-primary"> *</span> : null}
    </span>
    <span className="relative block">
      {icon ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      ) : null}
      <input
        aria-label={placeholder || label}
        placeholder=""
        className={cn(
          "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:ring-4 focus:ring-primary/10",
          icon && "pr-10",
        )}
      />
    </span>
  </label>
);

const SelectField = ({ label, value, tone, required = false }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold text-slate-700">
      {label}
      {required ? <span className="text-primary"> *</span> : null}
    </span>
    <button
      type="button"
      className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-left text-sm font-semibold text-slate-700"
    >
      <span className={cn(tone === "danger" && "inline-flex items-center gap-2 text-primary")}>
        {tone === "danger" ? <Info className="size-4 fill-current" /> : null}
        {value}
      </span>
      <ChevronDown className="size-4 text-slate-400" />
    </button>
  </label>
);

const TextAreaField = ({ label, placeholder }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold text-slate-700">
      {label}
    </span>
    <textarea
      rows={4}
      aria-label={placeholder || label}
      placeholder=""
      className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-medium leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
    />
  </label>
);

const PhotoPicker = ({ title, images = [], compact = false }) => (
  <div>
    <label className="mb-2 block text-xs font-bold text-slate-700">
      {title}
    </label>
    <div className="flex flex-wrap gap-3">
      {images.map((image) => (
        <div
          key={image}
          className={cn(
            "relative overflow-hidden rounded-xl border border-slate-200",
            compact ? "size-24" : "size-22 sm:size-24",
          )}
        >
          <img src={image} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-white/90 text-slate-500"
            aria-label="Remove photo"
          >
            <X className="size-3" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-bold text-blue-700",
          compact ? "size-24" : "size-22 sm:size-24",
        )}
      >
        <Camera className="mb-1 size-5" />
        Add more
      </button>
    </div>
  </div>
);

const FormFooter = ({ tip, actionLabel }) => (
  <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
    <p className="inline-flex items-center gap-2 text-xs font-medium text-blue-700">
      <ShieldCheck className="size-4" />
      Tip: {tip}
    </p>
    <div className="flex gap-3">
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-7 text-sm font-bold text-slate-700"
      >
        Save Draft
      </button>
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-3 rounded-lg bg-primary px-7 text-sm font-bold text-white shadow-[0_12px_26px_rgba(209,70,28,0.22)]"
      >
        {actionLabel}
        <ChevronDown className="size-4 -rotate-90" />
      </button>
    </div>
  </div>
);

const PublishedLostPetPost = () => {
  const [activePhoto, setActivePhoto] = React.useState(0);
  const [isSightingOpen, setIsSightingOpen] = React.useState(false);
  const [hasReportedSighting, setHasReportedSighting] = React.useState(false);
  const currentPhoto = lostPetGallery[activePhoto];

  const goToPreviousPhoto = () => {
    setActivePhoto((current) => (current === 0 ? lostPetGallery.length - 1 : current - 1));
  };

  const goToNextPhoto = () => {
    setActivePhoto((current) => (current === lostPetGallery.length - 1 ? 0 : current + 1));
  };

  return (
    <>
    <article className="mx-auto max-w-[900px] overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.085)]">
      <div className="grid items-start lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]">
        <div className="relative aspect-[4/5] min-h-[18rem] overflow-hidden bg-orange-50 lg:min-h-0">
          <img
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={goToPreviousPhoto}
            className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
            aria-label="Previous pet photo"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={goToNextPhoto}
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
            aria-label="Next pet photo"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
            {lostPetGallery.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setActivePhoto(index)}
                className={cn(
                  "h-14 flex-1 overflow-hidden rounded-xl border-[2px] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.14)] transition",
                  activePhoto === index ? "border-white ring-2 ring-primary" : "border-white/80 opacity-80",
                )}
                aria-label={`Show pet photo ${index + 1}`}
              >
                <img src={photo.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 py-5 sm:px-7 lg:px-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary">
            <PawPrint className="size-4" />
            Lost Pet
          </span>

          <p className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span>Posted by Mahboob Rabin</span>
            <span className="text-primary">•</span>
            <span>Banani Lake, Dhaka</span>
            <span className="text-primary">•</span>
            <span>Just now</span>
          </p>

          <h2 className="mt-4 max-w-xl text-2xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-3xl xl:text-4xl">
            Lost golden retriever near Banani Lake
          </h2>

          <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-slate-500">
            Milo went missing near Banani Lake around 9:30 AM, friendly,
            wearing a blue collar.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-slate-950">
            {["Milo", "Golden Retriever", "Blue collar", "Friendly", "9:30 AM"].map((detail, index) => (
              <React.Fragment key={detail}>
                {index > 0 ? <span className="text-primary">•</span> : null}
                <span>{detail}</span>
              </React.Fragment>
            ))}
          </div>

          <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-primary/8 px-3.5 py-2 text-xs font-bold text-primary">
            <Heart className="size-4" />
            Responds to name Milo
          </span>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setIsSightingOpen(true)}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition",
              hasReportedSighting
                ? "bg-primary text-white shadow-[0_12px_24px_rgba(209,70,28,0.22)]"
                : "border border-primary/25 bg-white text-primary hover:bg-primary/8",
            )}
          >
            {hasReportedSighting ? (
              <Check className="size-4" />
            ) : (
              <Binoculars className="size-4" />
            )}
            {hasReportedSighting ? "Sighting sent" : "I spotted this pet"}
          </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-white px-3 text-sm font-bold text-primary"
            >
              <MessageCircle className="size-4" />
              Message owner
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
            <button type="button" className="inline-flex items-center gap-2">
              <Share2 className="size-4" />
              Share
            </button>
            <button type="button" className="inline-flex items-center gap-2">
              <Bookmark className="size-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </article>
    {isSightingOpen ? (
      <SightingModal
        onClose={() => setIsSightingOpen(false)}
        onSubmit={() => {
          setHasReportedSighting(true);
          setIsSightingOpen(false);
        }}
      />
    ) : null}
    </>
  );
};

const SightingModal = ({ onClose, onSubmit }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
    <div className="max-h-[calc(100vh-2rem)] w-full max-w-[760px] overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.3)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Report a sighting
          </h2>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            Share where and when you saw Milo. This will notify the owner right away.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close sighting form"
        >
          <X className="size-6" />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
        <img
          src={lostPetGallery[0].src}
          alt=""
          className="size-[4.5rem] shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-950">
            Milo • Golden Retriever
          </p>
          <span className="mt-2 inline-flex rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            Lost Pet
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <SightingStep number="1" label="Where did you see Milo?">
          <label className="relative block">
            <MapPin className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
            <input
              placeholder="Add location or landmark"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-12 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
            />
          </label>
        </SightingStep>

        <SightingStep number="2" label="When did you see Milo?">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="flex h-12 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-500"
            >
              <span className="inline-flex items-center gap-3">
                <Calendar className="size-5" />
                Select date
              </span>
              <ChevronDown className="size-4" />
            </button>
            <button
              type="button"
              className="flex h-12 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-500"
            >
              <span className="inline-flex items-center gap-3">
                <Clock className="size-5" />
                Select time
              </span>
              <ChevronDown className="size-4" />
            </button>
          </div>
        </SightingStep>

        <SightingStep number="3" label="What was Milo doing?">
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Walking", icon: Navigation },
              { label: "Resting", icon: Clock },
              { label: "Running", icon: Sparkles },
              { label: "With someone", icon: User },
              { label: "Not sure", icon: HelpCircle },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-600 transition hover:bg-primary/8 hover:text-primary"
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </SightingStep>

        <SightingStep number="4" label="Add photo (optional)">
          <button
            type="button"
            className="flex min-h-16 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-center text-sm font-semibold text-slate-500"
          >
            <UploadCloud className="mb-1 size-5 text-slate-500" />
            <span>
              <strong className="text-slate-700">Click to upload</strong> or drag and drop
            </span>
            <span className="text-xs">JPG, PNG up to 10MB</span>
          </button>
        </SightingStep>

        <SightingStep number="5" label="Extra note (optional)">
          <label className="block">
            <textarea
              rows={3}
              placeholder="Any details that may help the owner"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
            />
            <span className="-mt-7 mr-4 block text-right text-xs font-semibold text-slate-400">
              0/300
            </span>
          </label>
        </SightingStep>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
        <Info className="size-5 shrink-0" />
        Your sighting will be sent to the owner and added to the report timeline.
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="h-12 rounded-xl bg-primary text-sm font-bold text-white shadow-[0_14px_30px_rgba(209,70,28,0.25)]"
        >
          Send Sighting
        </button>
      </div>
    </div>
  </div>
);

const SightingStep = ({ number, label, children }) => (
  <section>
    <h3 className="mb-2 flex items-center gap-3 text-sm font-bold text-slate-700">
      <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
        {number}
      </span>
      {label}
    </h3>
    {children}
  </section>
);

const CommunityPost = ({ post }) => {
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);
  const hasThreadedComments = post.id === 1;

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_54px_rgba(15,23,42,0.05)]">
      <div className="flex gap-4">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full text-base font-bold",
            post.id === 1 ? "bg-orange-100 text-primary" : "bg-emerald-100 text-emerald-700",
          )}
        >
          {post.initials}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-slate-950">{post.author}</h3>
            {post.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                <ShieldCheck className="size-3.5 fill-current" />
                Verified Rescuer
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span>{post.time}</span>
            <span className="size-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {post.location}
            </span>
          </div>

          <h2 className="mt-4 text-xl font-bold leading-tight text-slate-950">
            {post.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{post.body}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.chips.map((chip) => {
              const Icon = chip.icon;

              return (
                <span
                  key={chip.label}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                    tagPillClass,
                  )}
                >
                  <Icon className="size-3.5" />
                  {chip.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="hidden w-44 shrink-0 md:block">
          <div className="mb-3 flex items-center justify-end gap-2">
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold", post.badgeClass)}>
              {post.badge}
            </span>
            <button type="button" className="text-slate-500">
              <MoreVertical className="size-5" />
            </button>
          </div>
          <img
            src={post.image}
            alt=""
            className="h-32 w-full rounded-2xl object-cover"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-600">
        <div className="flex flex-wrap gap-5">
          <button
            type="button"
            onClick={() => {
              if (hasThreadedComments) {
                setIsCommentsOpen((current) => !current);
              }
            }}
            className={cn(
              "inline-flex items-center gap-2 transition",
              hasThreadedComments && isCommentsOpen && "text-primary",
            )}
          >
            <MessageCircle className="size-4" />
            {hasThreadedComments ? "Comments (12)" : "Reply (12)"}
          </button>
          <button type="button" className="inline-flex items-center gap-2">
            <Share2 className="size-4" />
            Share
          </button>
        </div>
        <div className="flex flex-wrap gap-5">
          <button type="button" className="inline-flex items-center gap-2">
            <Bookmark className="size-4" />
            Save
          </button>
          <button type="button" className="inline-flex items-center gap-2">
            <ThumbsUp className="size-4" />
            Helpful
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
              {post.helpful}
            </span>
          </button>
        </div>
      </div>

      {hasThreadedComments && isCommentsOpen ? <SadiaCommentThread /> : null}
    </article>
  );
};

const SadiaCommentThread = () => (
  <section className="mt-5 overflow-hidden rounded-[22px] border border-slate-200 bg-[#fbfcfb]">
    <div className="border-b border-slate-200 bg-white px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-950">
            Rescue thread
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Best help rises up. Offers, vet notes, and updates stay threaded.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Best help first", "Nearby", "Vet advice"].map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold",
                index === 0 ? "bg-primary text-white" : tagPillClass,
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          MR
        </span>
        <div className="min-w-0 flex-1">
          <div className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-400">
            Add a helpful update, offer foster support, or ask for details...
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
              <PawPrint className="size-4 text-primary" />
              Rescue-safe replies are shown to nearby helpers first
            </span>
            <button
              type="button"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-4 px-4 py-4">
      {sadiaComments.map((comment) => (
        <ThreadComment key={comment.id} comment={comment} />
      ))}
    </div>
  </section>
);

const ThreadComment = ({ comment }) => (
  <article className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
    <div className="flex flex-col items-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-white text-xs font-bold text-primary ring-1 ring-primary/15">
        {comment.initials}
      </span>
      {comment.replies.length ? (
        <span className="mt-2 w-px flex-1 rounded-full bg-gradient-to-b from-primary/30 to-transparent" />
      ) : null}
    </div>

    <div className="min-w-0">
      <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <strong className="text-sm text-slate-950">{comment.author}</strong>
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", tagPillClass)}>
              {comment.badge}
            </span>
            <span className="text-xs font-medium text-slate-400">{comment.time}</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-primary">
            <ThumbsUp className="size-3.5" />
            {comment.score}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{comment.body}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
          <button type="button" className="hover:text-primary">Reply</button>
          <button type="button" className="hover:text-primary">Helpful</button>
          <button type="button" className="hover:text-primary">Share</button>
        </div>
      </div>

      {comment.replies.length ? (
        <div className="mt-3 space-y-3 border-l border-dashed border-primary/25 pl-4">
          {comment.replies.map((reply) => (
            <article
              key={reply.id}
              className="rounded-[16px] border border-slate-200 bg-white/80 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  {reply.initials}
                </span>
                <strong className="text-xs text-slate-950">{reply.author}</strong>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", tagPillClass)}>
                  {reply.badge}
                </span>
                <span className="text-[11px] font-medium text-slate-400">{reply.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{reply.body}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  </article>
);

const CommunityRightRail = () => {
  const [isGlanceOpen, setIsGlanceOpen] = React.useState(false);
  const compactStats = [
    { ...rescueStats[0], shortLabel: "Open" },
    { ...rescueStats[1], shortLabel: "Online" },
    { ...rescueStats[2], shortLabel: "Rehomed" },
    { ...rescueStats[3], shortLabel: "Resolved" },
  ];

  return (
    <aside className="custom-scrollbar space-y-4 xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:overflow-y-auto xl:overscroll-contain xl:pr-1">
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_54px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-3 text-lg font-bold text-slate-950">
          <Users className="size-6 text-primary" />
          Our Community
        </h2>
        <button type="button" className="text-sm font-bold text-blue-700">
          View all
        </button>
      </div>

      <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
        <CommunityMetric value="2.4K" label="Members" icon={<Users className="size-5" />} />
        <CommunityMetric value="186" label="Active today" icon={<Sparkles className="size-5" />} />
        <CommunityMetric value="58" label="Online now" icon={<Check className="size-5" />} />
      </div>

      <button
        type="button"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-[0_14px_32px_rgba(209,70,28,0.24)]"
      >
        <Bot className="size-4" />
        Join Community
      </button>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600"
        >
          <UserPlus className="size-4" />
          Invite Friends
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600"
        >
          <Share2 className="size-4" />
          Share Community
        </button>
      </div>
    </section>

    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_54px_rgba(15,23,42,0.05)]">
      <button
        type="button"
        onClick={() => setIsGlanceOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <h2 className="inline-flex items-center gap-3 text-lg font-bold text-slate-950">
          <span className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-primary">
            <Sparkles className="size-5" />
          </span>
          Today at a glance
        </h2>
        <span className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500">
          {isGlanceOpen ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </span>
      </button>

      {isGlanceOpen ? (
      <div className="mt-4 grid grid-cols-2 gap-3">
        {compactStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-2xl bg-slate-50 px-3 py-4 text-center"
            >
              <span className={cn("mx-auto flex size-11 items-center justify-center rounded-full", stat.className)}>
                <Icon className="size-5" />
              </span>
              <strong className="mt-3 block text-2xl font-bold leading-none text-slate-950">
                {stat.value}
              </strong>
              <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                {stat.shortLabel}
              </span>
            </article>
          );
        })}
      </div>
      ) : null}
    </section>

    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_54px_rgba(15,23,42,0.05)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-3 text-lg font-bold text-slate-950">
          <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <Navigation className="size-5" />
          </span>
          Trending topics
        </h2>
        <button type="button" className="text-sm font-bold text-blue-700">
          View all
        </button>
      </div>
      <div className="space-y-3">
        {trendingTopics.map(([topic, count]) => (
          <div key={topic} className="flex items-center justify-between gap-3">
            <span className={cn("rounded-full px-3 py-1 text-sm font-bold", tagPillClass)}>
              {topic}
            </span>
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold", tagPillClass)}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </section>

    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_54px_rgba(15,23,42,0.05)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-3 text-base font-bold text-slate-950">
          <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <MapPin className="size-5" />
          </span>
          Nearby rescue activity
        </h2>
        <button type="button" className="text-sm font-bold text-blue-700">
          View map
        </button>
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-blue-50/70 p-3">
        <img
          src={dogImage}
          alt=""
          className="size-14 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">
            Dog found near Gulshan 2
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            15m ago • 1.2 km away
          </p>
        </div>
        <Map className="size-4 shrink-0 text-blue-600" />
      </div>
    </section>

    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_54px_rgba(15,23,42,0.05)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-3 text-base font-bold text-slate-950">
            <span className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            Safety checklist
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Follow these tips for effective posts
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_86px] gap-4">
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="size-5 text-emerald-600" />
              {item}
            </li>
          ))}
        </ul>
        <div className="flex items-end justify-end">
          <div className="relative flex size-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <ClipboardCheck className="size-12" />
            <span className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-2xl bg-primary text-white">
              <PawPrint className="size-5" />
            </span>
          </div>
        </div>
      </div>
    </section>
  </aside>
  );
};

const CommunityMetric = ({ icon, value, label }) => (
  <div className="px-2">
    <div className="mx-auto mb-2 flex size-8 items-center justify-center text-slate-500">
      {icon}
    </div>
    <strong className="block text-xl font-bold text-slate-950">{value}</strong>
    <span className="mt-1 block text-xs font-medium text-slate-500">
      {label}
    </span>
  </div>
);

export default CommunityPage;
