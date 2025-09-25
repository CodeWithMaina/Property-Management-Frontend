// EditAmenity.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Loader2,
  Building,
  Text,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  useGetAmenityByIdQuery,
  useUpdateAmenityMutation,
} from "../../../redux/endpoints/amenityApi";
import type { TPartialAmenityInput } from "../../../types/amenity.types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { updateAmenitySchema, type UpdateAmenityFormData } from "../../../validation/amenity.schema";

interface NameAvailability {
  available: boolean;
  suggestion?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ApiError {
  data?: {
    errors?: ValidationError[];
    message?: string;
  };
  status?: number;
}

export const EditAmenity: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for name availability check
  const [nameCheckDebounce, setNameCheckDebounce] = useState<ReturnType<typeof setTimeout>>();
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameAvailability, setNameAvailability] = useState<NameAvailability | null>(null);

  // RTK Query hooks
  const {
    data: amenityData,
    isLoading: isLoadingAmenity,
    isError: isAmenityError,
  } = useGetAmenityByIdQuery(id!, {
    skip: !id,
  });

  const [updateAmenity, { isLoading: isUpdating }] = useUpdateAmenityMutation();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
    reset,
    setError,
    clearErrors,
  } = useForm<UpdateAmenityFormData>({
    resolver: zodResolver(updateAmenitySchema),
    defaultValues: {
      name: "",
      description: "",
      organizationId: "",
    },
    mode: "onChange",
  });

  // Watch name field for availability check
  const watchedName = watch("name");
  const watchedOrganizationId = watch("organizationId");

  // Debounced name availability check
  const checkNameAvailability = useCallback(async (name: string, organizationId: string) => {
    if (!name || name.length === 0 || !organizationId) {
      setNameAvailability(null);
      return;
    }

    setIsCheckingName(true);
    
    try {
      // Simulate API call for name availability check
      // In a real application, this would be an actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock availability logic - replace with actual API call
      if (name.toLowerCase().includes("test")) {
        setNameAvailability({
          available: false,
          suggestion: `${name} (Alternative)`,
        });
      } else {
        setNameAvailability({ available: true });
      }
    } catch (error) {
      console.error("Name availability check failed:", error);
      setNameAvailability(null);
    } finally {
      setIsCheckingName(false);
    }
  }, []);

  // Effect for debounced name availability check
  useEffect(() => {
    if (nameCheckDebounce) {
      clearTimeout(nameCheckDebounce);
    }

    if (watchedName && watchedName.length > 0 && watchedOrganizationId) {
      const timeout = setTimeout(() => {
        checkNameAvailability(watchedName, watchedOrganizationId);
      }, 500);

      setNameCheckDebounce(timeout);
    } else {
      setNameAvailability(null);
      setIsCheckingName(false);
    }

    return () => {
      if (nameCheckDebounce) {
        clearTimeout(nameCheckDebounce);
      }
    };
  }, [watchedName, watchedOrganizationId, nameCheckDebounce, checkNameAvailability]);

  // Reset form when amenity data loads
  useEffect(() => {
    if (amenityData) {
      reset({
        name: amenityData.name || "",
        description: amenityData.description || "",
        organizationId: amenityData.organizationId || "",
      });
    }
  }, [amenityData, reset]);

  // Handle form submission
  const onSubmit = async (data: UpdateAmenityFormData) => {
    if (!id) {
      toast.error("Invalid amenity ID");
      return;
    }

    // Check name availability one more time before submission
    if (nameAvailability && !nameAvailability.available) {
      setError("name", {
        type: "manual",
        message: "Name is not available. Please choose a different name.",
      });
      return;
    }

    try {
      const updateData: TPartialAmenityInput = {
        name: data.name,
        description: data.description || undefined,
      };

      // Only include organizationId if it's changed and provided
      if (data.organizationId && data.organizationId !== amenityData?.organizationId) {
        updateData.organizationId = data.organizationId;
      }

      await toast.promise(
        updateAmenity({ id, amenityData: updateData }).unwrap(),
        {
          loading: "Updating amenity...",
          success: "Amenity updated successfully!",
          error: "Failed to update amenity. Please try again.",
        }
      );

      // Navigate back to amenities list
      navigate("/admin/amenities");
    } catch (error: unknown) {
      console.error("Update error:", error);
      
      // Handle specific error cases
      const apiError = error as ApiError;
      if (apiError?.data?.errors) {
        apiError.data.errors.forEach((validationError: ValidationError) => {
          if (validationError.field in data) {
            setError(validationError.field as keyof UpdateAmenityFormData, {
              type: "server",
              message: validationError.message,
            });
          }
        });
      } else if (apiError?.data?.message) {
        toast.error(apiError.data.message);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate("/admin/amenities");
  };

  // Clear name availability when name changes
  useEffect(() => {
    if (watchedName && watchedName !== amenityData?.name) {
      setNameAvailability(null);
      clearErrors("name");
    }
  }, [watchedName, amenityData?.name, clearErrors]);

  // Loading state
  if (isLoadingAmenity) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner message="Loading amenity details..." />
      </div>
    );
  }

  // Error state
  if (isAmenityError || !amenityData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center justify-center flex-col space-y-4">
            <AlertCircle className="text-red-600 dark:text-red-400 w-12 h-12" />
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-300">
              Amenity Not Found
            </h2>
            <p className="text-red-600 dark:text-red-400 text-center">
              The amenity you're trying to edit doesn't exist or you don't have permission to access it.
            </p>
            <button
              onClick={() => navigate("/admin/amenities")}
              className="btn btn-primary flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Amenities
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSubmitDisabled = isUpdating || !isDirty || !isValid || Object.keys(errors).length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="btn btn-ghost btn-circle hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
            disabled={isUpdating}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Amenity
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update amenity details for {amenityData.name}
            </p>
          </div>
        </div>
        
        {/* Save indicator */}
        {isDirty && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
            <Info size={16} />
            <span>Unsaved changes</span>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Organization ID (Read-only for context) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building size={16} className="inline mr-2" />
                Current Organization
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-white font-medium">
                  {amenityData.organization?.name || "No organization"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Organization cannot be changed here
                </p>
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Text size={16} className="inline mr-2" />
              Amenity Name *
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : "input-primary"
                } ${isCheckingName ? "pr-10" : ""}`}
                placeholder="Enter amenity name (e.g., Swimming Pool, Gym)"
                disabled={isUpdating}
                aria-invalid={errors.name ? "true" : "false"}
              />
              
              {isCheckingName && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Name validation messages */}
            {errors.name ? (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name.message}
              </p>
            ) : nameAvailability && (
              <p className={`text-sm mt-1 flex items-center gap-1 ${
                nameAvailability.available 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-amber-600 dark:text-amber-400"
              }`}>
                {nameAvailability.available ? (
                  <>
                    <CheckCircle size={14} />
                    Name is available
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} />
                    Name not available. Suggestion: {nameAvailability.suggestion}
                  </>
                )}
              </p>
            )}
            
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Required. 1-128 characters. Letters, numbers, spaces, hyphens, and underscores only.
            </p>
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText size={16} className="inline mr-2" />
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className={`textarea textarea-bordered w-full ${
                errors.description ? "textarea-error" : "textarea-primary"
              }`}
              placeholder="Describe this amenity (optional)"
              disabled={isUpdating}
              aria-invalid={errors.description ? "true" : "false"}
            />
            
            {errors.description && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.description.message}
              </p>
            )}
            
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Optional. Maximum 500 characters. {watch("description")?.length || 0}/500
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-ghost btn-outline flex-1 sm:flex-initial transition-colors"
              disabled={isUpdating}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="btn btn-primary flex items-center gap-2 flex-1 sm:flex-initial transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update Amenity
                </>
              )}
            </button>
          </div>

          {/* Form status indicators */}
          <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-4">
            {isDirty && (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Info size={12} />
                You have unsaved changes
              </span>
            )}
            {Object.keys(errors).length > 0 && (
              <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle size={12} />
                Please fix validation errors
              </span>
            )}
            {!isDirty && Object.keys(errors).length === 0 && (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle size={12} />
                Form is valid and ready
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 dark:text-blue-400 mt-0.5">
            <Info size={18} />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-300">
              Editing Tips
            </h3>
            <ul className="text-blue-800 dark:text-blue-400 text-sm mt-1 space-y-1">
              <li>• Amenity names must be unique within the organization</li>
              <li>• Descriptions help tenants understand the amenity better</li>
              <li>• Changes take effect immediately after saving</li>
              <li>• You cannot change the organization here for data integrity</li>
              <li>• The form will validate your inputs as you type</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};