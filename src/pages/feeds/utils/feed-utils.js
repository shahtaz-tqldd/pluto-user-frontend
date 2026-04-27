const uniqueValues = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b));

export const buildTypeOptions = (pets) => uniqueValues(pets.map((pet) => pet.petType));

export const buildBreedOptions = (pets, selectedType) => {
  const breedPool =
    selectedType === "all"
      ? pets
      : pets.filter((pet) => pet.petType === selectedType);

  return uniqueValues(breedPool.map((pet) => pet.breed));
};

export const buildAreaOptions = (pets) => uniqueValues(pets.map((pet) => pet.area));

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
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

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
