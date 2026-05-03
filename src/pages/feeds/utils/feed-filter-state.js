export const defaultFeedFilters = Object.freeze({
  searchTerm: "",
  petType: "all",
  area: "all",
  size: "all",
  location: "anywhere",
  radiusKm: "5",
  color: "all",
});

const feedFilterQueryKeys = {
  searchTerm: "q",
  petType: "petType",
  area: "area",
  size: "size",
  location: "location",
  radiusKm: "radius",
  color: "color",
};

const sidebarFilterKeys = ["petType", "area", "size", "location", "radiusKm", "color"];

export const getFeedFiltersFromSearch = (search = "") => {
  const params =
    search instanceof URLSearchParams ? search : new URLSearchParams(search);

  return Object.entries(feedFilterQueryKeys).reduce(
    (filters, [filterKey, queryKey]) => {
      const queryValue = params.get(queryKey);

      filters[filterKey] =
        queryValue && queryValue.length > 0
          ? queryValue
          : defaultFeedFilters[filterKey];

      return filters;
    },
    {},
  );
};

export const buildFeedFilterSearch = (filters = {}) => {
  const params = new URLSearchParams();
  const mergedFilters = {
    ...defaultFeedFilters,
    ...filters,
  };

  Object.entries(feedFilterQueryKeys).forEach(([filterKey, queryKey]) => {
    const value = mergedFilters[filterKey]?.toString() ?? "";
    const isSearchTerm = filterKey === "searchTerm";
    const hasActiveValue = isSearchTerm
      ? value.trim().length > 0
      : value !== defaultFeedFilters[filterKey];

    if (hasActiveValue) {
      params.set(queryKey, value);
    }
  });

  return params.toString();
};

export const getActiveFeedFilterCount = (filters = {}) =>
  sidebarFilterKeys.filter((filterKey) => {
    const value = filters[filterKey] ?? defaultFeedFilters[filterKey];

    if (filterKey === "radiusKm") {
      return (
        (filters.location ?? defaultFeedFilters.location) === "nearby" &&
        value !== defaultFeedFilters.radiusKm
      );
    }

    return value !== defaultFeedFilters[filterKey];
  }).length;
