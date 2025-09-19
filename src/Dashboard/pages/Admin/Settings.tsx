// src/Dashboard/pages/Admin/Settings.tsx
import { useTheme } from "../../../hooks/useTheme";

export const Settings = () => {
  const { mode, resolvedMode, setTheme } = useTheme();

  return (
    <div className={`p-6 bg-surface rounded-lg border border-border`}>
      <h2 className="text-2xl font-bold text-text-primary mb-4">Theme Settings</h2>
      
      <div className="mb-4">
        <p className="text-text-primary">Current mode: {mode}</p>
        <p className="text-text-primary">Resolved theme: {resolvedMode}</p>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => setTheme("light")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Light
        </button>
        <button 
          onClick={() => setTheme("dark")}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Dark
        </button>
        <button 
          onClick={() => setTheme("system")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          System
        </button>
      </div>
    </div>
  );
};