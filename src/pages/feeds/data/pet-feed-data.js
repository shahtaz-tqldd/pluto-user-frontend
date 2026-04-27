const createPetIllustration = ({
  name,
  accent = "#004f3b",
  accentSoft = "#d7efe2",
  earColor = "#0f172a",
}) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentSoft}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" rx="28" fill="url(#bg)" />
      <circle cx="160" cy="112" r="54" fill="#fff" stroke="${accent}" stroke-width="8" />
      <ellipse cx="129" cy="72" rx="18" ry="28" fill="${earColor}" transform="rotate(-24 129 72)" />
      <ellipse cx="191" cy="72" rx="18" ry="28" fill="${earColor}" transform="rotate(24 191 72)" />
      <circle cx="142" cy="108" r="6" fill="${earColor}" />
      <circle cx="178" cy="108" r="6" fill="${earColor}" />
      <path d="M160 118l-9 9h18z" fill="${accent}" />
      <path d="M144 132c8 9 24 9 32 0" fill="none" stroke="${accent}" stroke-linecap="round" stroke-width="6" />
      <text x="160" y="190" text-anchor="middle" font-size="24" font-weight="700" font-family="Space Grotesk, Arial" fill="${accent}">${name}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const petFeedData = [
  {
    id: "pet-01",
    name: "Milo",
    label: "Gentle street survivor",
    petType: "Dog",
    breed: "Indie",
    age: "10 months",
    gender: "Male",
    location: "Dhanmondi, Dhaka",
    area: "Dhaka",
    status: "Available",
    available: true,
    interestedCount: 12,
    activeChats: 4,
    isNearby: true,
    uploadedAt: "2026-04-22T10:30:00.000Z",
    rescuerName: "Nadia Rahman",
    rescueNote:
      "Found beside a pharmacy after a monsoon storm and placed into temporary foster care.",
    description:
      "Calm indoors, playful outside, and already comfortable with leash walks and short car rides.",
    image: createPetIllustration({
      name: "Milo",
      accent: "#004f3b",
      accentSoft: "#d4efe4",
      earColor: "#13221d",
    }),
  },
  {
    id: "pet-02",
    name: "Tuni",
    label: "Curious window watcher",
    petType: "Cat",
    breed: "Domestic Shorthair",
    age: "1 year",
    gender: "Female",
    location: "Banasree, Dhaka",
    area: "Dhaka",
    status: "Available",
    available: true,
    interestedCount: 9,
    activeChats: 2,
    isNearby: true,
    uploadedAt: "2026-04-23T07:15:00.000Z",
    rescuerName: "Tahsin Alam",
    rescueNote:
      "Recovered from a market lane with a minor paw injury that has fully healed.",
    description:
      "Litter trained, food motivated, and happiest when she has a sunny corner and soft blanket.",
    image: createPetIllustration({
      name: "Tuni",
      accent: "#9a3412",
      accentSoft: "#fde8d8",
      earColor: "#431407",
    }),
  },
  {
    id: "pet-03",
    name: "Bhulu",
    label: "High-energy running buddy",
    petType: "Dog",
    breed: "Labrador Mix",
    age: "2 years",
    gender: "Male",
    location: "Uttara, Dhaka",
    area: "Dhaka",
    status: "Adoption Review",
    available: false,
    interestedCount: 18,
    activeChats: 6,
    isNearby: false,
    uploadedAt: "2026-04-20T15:45:00.000Z",
    rescuerName: "Sabrina Jahan",
    rescueNote:
      "Rescued after being spotted near an airport road construction area for several days.",
    description:
      "Very social with people, responds to basic commands, and benefits from active households.",
    image: createPetIllustration({
      name: "Bhulu",
      accent: "#1d4ed8",
      accentSoft: "#dbeafe",
      earColor: "#1e293b",
    }),
  },
  {
    id: "pet-04",
    name: "Misti",
    label: "Quiet cuddle seeker",
    petType: "Cat",
    breed: "Persian Mix",
    age: "8 months",
    gender: "Female",
    location: "Khulshi, Chattogram",
    area: "Chattogram",
    status: "Available",
    available: true,
    interestedCount: 7,
    activeChats: 1,
    isNearby: false,
    uploadedAt: "2026-04-19T11:10:00.000Z",
    rescuerName: "Arman Hoque",
    rescueNote:
      "Taken in from a residential parking area with signs of dehydration and neglect.",
    description:
      "She settles quickly in quiet homes, enjoys grooming, and likes being carried once comfortable.",
    image: createPetIllustration({
      name: "Misti",
      accent: "#7c3aed",
      accentSoft: "#efe4ff",
      earColor: "#312e81",
    }),
  },
  {
    id: "pet-05",
    name: "Lebu",
    label: "Small but fearless",
    petType: "Dog",
    breed: "Spitz Mix",
    age: "1.5 years",
    gender: "Female",
    location: "Mirpur, Dhaka",
    area: "Dhaka",
    status: "Available",
    available: true,
    interestedCount: 15,
    activeChats: 5,
    isNearby: true,
    uploadedAt: "2026-04-23T05:05:00.000Z",
    rescuerName: "Mehedi Hasan",
    rescueNote:
      "Rescued with two siblings from a bus stand and fostered in a family home.",
    description:
      "Alert, affectionate, and already bonded with children; ideal for adopters wanting a compact companion.",
    image: createPetIllustration({
      name: "Lebu",
      accent: "#15803d",
      accentSoft: "#dcfce7",
      earColor: "#3f3f46",
    }),
  },
  {
    id: "pet-06",
    name: "Nodi",
    label: "Patient recovery success",
    petType: "Cat",
    breed: "Tabby",
    age: "3 years",
    gender: "Male",
    location: "Rajshahi Sadar, Rajshahi",
    area: "Rajshahi",
    status: "Available",
    available: true,
    interestedCount: 4,
    activeChats: 1,
    isNearby: false,
    uploadedAt: "2026-04-17T09:40:00.000Z",
    rescuerName: "Farzana Kabir",
    rescueNote:
      "Found near a drain culvert and nursed through a respiratory infection before listing.",
    description:
      "Independent at first, then deeply affectionate; comfortable around other calm cats.",
    image: createPetIllustration({
      name: "Nodi",
      accent: "#0f766e",
      accentSoft: "#ccfbf1",
      earColor: "#134e4a",
    }),
  },
  {
    id: "pet-07",
    name: "Roki",
    label: "People-loving greeter",
    petType: "Dog",
    breed: "Golden Retriever Mix",
    age: "11 months",
    gender: "Male",
    location: "Sylhet City, Sylhet",
    area: "Sylhet",
    status: "Available",
    available: true,
    interestedCount: 11,
    activeChats: 3,
    isNearby: false,
    uploadedAt: "2026-04-21T13:20:00.000Z",
    rescuerName: "Nusrat Ahmed",
    rescueNote:
      "Picked up from outside a school where local volunteers had been feeding him.",
    description:
      "Friendly and adaptable, with moderate energy and strong confidence around strangers.",
    image: createPetIllustration({
      name: "Roki",
      accent: "#a16207",
      accentSoft: "#fef3c7",
      earColor: "#422006",
    }),
  },
  {
    id: "pet-08",
    name: "Chaaya",
    label: "Soft-spoken foster favorite",
    petType: "Cat",
    breed: "Bombay Mix",
    age: "2 years",
    gender: "Female",
    location: "Barishal Sadar, Barishal",
    area: "Barishal",
    status: "Adoption Review",
    available: false,
    interestedCount: 13,
    activeChats: 4,
    isNearby: false,
    uploadedAt: "2026-04-18T16:50:00.000Z",
    rescuerName: "Shuvo Das",
    rescueNote:
      "Transferred from a local clinic after recovery from a vehicle-related tail injury.",
    description:
      "Quiet, observant, and strongly attached to one trusted human once the bond is formed.",
    image: createPetIllustration({
      name: "Chaaya",
      accent: "#be123c",
      accentSoft: "#ffe4e6",
      earColor: "#4c0519",
    }),
  },
];
