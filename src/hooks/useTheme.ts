// src/hooks/useTheme.ts
import { useSelector, useDispatch } from "react-redux";
import { setTheme, toggleTheme } from "../redux/slice/themeSlice";
import type { ThemeMode } from "../redux/slice/themeSlice";
import type { RootState, AppDispatch } from "../redux/store/store";

/**
 * Custom hook for accessing and manipulating the theme
 * Provides a simple interface for components to work with the theme system
 */
export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const resolvedMode = useSelector((state: RootState) => state.theme.resolvedMode);

  return {
    /** Current theme mode (light, dark, or system) */
    mode,
    /** The actually applied theme (light or dark) */
    resolvedMode,
    /** Set the theme mode */
    setTheme: (theme: ThemeMode) => dispatch(setTheme(theme)),
    /** Toggle between light and dark (bypasses system preference) */
    toggleTheme: () => dispatch(toggleTheme()),
    /** Check if dark mode is active */
    isDark: resolvedMode === "dark",
  };
};