// src/hooks/useSystemThemeSync.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { syncSystemTheme } from "../redux/slice/themeSlice";
import type { AppDispatch } from "../redux/store/store";

/**
 * Hook to automatically sync theme with system preferences
 * Listens for system theme changes and updates Redux store accordingly
 */
export const useSystemThemeSync = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Initial sync
    dispatch(syncSystemTheme());

    // Listener for system changes
    const listener = () => {
      dispatch(syncSystemTheme());
    };

    mediaQuery.addEventListener("change", listener);
    
    // Cleanup
    return () => mediaQuery.removeEventListener("change", listener);
  }, [dispatch]);
};