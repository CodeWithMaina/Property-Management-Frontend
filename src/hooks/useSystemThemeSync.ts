// src/hooks/useSystemThemeSync.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { syncSystemTheme } from "../redux/slice/themeSlice";
import type { AppDispatch } from "../redux/store/store";

export const useSystemThemeSync = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Initial sync
    dispatch(syncSystemTheme(mediaQuery.matches ? "dark" : "light"));

    // Listener for system changes
    const listener = (e: MediaQueryListEvent) => {
      dispatch(syncSystemTheme(e.matches ? "dark" : "light"));
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [dispatch]);
};
