import { petFeedData } from "@/pages/feeds/data/pet-feed-data";

const initialsFromName = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const createProfileIllustration = ({
  name,
  accent = "#004f3b",
  accentSoft = "#d9efe6",
  highlight = "#f5c96c",
}) => {
  const initials = initialsFromName(name);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="profileBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentSoft}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="52" fill="url(#profileBg)" />
      <circle cx="120" cy="88" r="42" fill="${accent}" opacity="0.16" />
      <circle cx="120" cy="88" r="28" fill="${accent}" opacity="0.92" />
      <path d="M58 195c10-34 35-51 62-51s52 17 62 51" fill="${accent}" opacity="0.18" />
      <circle cx="182" cy="52" r="16" fill="${highlight}" />
      <text x="120" y="100" text-anchor="middle" font-size="22" font-weight="700" font-family="Space Grotesk, Arial" fill="#ffffff">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const rescuerPets = petFeedData.filter((pet) =>
  ["Nadia Rahman", "Tahsin Alam", "Sabrina Jahan"].includes(pet.rescuerName),
);

export const profileDirectory = [
  {
    username: "nadia-rahman",
    slug: "nadia-rahman",
    role: "user",
    name: "Nadia Rahman",
    avatar: createProfileIllustration({
      name: "Nadia Rahman",
      accent: "#004f3b",
      accentSoft: "#d7efe2",
      highlight: "#ffd66b",
    }),
    shortBio:
      "Street-animal rescuer coordinating treatment, temporary foster homes, and careful adopter matching across central Dhaka.",
    location: "Dhanmondi, Dhaka",
    joinedLabel: "Rescuing since 2022",
    trustScore: "4.9/5",
    responseTime: "Usually replies in 2h",
    stats: [
      { label: "Rescued", value: "38" },
      { label: "Available", value: "6" },
      { label: "Adopted", value: "24" },
      { label: "Reviews", value: "19" },
    ],
    trustSignals: [
      "Vaccination records shared for every listed pet",
      "Consistent post-adoption check-ins with adopters",
      "Verified by three repeat adopters in the community",
    ],
    privateHighlights: [
      {
        label: "Pending chats",
        value: "08",
        note: "Three adopters waiting for home-visit confirmation.",
      },
      {
        label: "Follow-ups due",
        value: "05",
        note: "Recent adopters expecting a one-week wellbeing check.",
      },
      {
        label: "Profile strength",
        value: "92%",
        note: "Add emergency foster contacts to complete your trust card.",
      },
    ],
    availablePets: rescuerPets.filter((pet) => pet.available).slice(0, 3),
    rescuedPets: rescuerPets.slice(0, 4),
    adoptedHistory: [
      {
        id: "adopted-01",
        petName: "Pori",
        adoptedAt: "Adopted in February 2026",
        adopter: "Maliha Tasnim",
        note: "Settled into a balcony-safe apartment with weekly updates.",
      },
      {
        id: "adopted-02",
        petName: "Rafa",
        adoptedAt: "Adopted in December 2025",
        adopter: "Nabil Karim",
        note: "Joined a family home with another calm rescue dog.",
      },
      {
        id: "adopted-03",
        petName: "Chini",
        adoptedAt: "Adopted in October 2025",
        adopter: "Sadia Islam",
        note: "Now living indoors after a full treatment and recovery cycle.",
      },
    ],
    reviews: [
      {
        id: "review-01",
        author: "Tasmia Noor",
        role: "Member",
        rating: "5.0",
        summary: "Transparent from first message to handover.",
        body: "Nadia shared treatment details, food routines, and checked in after adoption. The process felt organized and genuine.",
      },
      {
        id: "review-02",
        author: "Rezaul Kabir",
        role: "Volunteer",
        rating: "4.8",
        summary: "Reliable in emergency rescue coordination.",
        body: "She keeps clear notes on each animal and does not rush placement when the adopter fit is weak.",
      },
      {
        id: "review-03",
        author: "Maliha Tasnim",
        role: "Member",
        rating: "5.0",
        summary: "Strong follow-up after adoption.",
        body: "The trust came from how carefully she screened us and how available she stayed after the handover.",
      },
    ],
  },
  {
    username: "aisha-karim",
    slug: "aisha-karim",
    role: "user",
    name: "Aisha Karim",
    avatar: createProfileIllustration({
      name: "Aisha Karim",
      accent: "#8a4b12",
      accentSoft: "#fbe7d8",
      highlight: "#0ea5a4",
    }),
    shortBio:
      "Apartment-based adopter focused on long-term indoor care, medical follow-up, and stable routines for rescued cats and small dogs.",
    location: "Banasree, Dhaka",
    joinedLabel: "Adopting since 2024",
    trustScore: "4.7/5",
    responseTime: "Replies the same day",
    stats: [
      { label: "Adopted", value: "3" },
      { label: "Active requests", value: "2" },
      { label: "Reviews", value: "11" },
      { label: "Check-ins", value: "14" },
    ],
    trustSignals: [
      "Shares scheduled medical updates after handover",
      "Maintains indoor-only care commitment",
      "Recommended by repeat rescuers for communication quality",
    ],
    privateHighlights: [
      {
        label: "Open requests",
        value: "02",
        note: "One cat and one small dog request awaiting rescuer review.",
      },
      {
        label: "Reference checks",
        value: "03",
        note: "Three rescuers have marked your follow-up history as strong.",
      },
      {
        label: "Profile strength",
        value: "88%",
        note: "Adding home photos would strengthen future adoption requests.",
      },
    ],
    adoptionHistory: [
      {
        id: "history-01",
        petName: "Momo",
        adoptedAt: "January 2026",
        rescuer: "Tahsin Alam",
        note: "Indoor cat with monthly health updates shared back to rescuer.",
      },
      {
        id: "history-02",
        petName: "Dheu",
        adoptedAt: "August 2025",
        rescuer: "Nadia Rahman",
        note: "Recovered street puppy now on a predictable walking routine.",
      },
      {
        id: "history-03",
        petName: "Luna",
        adoptedAt: "March 2025",
        rescuer: "Sabrina Jahan",
        note: "Senior foster-to-adopt case completed after a trial care period.",
      },
    ],
    activityMoments: [
      {
        id: "activity-01",
        title: "Shared one-month check-in",
        meta: "for Momo",
        detail: "Uploaded litter, appetite, and vaccination follow-up notes.",
      },
      {
        id: "activity-02",
        title: "Completed home screening",
        meta: "with Nadia Rahman",
        detail: "Confirmed balcony netting and indoor sleeping setup.",
      },
      {
        id: "activity-03",
        title: "Requested adoption",
        meta: "for Tuni",
        detail: "Included work schedule, prior adoption history, and vet access.",
      },
    ],
    reviews: [
      {
        id: "review-11",
        author: "Tahsin Alam",
        role: "Member",
        rating: "4.8",
        summary: "Consistent and responsive adopter.",
        body: "Aisha asked practical care questions and kept every follow-up promise after the handover.",
      },
      {
        id: "review-12",
        author: "Nadia Rahman",
        role: "Member",
        rating: "4.7",
        summary: "Strong long-term commitment.",
        body: "Her home setup matched what she described, and the update trail after adoption was reliable.",
      },
      {
        id: "review-13",
        author: "Sabrina Jahan",
        role: "Member",
        rating: "4.5",
        summary: "Good communication during review.",
        body: "Careful and polite throughout the screening process. Would approve another request with normal checks.",
      },
    ],
  },
];

export const getProfileByUsername = (username) =>
  profileDirectory.find((profile) => profile.username === username);

export const createSelfProfile = (user, username) => {
  const fullName =
    user?.name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "Guest User";
  const role = "user";
  const fallbackBio =
    "Building a transparent profile with pet posts, rescue history, adoption follow-ups, and community trust.";

  return {
    username,
    slug: username,
    role,
    name: fullName,
    avatar:
      user?.avatar ||
      user?.profile_picture_url ||
      createProfileIllustration({
        name: fullName,
        accent: "#004f3b",
        accentSoft: "#d7efe2",
        highlight: "#ffd66b",
      }),
    cover:
      user?.cover || user?.cover_image || user?.cover_url || user?.cover_image_url || "",
    shortBio: user?.bio || fallbackBio,
    location: user?.address || user?.location || "Dhaka",
    email: user?.email || "",
    phone: user?.phone || "",
    jobTitle: user?.job_title || "",
    isVerified: Boolean(user?.is_verified),
    status: user?.status || "",
    joinedAt: user?.date_joined || user?.created_at || "",
    joinedLabel: "Your profile",
    trustScore: "4.7/5",
    responseTime: "Updates from your recent activity",
    stats: [
      { label: "Posts", value: "4" },
      { label: "Rescued", value: "7" },
      { label: "Adoptions", value: "2" },
      { label: "Reviews", value: "9" },
    ],
    trustSignals: [
      "Add clear care notes to every listing",
      "Keep post-adoption updates visible",
      "Collect reviews after completed handovers",
    ],
    privateHighlights: [
      {
        label: "Profile strength",
        value: "76%",
        note: "Complete your bio and trust details to improve profile confidence.",
      },
      {
        label: "Unread updates",
        value: "04",
        note: "Recent profile and adoption activity is waiting for review.",
      },
      {
        label: "Public trust",
        value: "Growing",
        note: "More reviews and completed interactions will strengthen this profile.",
      },
    ],
    availablePets: petFeedData.filter((pet) => pet.available).slice(0, 3),
    rescuedPets: petFeedData.slice(0, 4),
    adoptedHistory: [
      {
        id: "self-history-01",
        petName: "Milo",
        adoptedAt: "Recently completed",
        adopter: "Community match",
        note: "This area can surface completed handovers and follow-up notes.",
      },
    ],
    adoptionHistory: [
      {
        id: "self-adoption-01",
        petName: "Tuni",
        adoptedAt: "Recently completed",
        rescuer: "Community rescuer",
        note: "This area can surface your care history and public feedback.",
      },
    ],
    activityMoments: [
      {
        id: "self-activity-01",
        title: "Recent activity",
        meta: "appears here",
        detail: "Use this panel for requests, updates, and trust-building moments.",
      },
    ],
    reviews: [
      {
        id: "self-review-01",
        author: "Community member",
        role: "Feedback",
        rating: "4.8",
        summary: "Profile foundation is in place.",
        body: "As real reviews arrive, this wall will become the public trust layer for your account.",
      },
    ],
  };
};
