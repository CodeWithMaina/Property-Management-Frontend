// src/redux/slice/themeSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
}

// Helper to get system theme
export const getSystemTheme = (): ResolvedThemeMode => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Helper to persist theme to localStorage
const persistTheme = (mode: ThemeMode) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", mode);
  }
};

// Helper to load theme from localStorage
const loadTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as ThemeMode) || "system";
};

const initialState: ThemeState = {
  mode: loadTheme(),
  resolvedMode: loadTheme() === "system" ? getSystemTheme() : (loadTheme() as ResolvedThemeMode),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.resolvedMode = action.payload === "system" ? getSystemTheme() : (action.payload as ResolvedThemeMode);
      persistTheme(action.payload);
    },
    toggleTheme: (state) => {
      const newMode = state.resolvedMode === "light" ? "dark" : "light";
      state.mode = newMode;
      state.resolvedMode = newMode;
      persistTheme(newMode);
    },
    syncSystemTheme: (state) => {
      // Only update resolved mode if user preference is set to "system"
      if (state.mode === "system") {
        state.resolvedMode = getSystemTheme();
      }
    },
  },
});

export const { setTheme, toggleTheme, syncSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;