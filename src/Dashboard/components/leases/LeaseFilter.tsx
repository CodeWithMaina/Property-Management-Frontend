// src/Dashboard/components/leases/LeaseFilter.tsx
import React from "react";
import { toast } from "react-hot-toast";
import type { TLeaseQueryParams } from "../../../types/lease.types";

interface LeaseFilterProps {
  queryParams: TLeaseQueryParams;
  setQueryParams: (params: TLeaseQueryParams) => void;
  onClose: () => void;
}

// Lease status options based on your API response and types
const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "terminated", label: "Terminated" },
  { value: "ended", label: "Ended" },
  { value: "cancelled", label: "Cancelled" },
];

export const LeaseFilter: React.FC<LeaseFilterProps> = ({
  queryParams,
  setQueryParams,
  onClose,
}) => {
  const handleFilterChange = (key: keyof TLeaseQueryParams, value: string | number) => {
    setQueryParams({
      ...queryParams,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const handleApplyFilters = () => {
    toast.success("Filters applied successfully!");
    onClose();
  };

  const handleClearFilters = () => {
    setQueryParams({
      page: 1,
      limit: 10,
      search: "",
    });
    toast.success("Filters cleared successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter Leases
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={queryParams.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Organization Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization ID
            </label>
            <input
              type="text"
              value={queryParams.organizationId || ""}
              onChange={(e) => handleFilterChange("organizationId", e.target.value)}
              placeholder="Filter by organization ID"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Property Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property ID
            </label>
            <input
              type="text"
              value={queryParams.propertyId || ""}
              onChange={(e) => handleFilterChange("propertyId", e.target.value)}
              placeholder="Filter by property ID"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Tenant Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tenant ID
            </label>
            <input
              type="text"
              value={queryParams.tenantUserId || ""}
              onChange={(e) => handleFilterChange("tenantUserId", e.target.value)}
              placeholder="Filter by tenant ID"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};