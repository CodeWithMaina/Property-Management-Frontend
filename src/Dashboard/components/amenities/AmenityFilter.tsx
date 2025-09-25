// src/Dashboard/components/amenities/AmenityFilterModal.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { AmenityFilterFormData, AmenityFilterModalProps } from "../../../types/amenity.types";



/**
 * AmenityFilterModal - A responsive floating filter modal for amenities
 * Features:
 * - Mobile-first responsive design
 * - Animated appearance from the right
 * - Positioned bottom-right on large screens, centered on small screens
 * - Close by clicking outside
 * - Integrated search and filter functionality
 * - Built with DaisyUI and react-hook-form
 */
export const AmenityFilter: React.FC<AmenityFilterModalProps> = ({
  isOpen,
  onClose,
  queryParams,
  setQueryParams,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm<AmenityFilterFormData>({
    defaultValues: {
      organizationName: queryParams.organizationName || "",
      amenityName: queryParams.amenityName || "",
      description: queryParams.description || "",
      isActive: queryParams.isActive?.toString() || "",
      limit: queryParams.limit || 10,
    },
  });

  /**
   * Handle form submission - apply filters and search
   */
  const onSubmit = (data: AmenityFilterFormData) => {
    const newParams = {
      ...queryParams,
      page: 1, // Reset to first page when filtering
      organizationName: data.organizationName || undefined,
      amenityName: data.amenityName || undefined,
      description: data.description || undefined,
      isActive: data.isActive ? data.isActive === "true" : undefined,
      limit: data.limit,
    };
    
    setQueryParams(newParams);
    onClose();
    toast.success("Filters applied successfully!");
  };

  /**
   * Reset all filters to default values
   */
  const handleReset = () => {
    reset({
      organizationName: "",
      amenityName: "",
      description: "",
      isActive: "",
      limit: 10,
    });
    
    setQueryParams({
      page: 1,
      limit: 10,
      search: queryParams.search || "",
    });
    
    toast.success("Filters reset successfully!");
  };

  /**
   * Close modal when clicking outside
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - handles outside clicks */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center lg:items-end lg:justify-end lg:p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal Card - responsive positioning */}
        <div className={`
          modal-box
          bg-white dark:bg-gray-800 
          shadow-2xl 
          max-w-md w-full 
          max-h-[90vh] 
          overflow-y-auto
          transform transition-all duration-300
          lg:modal-bottom
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          
          /* Mobile first: centered */
          mx-4
          
          /* Large screens: bottom-right */
          lg:mx-0 lg:mb-4 lg:mr-4 lg:max-w-sm
        `}>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter & Search Amenities
            </h3>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close filter modal"
            >
              ✕
            </button>
          </div>

          {/* Filter Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Organization Name Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                  Organization Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Filter by organization..."
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register("organizationName")}
              />
            </div>

            {/* Amenity Name Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                  Amenity Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Filter by amenity name..."
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register("amenityName")}
              />
            </div>

            {/* Description Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                  Description
                </span>
              </label>
              <textarea
                placeholder="Filter by description..."
                className="textarea textarea-bordered w-full h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register("description")}
              />
            </div>

            {/* Status Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                  Status
                </span>
              </label>
              <select
                className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register("isActive")}
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                  Items per page
                </span>
              </label>
              <select
                className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register("limit", { valueAsNumber: true })}
              >
                <option value={10}>10 items</option>
                <option value={25}>25 items</option>
                <option value={50}>50 items</option>
                <option value={100}>100 items</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline btn-sm flex-1 dark:border-gray-600 dark:text-gray-300"
              >
                Reset Filters
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm flex-1 dark:bg-primary-dark dark:border-primary-dark"
              >
                Apply Filters
              </button>
            </div>
          </form>

          {/* Quick Tips */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💡 <strong>Tip:</strong> Use multiple filters to narrow down your search results effectively.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};