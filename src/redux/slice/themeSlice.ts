// src/redux/slice/themeSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedThemeMode = "light" | "dark";

interface ThemeState {
  /** User-selected theme mode */
  mode: ThemeMode;
  /** The actual applied mode (system-resolved if mode === system) */
  resolvedMode: ResolvedThemeMode;
}

/* ---------- Helpers ---------- */

/** Detect system theme */
export const getSystemTheme = (): ResolvedThemeMode => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/** Persist theme mode in localStorage */
const persistTheme = (mode: ThemeMode) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", mode);
  }
};

/** Load theme mode from localStorage */
const loadTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("theme") as ThemeMode | null;
  return stored ?? "system";
};

/* ---------- Initial State ---------- */
const storedMode = loadTheme();
const initialState: ThemeState = {
  mode: storedMode,
  resolvedMode: storedMode === "system" ? getSystemTheme() : storedMode,
};

/* ---------- Slice ---------- */
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    /** Explicitly set theme mode */
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      const newMode = action.payload;
      state.mode = newMode;
      state.resolvedMode = newMode === "system" ? getSystemTheme() : newMode;
      persistTheme(newMode);
    },

    /** Toggle light/dark regardless of system */
    toggleTheme: (state) => {
      const newMode: Exclude<ResolvedThemeMode, never> =
        state.resolvedMode === "light" ? "dark" : "light";
      state.mode = newMode;
      state.resolvedMode = newMode;
      persistTheme(newMode);
    },

    /** Sync with system preference if user set "system" */
    syncSystemTheme: (state) => {
      if (state.mode === "system") {
        state.resolvedMode = getSystemTheme();
      }
    },
  },
});

/* ---------- Exports ---------- */
export const { setTheme, toggleTheme, syncSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
