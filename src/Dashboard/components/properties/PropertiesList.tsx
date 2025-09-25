// src/Dashboard/components/properties/PropertiesList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { BulkOperations } from "../common/BulkOperations";
import { TableFooter } from "../common/TableFooter";
import { ActionsDropdown } from "../common/ActionsDropdown";
import { LoadingSpinner } from "../common/LoadingSpinner";
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
import { SearchBar } from "../common/SearchBar"; // ✅ Import the new SearchBar

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
  const [showFilters, setShowFilters] = useState(false); // Fixed variable name

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

  const handleSearchChange = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      search: value,
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

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  /* ============
     Render
     ============ */
  if (isLoading) return <LoadingSpinner message="Loading properties..." />;
  
  if (isError) {
    toast.error("Failed to load properties.");
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600 dark:text-red-400">
          Failed to load properties.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Search + Filter */}
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Manage Properties
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create and manage your properties and their settings
            </p>
          </div>

          <div className="flex flex-1 sm:flex-initial items-center gap-3 w-full sm:w-auto">
            {/* ✅ Updated Search Bar with proper props */}
            <SearchBar
              searchValue={queryParams.search || ""} // Pass current search value
              onSearchChange={handleSearchChange}
              onToggleFilters={toggleFilters}
              showFilters={showFilters}
              placeholder="Search properties by name, city, or description..."
            />
          </div>
        </div>
      </div>

      {/* Filter Floating Panel */}
      {showFilters && (
        <PropertyFilter
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          onClose={() => setShowFilters(false)} // Fixed variable name
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
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Select
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Organization
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                City
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Managers
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {properties.map((property) => (
              <tr 
                key={property.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedIds.includes(property.id)}
                    onChange={() => toggleSelection(property.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {property.name}
                  </div>
                  {property.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {property.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {property.organization?.name || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {property.city ? `${property.city}, ${property.country}` : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {property.propertyManagers?.length
                    ? property.propertyManagers
                        .map((pm) => pm.user?.fullName)
                        .join(", ")
                    : "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
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
                <td className="px-4 py-3 whitespace-nowrap">
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

        {properties.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No properties found.
            </p>
          </div>
        )}
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