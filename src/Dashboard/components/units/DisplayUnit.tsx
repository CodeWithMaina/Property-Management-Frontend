import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Building, 
  Calendar, 
  DollarSign, 
  Home, 
  User, 
  Edit,
  ArrowLeft,
  Trash2,
  MapPin,
  Layers,
  Ruler,
  Bed,
  Bath
} from "lucide-react";
import { useGetUnitByIdQuery, useDeleteUnitMutation } from "../../../redux/endpoints/unitApi";
import { formatCurrency, getStatusColor } from "../../../util/typeConversion";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const DisplayUnit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: unit, isLoading, error } = useGetUnitByIdQuery(id || "");
  const [deleteUnit, { isLoading: isDeleting }] = useDeleteUnitMutation();

  const handleDelete = async () => {
    if (!id || !unit) return;
    
    if (window.confirm(`Are you sure you want to delete unit "${unit.code}"? This action cannot be undone.`)) {
      try {
        await deleteUnit(id).unwrap();
        toast.success(`Unit "${unit.code}" deleted successfully`);
        navigate("/admin/units/list");
      } catch (error) {
        toast.error(`Failed to delete unit: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading unit details..." />;
  }

  if (error || !unit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error shadow-lg">
          <div>
            <span>❌ Error loading unit details. Please try again.</span>
          </div>
        </div>
        <button 
          onClick={() => navigate("/admin/units/list")}
          className="btn btn-outline mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Units
        </button>
      </div>
    );
  }

  const activeLease = unit.leases?.find(lease => lease.status === "active");
  const tenant = activeLease?.tenant;
  const property = unit.property;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate("/admin/units/list")}
          className="btn btn-ghost btn-sm mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Units
        </button>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{unit.code}</h1>
              <span className={`badge badge-lg ${getStatusColor(unit.status)} capitalize`}>
                {unit.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{unit.bedrooms} bed</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{unit.bathrooms} bath</span>
              </div>
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>{unit.sizeSqm} m²</span>
              </div>
              {unit.floor && (
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span>Floor {unit.floor}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/admin/units/edit/${unit.id}`)}
              className="btn btn-primary gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Unit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-error gap-2"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Property Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Property Name</label>
                <p className="font-medium text-gray-900">{property?.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Organization</label>
                <p className="font-medium text-gray-900">{property?.organization?.name || "N/A"}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="font-medium text-gray-900">
                    {[property?.addressLine1, property?.addressLine2, property?.city, property?.state]
                      .filter(Boolean)
                      .join(", ") || "No address available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Unit Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Unit Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Unit Code</label>
                  <p className="font-medium text-gray-900">{unit.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Floor</label>
                  <p className="font-medium text-gray-900">{unit.floor || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Base Rent</label>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(unit.baseRent)}/month
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Bedrooms</label>
                  <p className="font-medium text-gray-900">{unit.bedrooms}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Bathrooms</label>
                  <p className="font-medium text-gray-900">{unit.bathrooms}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Size</label>
                  <p className="font-medium text-gray-900">{unit.sizeSqm} m²</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Lease Information */}
          {activeLease && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Current Lease</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Start Date</label>
                    <p className="font-medium text-gray-900">
                      {new Date(activeLease.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rent Amount</label>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(activeLease.rentAmount)}/month
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">End Date</label>
                    <p className="font-medium text-gray-900">
                      {activeLease.endDate 
                        ? new Date(activeLease.endDate).toLocaleDateString()
                        : "No end date"
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Deposit</label>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(activeLease.depositAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Tenant Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Current Tenant</h3>
            </div>
            {tenant ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="font-medium text-gray-900">{tenant.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="font-medium text-gray-900 break-all">{tenant.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="font-medium text-gray-900">{tenant.phone || "N/A"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No active tenant</p>
              </div>
            )}
          </div>

          {/* Unit Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Unit Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <span className={`badge ${getStatusColor(unit.status)} capitalize`}>
                  {unit.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Active</span>
                <span className={`text-sm font-medium ${unit.isActive ? "text-green-600" : "text-red-600"}`}>
                  {unit.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate(`/admin/units/edit/${unit.id}`)}
                className="btn btn-outline btn-sm w-full justify-start gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Unit Details
              </button>
              <button 
                onClick={() => navigate(`/admin/leases?unitId=${unit.id}`)}
                className="btn btn-outline btn-sm w-full justify-start gap-2"
              >
                <Calendar className="h-4 w-4" />
                Manage Leases
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};