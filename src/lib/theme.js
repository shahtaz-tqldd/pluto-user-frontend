export const THEME_STORAGE_KEY = "pawpal-theme-mode";

export const THEME_MODES = ["light", "dark", "system"];

export const getStoredThemePreference = () => {
  if (typeof window === "undefined") return "system";

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_MODES.includes(savedTheme) ? savedTheme : "system";
};

export const getResolvedTheme = (preference = getStoredThemePreference()) => {
  if (preference === "system") {
    if (typeof window === "undefined") return "light";

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return preference;
};

export const applyThemePreference = (
  preference = getStoredThemePreference(),
) => {
  if (typeof document === "undefined") return "light";

  const resolvedTheme = getResolvedTheme(preference);
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.dataset.theme = preference;
  document.documentElement.style.colorScheme = resolvedTheme;

  return resolvedTheme;
};

export const saveThemePreference = (preference) => {
  const nextPreference = THEME_MODES.includes(preference)
    ? preference
    : "system";

  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
  }

  return applyThemePreference(nextPreference);
};
