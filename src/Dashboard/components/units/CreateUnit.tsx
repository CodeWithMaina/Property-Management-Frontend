import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateUnitMutation } from "../../../redux/endpoints/unitApi";
import { useGetPropertiesQuery } from "../../../redux/endpoints/propertyApi";
import toast from "react-hot-toast";
import type { CreateUnitFormData, TUnitInput } from "../../../types/unit.types";
import type { UnitStatusEnum } from "../../../types/enum.types";

export const CreateUnit: React.FC = () => {
  const navigate = useNavigate();
  const [createUnit, { isLoading }] = useCreateUnitMutation();
  const { data: propertiesResponse } = useGetPropertiesQuery({ page: 1, limit: 100 });
  const properties = propertiesResponse?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUnitFormData>({
    defaultValues: {
      bedrooms: 1,
      bathrooms: 1,
      baseRent: 0,
      status: "vacant" as UnitStatusEnum,
    },
  });

  const onSubmit = async (data: CreateUnitFormData) => {
    try {
      const unitData: TUnitInput = {
        ...data,
        isActive: true,
      };
      
      const result = await createUnit(unitData).unwrap();
      toast.success("Unit created successfully");
      // Navigate to the display page of the newly created unit
      navigate(`/admin/units/display/${result.id}`);
    } catch (error) {
      toast.error(`Failed to create unit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Create New Unit</h1>
            <p className="text-gray-600">Add a new unit to your property</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property *
                </label>
                <select
                  {...register("propertyId", { required: "Property is required" })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select a property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name} - {property.organization?.name}
                    </option>
                  ))}
                </select>
                {errors.propertyId && (
                  <p className="text-red-500 text-sm mt-1">{errors.propertyId.message}</p>
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
                      message: "Unit code can only contain letters, numbers, and hyphens"
                    }
                  })}
                  className="input input-bordered w-full"
                  placeholder="e.g., A-101"
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                )}
              </div>

              {/* Floor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor
                </label>
                <input
                  type="number"
                  {...register("floor", { min: 0, max: 200 })}
                  className="input input-bordered w-full"
                  placeholder="Floor number"
                />
                {errors.floor && (
                  <p className="text-red-500 text-sm mt-1">{errors.floor.message}</p>
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
                    max: { value: 20, message: "Must be 20 or less" }
                  })}
                  className="input input-bordered w-full"
                  min="0"
                  max="20"
                />
                {errors.bedrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bedrooms.message}</p>
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
                    max: { value: 10, message: "Must be 10 or less" }
                  })}
                  className="input input-bordered w-full"
                  min="0"
                  max="10"
                  step="0.5"
                />
                {errors.bathrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bathrooms.message}</p>
                )}
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size (m²)
                </label>
                <input
                  type="number"
                  {...register("sizeSqm", { min: 0 })}
                  className="input input-bordered w-full"
                  placeholder="Square meters"
                  step="0.1"
                />
                {errors.sizeSqm && (
                  <p className="text-red-500 text-sm mt-1">{errors.sizeSqm.message}</p>
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
                      min: { value: 0, message: "Must be 0 or more" }
                    })}
                    className="input input-bordered w-full pl-8"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                {errors.baseRent && (
                  <p className="text-red-500 text-sm mt-1">{errors.baseRent.message}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  {...register("status", { required: "Status is required" })}
                  className="select select-bordered w-full"
                >
                  <option value="vacant">Vacant</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/units/list")}
                className="btn btn-outline"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Unit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};