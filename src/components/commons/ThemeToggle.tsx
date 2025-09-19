// src/components/ThemeToggle.tsx
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import type { AppDispatch, RootState } from "../../redux/store/store";
import { setTheme, type ThemeMode } from "../../redux/slice/themeSlice";

/**
 * ThemeToggle component with three options: light, dark, and system
 * Provides visual feedback with smooth animations
 */
const ThemeToggle = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const resolvedTheme = useSelector((state: RootState) => state.theme.resolvedMode);

  const handleThemeChange = (newTheme: ThemeMode) => {
    dispatch(setTheme(newTheme));
  };

  const nextTheme = (): ThemeMode => {
    if (theme === "light") return "dark";
    if (theme === "dark") return "system";
    return "light";
  };

  const handleToggle = () => {
    handleThemeChange(nextTheme());
  };

  const getThemeIcon = () => {
    if (theme === "system") {
      return <Monitor className="w-5 h-5" />;
    }
    return resolvedTheme === "light" ? (
      <Sun className="w-5 h-5" />
    ) : (
      <Moon className="w-5 h-5" />
    );
  };

  const getThemeTitle = () => {
    if (theme === "system") {
      return `System (${resolvedTheme})`;
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center rounded-full p-3
                   bg-background text-text-primary 
                   border border-border
                   shadow-md transition-all duration-300
                   hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        aria-label={`Switch theme. Current theme: ${getThemeTitle()}`}
        title={`Current: ${getThemeTitle()}. Click to change.`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme + resolvedTheme}
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {getThemeIcon()}
          </motion.span>
        </AnimatePresence>
      </button>
      
      {/* Optional: Detailed theme selector for accessibility */}
      <div className="hidden md:flex gap-1 bg-surface rounded-full p-1">
        {(["light", "dark", "system"] as ThemeMode[]).map((option) => (
          <button
            key={option}
            onClick={() => handleThemeChange(option)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              theme === option
                ? "bg-primary text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
            aria-label={`Set theme to ${option}`}
            aria-pressed={theme === option}
          >
            {option === "system" ? "System" : option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;