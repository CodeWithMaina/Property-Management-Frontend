import React, { useEffect, useRef, useState } from "react";
import type { TPropertyQueryParams } from "../../../types/property.types";

interface PropertyFilterProps {
  queryParams: TPropertyQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<TPropertyQueryParams>>;
  onClose: () => void;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  queryParams,
  setQueryParams,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [localFilters, setLocalFilters] = useState({
    name: queryParams.name || "",
    organizationId: queryParams.organizationId || "",
    city: queryParams.city || "",
    managers: queryParams.managers || "",
    isActive: queryParams.isActive,
    limit: queryParams.limit || 10,
  });

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleApply = () => {
    setQueryParams((prev) => ({
      ...prev,
      name: localFilters.name || undefined,
      organizationId: localFilters.organizationId || undefined,
      city: localFilters.city || undefined,
      managers: localFilters.managers || undefined,
      isActive: localFilters.isActive,
      limit: localFilters.limit,
      page: 1,
    }));
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      name: "",
      organizationId: "",
      city: "",
      managers: "",
      isActive: undefined,
      limit: 10,
    };
    setLocalFilters(clearedFilters);
    setQueryParams((prev) => ({
      ...prev,
      name: undefined,
      organizationId: undefined,
      city: undefined,
      managers: undefined,
      isActive: undefined,
      limit: 10,
      page: 1,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:items-end lg:justify-end lg:p-6">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Filter Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 lg:animate-in lg:slide-in-from-right-4 lg:max-w-md lg:mb-4 lg:mr-4"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter Properties
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close filter"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-5 max-h-96 overflow-y-auto">
          {/* Property Name Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Property Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={localFilters.name}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Search by property name"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Organization Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Organization
            </label>
            <input
              type="text"
              value={localFilters.organizationId}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, organizationId: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter organization ID or name"
            />
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              type="text"
              value={localFilters.city}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, city: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Filter by city"
            />
          </div>

          {/* Managers Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Managers
            </label>
            <input
              type="text"
              value={localFilters.managers}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, managers: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Filter by manager name"
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <div className="relative">
              <select
                value={
                  localFilters.isActive === null || localFilters.isActive === undefined
                    ? "all"
                    : localFilters.isActive
                    ? "true"
                    : "false"
                }
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    isActive:
                      e.target.value === "all"
                        ? undefined
                        : e.target.value === "true",
                  }))
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Items per Page */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Items per Page
            </label>
            <div className="relative">
              <select
                value={localFilters.limit}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    limit: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} items
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors border border-gray-300 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};