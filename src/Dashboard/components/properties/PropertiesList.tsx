// src/Dashboard/components/properties/PropertiesList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { BulkOperations } from "../common/BulkOperations";
import { TableFooter } from "../common/TableFooter";
import { ActionsDropdown } from "../common/ActionsDropdown";
import {
  useGetPropertiesQuery,
  useDeletePropertyMutation,
  useRestorePropertyMutation,
  useHardDeletePropertyMutation,
} from "../../../redux/endpoints/propertyApi";
import type {
  Property,
  TPaginatedPropertiesResponse,
  TPropertyQueryParams,
} from "../../../types/property.types";
import { PropertyFilter } from "./PropertyFilter";
import { Search, Filter, X } from "lucide-react";

export const PropertiesList: React.FC = () => {
  const navigate = useNavigate();

  // Query params for backend filtering
  const [queryParams, setQueryParams] = useState<TPropertyQueryParams>({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, isError } = useGetPropertiesQuery(queryParams);
  const [deleteProperty] = useDeletePropertyMutation();
  const [restoreProperty] = useRestorePropertyMutation();
  const [hardDeleteProperty] = useHardDeletePropertyMutation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  // Extracted properties safely
  const properties: Property[] =
    (data as TPaginatedPropertiesResponse)?.data ?? [];
  const pagination =
    (data as TPaginatedPropertiesResponse)?.pagination ?? {
      total: 0,
      page: queryParams.page,
      limit: queryParams.limit,
    };

  /* ============
     Handlers
     ============ */
  const handleViewDetails = (id: string) => navigate(`/admin/properties/display/${id}`);
  const handleEdit = (id: string) => navigate(`/admin/properties/edit/${id}`);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This property will be moved to inactive status.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await toast.promise(deleteProperty(id).unwrap(), {
          loading: "Deleting property...",
          success: "Property deleted successfully!",
          error: "Failed to delete property.",
        });
      } catch (error) {
        console.error("Failed to delete property:", error);
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await toast.promise(restoreProperty(id).unwrap(), {
        loading: "Restoring property...",
        success: "Property restored successfully!",
        error: "Failed to restore property.",
      });
    } catch (error) {
      console.error("Failed to restore property:", error);
    }
  };

  const handleHardDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "⚠️ Permanent Deletion",
      text: "This will permanently delete the property and all associated data. This action cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete permanently!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await toast.promise(hardDeleteProperty(id).unwrap(), {
          loading: "Permanently deleting property...",
          success: "Property permanently deleted!",
          error: "Failed to permanently delete property.",
        });
      } catch (error) {
        console.error("Failed to hard delete property:", error);
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      search: e.target.value,
    }));
  };

  const clearSearch = () => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      search: "",
    }));
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleResetFilters = () => {
    setQueryParams({
      page: 1,
      limit: 10,
      search: "",
    });
    toast.success("Filters reset successfully!");
  };

  /* ============
     Render
     ============ */
  if (isLoading) return <p>Loading properties...</p>;
  if (isError) {
    toast.error("Failed to load properties.");
    return <p>Failed to load properties.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header + Search + Filter */}
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Manage Properties
          </h2>

          <div className="flex flex-1 sm:flex-initial items-center gap-3 w-full sm:w-auto">
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 sm:w-80">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={queryParams.search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {queryParams.search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Filter Button */}
            <button
              onClick={() => setShowFilter(true)}
              className="relative px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-blue-700 dark:text-blue-300 font-medium transition-all duration-200 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 group whitespace-nowrap"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden sm:inline">Filter</span>
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/5 group-hover:to-indigo-400/5 transition-all duration-200 pointer-events-none"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Floating Panel */}
      {showFilter && (
        <PropertyFilter
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* Bulk Operations */}
      <BulkOperations
        selectedCount={selectedIds.length}
        onBulkStatusChange={(status) => {
          console.log("Bulk status change", status, selectedIds);
          toast.success(
            `Bulk status updated to ${status} for ${selectedIds.length} properties`
          );
        }}
        onExport={() => toast.success("Export initiated successfully!")}
        onPrint={() => toast.success("Printing properties...")}
        onClearSelection={() => {
          setSelectedIds([]);
          toast.success("Selection cleared!");
        }}
      />

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                Select
              </th>
              <th className="px-4 py-2 text-left text-xs">Name</th>
              <th className="px-4 py-2 text-left text-xs">Organization</th>
              <th className="px-4 py-2 text-left text-xs">City</th>
              <th className="px-4 py-2 text-left text-xs">Managers</th>
              <th className="px-4 py-2 text-left text-xs">Status</th>
              <th className="px-4 py-2 text-left text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedIds.includes(property.id)}
                    onChange={() => toggleSelection(property.id)}
                  />
                </td>
                <td className="px-4 py-2 font-medium">
                  {property.name}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {property.description}
                  </p>
                </td>
                <td className="px-4 py-2">{property.organization?.name}</td>
                <td className="px-4 py-2">
                  {property.city}, {property.country}
                </td>
                <td className="px-4 py-2">
                  {property.propertyManagers?.length
                    ? property.propertyManagers
                        .map((pm) => pm.user?.fullName)
                        .join(", ")
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      property.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                    }`}
                  >
                    {property.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <ActionsDropdown
                    actions={[
                      {
                        label: "View Details",
                        onClick: () => handleViewDetails(property.id),
                      },
                      {
                        label: "Edit",
                        onClick: () => handleEdit(property.id),
                      },
                      ...(property.isActive
                        ? [
                            {
                              label: "Delete",
                              onClick: () => handleDelete(property.id),
                              danger: true,
                            },
                          ]
                        : [
                            {
                              label: "Restore",
                              onClick: () => handleRestore(property.id),
                            },
                            {
                              label: "Hard Delete",
                              onClick: () => handleHardDelete(property.id),
                              danger: true,
                            },
                          ]),
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <TableFooter
        filteredCount={properties.length}
        totalCount={pagination.total}
        currentPage={pagination.page}
        pageSize={pagination.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) => {
          setQueryParams((prev) => ({ ...prev, page: 1, limit: newSize }));
          toast.success(`Page size changed to ${newSize}`);
        }}
        onExport={() => toast.success("Properties exported successfully!")}
        onPrint={() => toast.success("Printing properties list...")}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
