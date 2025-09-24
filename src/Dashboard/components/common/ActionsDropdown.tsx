// src/Dashboard/components/common/ActionsDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export interface DropdownAction {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface ActionsDropdownProps {
  actions: DropdownAction[];
}

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ actions }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setOpen(false);
                  action.onClick();
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  action.danger
                    ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
