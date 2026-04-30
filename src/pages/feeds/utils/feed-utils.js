const titleCase = (value) =>
  value
    ? value
        .toString()
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "";

const uniqueValues = (items) =>
  [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));

export const slugify = (value) =>
  value
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "pet";

export const buildPetThreadPath = (pet) => `/pets/threads/${pet.id}/`;

export const getPetIdFromSlug = (slug = "") => slug.split("-")[0];

export const buildTypeOptions = (pets) =>
  uniqueValues(pets.map((pet) => pet.petType));

export const buildBreedOptions = (pets, selectedType) => {
  const breedPool =
    selectedType === "all"
      ? pets
      : pets.filter((pet) => pet.petType === selectedType);

  return uniqueValues(breedPool.map((pet) => pet.breed));
};

export const buildAreaOptions = (pets) =>
  uniqueValues(pets.map((pet) => pet.area));

export const filterPets = (pets, filters) => {
  const { searchTerm, quickFilter, petType, breed, area } = filters;
  const normalizedSearch = searchTerm.trim().toLowerCase();

  let filteredPets = pets.filter((pet) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        pet.name,
        pet.label,
        pet.petType,
        pet.breed,
        pet.location,
        pet.area,
      ].some((value) => value?.toLowerCase().includes(normalizedSearch));

    const matchesType = petType === "all" || pet.petType === petType;
    const matchesBreed = breed === "all" || pet.breed === breed;
    const matchesArea = area === "all" || pet.area === area;

    return matchesSearch && matchesType && matchesBreed && matchesArea;
  });

  if (quickFilter === "nearby") {
    filteredPets = filteredPets.filter((pet) => pet.isNearby);
  }

  if (quickFilter === "available") {
    filteredPets = filteredPets.filter((pet) => pet.available);
  }

  if (quickFilter === "latest") {
    filteredPets = [...filteredPets].sort(
      (left, right) => new Date(right.uploadedAt) - new Date(left.uploadedAt),
    );
  }

  if (quickFilter !== "latest") {
    filteredPets = [...filteredPets].sort((left, right) => {
      if (left.available !== right.available) {
        return left.available ? -1 : 1;
      }

      return new Date(right.uploadedAt) - new Date(left.uploadedAt);
    });
  }

  return filteredPets;
};

export const getDaysSinceUpload = (uploadedAt) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffInMs = Date.now() - new Date(uploadedAt).getTime();
  const days = Math.floor(diffInMs / msPerDay);

  if (days <= 0) {
    return "Uploaded today";
  }

  if (days === 1) {
    return "Uploaded 1 day ago";
  }

  return `Uploaded ${days} days ago`;
};

export const normalizePetListResponse = (response) => {
  const pets = Array.isArray(response?.data) ? response.data : [];

  return pets.map((pet) => {
    const images = [
      pet.primary_image,
      ...(Array.isArray(pet.images)
        ? pet.images
            .slice()
            .sort((left, right) => left.sort_order - right.sort_order)
            .map((image) => image.image_url)
        : []),
    ].filter(Boolean);
    const uniqueImages = [...new Set(images)];
    const petType = titleCase(pet.species);
    const status = titleCase(pet.status);
    const gender = titleCase(pet.gender);
    const size = titleCase(pet.size);
    const location = pet.current_location || "Location not set";

    return {
      id: pet.id,
      name: pet.title || "Unnamed pet",
      label: [pet.age, gender, size].filter(Boolean).join(" • "),
      petType,
      breed: pet.breed || "",
      age: pet.age || `${pet.age_months ?? 0} months`,
      gender,
      size,
      color: pet.color || "",
      location,
      area: location,
      status,
      available: pet.status === "AVAILABLE",
      interestedCount: pet.interested_count ?? 0,
      activeChats: pet.active_chats ?? 0,
      isNearby: true,
      uploadedAt: pet.created_at,
      rescuerName: pet.rescuer_name || "Community rescuer",
      rescueNote: pet.medical_notes || pet.story || "No extra notes yet.",
      description: pet.story || "No story added yet.",
      images: uniqueImages,
      rawPet: pet,
    };
  });
};
