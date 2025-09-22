import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
  useGetUnitByIdQuery, 
  useUpdateUnitMutation 
} from "../../../redux/endpoints/unitApi";
import { useGetPropertiesQuery } from "../../../redux/endpoints/propertyApi";
import toast from "react-hot-toast";
import type { EditUnitFormData, TPartialUnitInput } from "../../../types/unit.types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ArrowLeft, Save, X } from "lucide-react";

export const EditUnit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();
  
  const { data: unitResponse, isLoading: isLoadingUnit, error: unitError } = useGetUnitByIdQuery(id || "");
  const { data: propertiesResponse, isLoading: isLoadingProperties } = useGetPropertiesQuery({ page: 1, limit: 100 });
  
  const unit = unitResponse;
  const properties = propertiesResponse?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<EditUnitFormData>();

  const watchedStatus = watch("status");

  useEffect(() => {
    if (unit) {
      reset({
        propertyId: unit.propertyId,
        code: unit.code,
        floor: unit.floor || undefined,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        sizeSqm: unit.sizeSqm ? parseFloat(unit.sizeSqm) : undefined,
        baseRent: parseFloat(unit.baseRent),
        status: unit.status,
        isActive: unit.isActive,
      });
    }
  }, [unit, reset]);

  const onSubmit = async (data: EditUnitFormData) => {
    if (!id) return;

    try {
      const unitData: TPartialUnitInput = {
        ...data,
        sizeSqm: data.sizeSqm || null,
        floor: data.floor || null,
      };
      
      await updateUnit({ id, unitData }).unwrap();
      toast.success("✅ Unit updated successfully");
      navigate(`/admin/units/display/${id}`);
    } catch (error) {
      toast.error(`❌ Failed to update unit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        navigate(`/admin/units/display/${id}`);
      }
    } else {
      navigate(`/admin/units/display/${id}`);
    }
  };

  if (isLoadingUnit || isLoadingProperties) {
    return <LoadingSpinner message="Loading unit data..." />;
  }

  if (unitError || !unit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error shadow-lg">
          <div>
            <span>❌ Unit not found or error loading unit data.</span>
          </div>
        </div>
        <button 
          onClick={() => navigate("/admin/units/list")}
          className="btn btn-outline mt-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Units
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={handleCancel}
          className="btn btn-ghost btn-sm mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Unit Details
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Unit - {unit.code}</h1>
            <p className="text-gray-600">Update unit information and settings</p>
          </div>
          <div className="badge badge-lg badge-outline capitalize">
            Current Status: {unit.status}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Form Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Unit Information</h2>
          <p className="text-gray-600 text-sm">Update the basic details of this unit</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property *
              </label>
              <select
                {...register("propertyId", { required: "Property is required" })}
                className="select select-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoadingProperties}
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.organization?.name}
                  </option>
                ))}
              </select>
              {errors.propertyId && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  ❌ {errors.propertyId.message}
                </p>
              )}
            </div>

            {/* Unit Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Code *
              </label>
              <input
                type="text"
                {...register("code", { 
                  required: "Unit code is required",
                  pattern: {
                    value: /^[A-Z0-9-]+$/,
                    message: "Unit code can only contain uppercase letters, numbers, and hyphens"
                  }
                })}
                className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., A-101"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  ❌ {errors.code.message}
                </p>
              )}
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor Number
              </label>
              <input
                type="number"
                {...register("floor", { 
                  min: { value: -5, message: "Floor cannot be less than -5" }, 
                  max: { value: 200, message: "Floor cannot exceed 200" } 
                })}
                className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 5"
                min="-5"
                max="200"
              />
              {errors.floor && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  ❌ {errors.floor.message}
                </p>
              )}
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                {...register("bedrooms", { 
                  required: "Bedrooms is required",
                  min: { value: 0, message: "Must be 0 or more" },
                  max: { value: 20, message: "Must be 20 or less" },
                  valueAsNumber: true
                })}
                className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="20"
              />
              {errors.bedrooms && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  ❌ {errors.bedrooms.message}
                </p>
              )}
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                {...register("bathrooms", { 
                  required: "Bathrooms is required",
                  min: { value: 0, message: "Must be 0 or more" },
                  max: { value: 10, message: "Must be 10 or less" },
                  valueAsNumber: true
                })}
                className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="10"
                step="0.5"
              />
              {errors.bathrooms && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  ❌ {errors.bathrooms.message}
                </p>
              )}
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (m²)
              </label>
              <input
                type="number"
                {...register("sizeSqm", { 
                  min: { value: 0, message: "Size must be positive" },
                  valueAsNumber: true
                })}
                className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 85.5"
                step="0.1"
                min="0"
              />
              {errors.sizeSqm && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  ❌ {errors.sizeSqm.message}
                </p>
              )}
            </div>

            {/* Base Rent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Rent *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  {...register("baseRent", { 
                    required: "Base rent is required",
                    min: { value: 0, message: "Must be 0 or more" },
                    valueAsNumber: true
                  })}
                  className="input input-bordered w-full pl-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.baseRent && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  ❌ {errors.baseRent.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                {...register("status", { required: "Status is required" })}
                className="select select-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="vacant">Vacant</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="unavailable">Unavailable</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  ❌ {errors.status.message}
                </p>
              )}
              {watchedStatus && (
                <p className="text-xs text-gray-500 mt-1">
                  Current selection: <span className="capitalize">{watchedStatus}</span>
                </p>
              )}
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="checkbox checkbox-primary"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Unit is active and available
                  </span>
                  <p className="text-xs text-gray-500">
                    Inactive units will not appear in available unit lists
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline gap-2"
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={isUpdating || !isDirty}
            >
              <Save className="h-4 w-4" />
              {isUpdating ? "Updating..." : "Update Unit"}
            </button>
          </div>
        </form>
      </div>

      {/* Current Unit Info Sidebar */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Current Unit Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Code:</span> {unit.code}
          </div>
          <div>
            <span className="text-blue-700">Property:</span> {unit.property?.name || "N/A"}
          </div>
          <div>
            <span className="text-blue-700">Rent:</span> ${parseFloat(unit.baseRent).toLocaleString()}
          </div>
          <div>
            <span className="text-blue-700">Status:</span> <span className="capitalize">{unit.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};