import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
  useGetUnitByIdQuery, 
  useUpdateUnitMutation 
} from "../../../redux/endpoints/unitApi";
import { useGetPropertiesQuery } from "../../../redux/endpoints/propertyApi";
import toast from "react-hot-toast";
import type { EditUnitFormData, TPartialUnitInput } from "../../../types/unit.types";
import type { PropertyManager } from "../../../types/user.types";
import type { UnitAmenity } from "../../../types/amenity.types";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { 
  ArrowLeft, Save, X, Building, Home, DollarSign, Ruler, 
  Bed, Bath, Layers, MapPin, Star, Clock
} from "lucide-react";

export const EditUnit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // RTK Query hooks
  const { 
    data: unitResponse, 
    isLoading: isLoadingUnit, 
    error: unitError,
    isError: isUnitError 
  } = useGetUnitByIdQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const { 
    data: propertiesResponse, 
    isLoading: isLoadingProperties,
    isError: isPropertiesError 
  } = useGetPropertiesQuery({ 
    page: 1, 
    limit: 100,
    isActive: true
  });

  const [updateUnit, { 
    isLoading: isUpdating, 
    isError: isUpdateError,
    error: updateError 
  }] = useUpdateUnitMutation();

  // Extract unit data from response
  const unit = useMemo(() => unitResponse?.data, [unitResponse]);
  const properties = useMemo(() => propertiesResponse?.data || [], [propertiesResponse]);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
    // Remove unused setValue
  } = useForm<EditUnitFormData>({
    mode: "onChange",
    defaultValues: {
      isActive: true,
      status: "vacant",
      bedrooms: 0,
      bathrooms: 0,
      baseRent: 0,
    }
  });

  // Remove unused watchedStatus since it's not used in the component
  watch("status");
  // const watchedPropertyId = watch("propertyId");

  // Prefill form when unit data is available
  useEffect(() => {
    if (unit) {
      const formData: EditUnitFormData = {
        propertyId: unit.propertyId,
        code: unit.code,
        floor: unit.floor || undefined,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        sizeSqm: unit.sizeSqm ? parseFloat(unit.sizeSqm) : undefined,
        baseRent: parseFloat(unit.baseRent),
        status: unit.status,
        isActive: unit.isActive,
      };
      
      reset(formData);
    }
  }, [unit, reset]);

  // Handle update errors
  useEffect(() => {
    if (isUpdateError && updateError) {
      const errorMessage = 'data' in updateError 
        ? (updateError.data as { message?: string })?.message || 'Failed to update unit'
        : 'Failed to update unit';
      
      toast.error(`❌ ${errorMessage}`);
    }
  }, [isUpdateError, updateError]);

  const onSubmit = async (data: EditUnitFormData) => {
    if (!id) {
      toast.error("❌ Unit ID is missing");
      return;
    }

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
      console.error("Update error:", error);
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

  const handleReset = () => {
    if (unit) {
      const formData: EditUnitFormData = {
        propertyId: unit.propertyId,
        code: unit.code,
        floor: unit.floor || undefined,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        sizeSqm: unit.sizeSqm ? parseFloat(unit.sizeSqm) : undefined,
        baseRent: parseFloat(unit.baseRent),
        status: unit.status,
        isActive: unit.isActive,
      };
      reset(formData);
      toast.success("🔄 Form reset to original values");
    }
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toLocaleString('en-KE', {
      style: 'currency',
      currency: 'KES'
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Type guard to check if unit has currentTenant property
  // const hasCurrentTenant = (unit: Unit): unit is Unit & { currentTenant: any } => {
  //   return 'currentTenant' in unit && unit.currentTenant !== undefined;
  // };

  // Loading state
  if (isLoadingUnit || isLoadingProperties) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading unit data..." />
      </div>
    );
  }

  // Error states
  if (isUnitError || !unit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error shadow-lg">
          <div>
            <span>❌ {unitError ? 'Error loading unit data' : 'Unit not found'}</span>
          </div>
        </div>
        <button 
          onClick={() => navigate("/admin/units/list")}
          className="btn btn-outline mt-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Units List
        </button>
      </div>
    );
  }

  if (isPropertiesError) {
    toast.error("❌ Failed to load properties");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(`/admin/units/display/${id}`)}
          className="btn btn-ghost btn-sm mb-4 gap-2 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Unit Details
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Home className="h-8 w-8 text-blue-600" />
              Edit Unit - {unit.code}
            </h1>
            <p className="text-gray-600 mt-1">Update unit information and settings</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`badge badge-lg capitalize ${
              unit.status === 'occupied' ? 'badge-success' :
              unit.status === 'vacant' ? 'badge-warning' :
              unit.status === 'reserved' ? 'badge-info' :
              'badge-error'
            }`}>
              {unit.status}
            </div>
            <div className={`badge badge-lg ${unit.isActive ? 'badge-success' : 'badge-error'}`}>
              {unit.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Unit Information
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Update the basic details of this unit. Fields marked with * are required.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Selection */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
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
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Bed className="h-4 w-4" />
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
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Bath className="h-4 w-4" />
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
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
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
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Base Rent *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      KES
                    </span>
                    <input
                      type="number"
                      {...register("baseRent", { 
                        required: "Base rent is required",
                        min: { value: 0, message: "Must be 0 or more" },
                        valueAsNumber: true
                      })}
                      className="input input-bordered w-full pl-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                </div>

                {/* Active Status */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Unit is active and available
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Inactive units will not appear in available unit lists or be available for new leases
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-ghost btn-sm gap-2 text-gray-600"
                  disabled={!isDirty || isUpdating}
                >
                  <X className="h-4 w-4" />
                  Reset Changes
                </button>
                
                <div className="flex gap-3">
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
                    disabled={isUpdating || !isDirty || !isValid}
                  >
                    {isUpdating ? (
                      <>
                        <div className="loading loading-spinner loading-sm"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update Unit
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Current Unit Info Sidebar */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Current Unit Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Home className="h-4 w-4 text-green-600" />
                  Current Unit Information
                </h3>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Unit Code:</span>
                  <p className="font-semibold text-gray-900">{unit.code}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Property:</span>
                  <p className="font-semibold text-gray-900">{unit.property?.name || "N/A"}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Monthly Rent:</span>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(unit.baseRent)}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className={`badge capitalize ${
                    unit.status === 'occupied' ? 'badge-success' :
                    unit.status === 'vacant' ? 'badge-warning' :
                    unit.status === 'reserved' ? 'badge-info' :
                    'badge-error'
                  }`}>
                    {unit.status}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Active:</span>
                  <span className={`badge ${unit.isActive ? 'badge-success' : 'badge-error'}`}>
                    {unit.isActive ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Bed/Bath:</span>
                  <p className="font-semibold text-gray-900">
                    {unit.bedrooms} BD / {unit.bathrooms} BA
                  </p>
                </div>
                
                {unit.sizeSqm && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Size:</span>
                    <p className="font-semibold text-gray-900">
                      {parseFloat(unit.sizeSqm).toLocaleString()} m²
                    </p>
                  </div>
                )}
                
                {unit.floor && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Floor:</span>
                    <p className="font-semibold text-gray-900">{unit.floor}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Tenant Information - REMOVED since currentTenant doesn't exist on Unit type */}
            
            {/* Property Information */}
            {unit.property && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Building className="h-4 w-4 text-purple-600" />
                    Property Details
                  </h3>
                </div>
                
                <div className="p-6 space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">{unit.property.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {unit.property.addressLine1}, {unit.property.city}
                    </p>
                  </div>
                  
                  {unit.property.organization && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Organization:</span>
                      <p className="text-sm">{unit.property.organization.name}</p>
                    </div>
                  )}
                  
                  {unit.property.propertyManagers && unit.property.propertyManagers.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Property Manager:</span>
                      {unit.property.propertyManagers.map((manager: PropertyManager) => (
                        <div key={manager.id} className="flex items-center gap-2 mt-1">
                          {manager.user.avatarUrl && (
                            <img 
                              src={manager.user.avatarUrl} 
                              alt={manager.user.fullName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm">{manager.user.fullName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Unit Amenities */}
            {unit.unitAmenities && unit.unitAmenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-600" />
                    Unit Amenities
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {unit.unitAmenities.map((amenity: UnitAmenity) => (
                      <span 
                        key={amenity.id}
                        className="badge badge-outline badge-primary gap-1"
                      >
                        <Star className="h-3 w-3" />
                        {amenity.amenity.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  Metadata
                </h3>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p>{formatDate(unit.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <p>{formatDate(unit.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};