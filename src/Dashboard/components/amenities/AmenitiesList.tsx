// Updated AmenitiesList.tsx with real-time filtering and API fallback
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { BulkOperations } from "../common/BulkOperations";
import { TableFooter } from "../common/TableFooter";
import { ActionsDropdown } from "../common/ActionsDropdown";
import { LoadingSpinner } from "../common/LoadingSpinner";
import {
  useGetAmenitiesQuery,
  useDeleteAmenityMutation,
} from "../../../redux/endpoints/amenityApi";
import type {
  Amenity,
  TPaginatedAmenitiesResponse,
  TAmenityQueryParams,
} from "../../../types/amenity.types";
import { SearchBar } from "../common/SearchBar";
import { AmenityFilter } from "./AmenityFilter";

export const AmenitiesList: React.FC = () => {
  const navigate = useNavigate();

  // Query params for backend filtering
  const [queryParams, setQueryParams] = useState<TAmenityQueryParams>({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, isError } = useGetAmenitiesQuery(queryParams);
  const [deleteAmenity] = useDeleteAmenityMutation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Extract amenities and pagination data safely
  const allAmenities: Amenity[] = useMemo(() => {
    return (data as TPaginatedAmenitiesResponse)?.data ?? [];
  }, [data]);

  const pagination = (data as TPaginatedAmenitiesResponse)?.pagination ?? {
    total: 0,
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  // Real-time client-side filtering
  const filteredAmenities = useMemo(() => {
    if (!localSearchTerm.trim()) {
      return allAmenities;
    }

    const searchTerm = localSearchTerm.toLowerCase();
    
    // Client-side filtering
    const clientFiltered = allAmenities.filter(amenity => 
      amenity.name?.toLowerCase().includes(searchTerm) ||
      amenity.description?.toLowerCase().includes(searchTerm) ||
      amenity.organization?.name?.toLowerCase().includes(searchTerm)
    );

    // If client-side filtering doesn't find results, trigger API search
    if (clientFiltered.length === 0 && localSearchTerm.trim()) {
      // Only trigger API search if we don't already have a backend search in progress
      // and if the search term is different from the current queryParams.search
      if (queryParams.search !== localSearchTerm) {
        setTimeout(() => {
          setQueryParams(prev => ({
            ...prev,
            page: 1,
            search: localSearchTerm,
          }));
        }, 100);
      }
      return []; // Return empty while waiting for API results
    }

    return clientFiltered;
  }, [allAmenities, localSearchTerm, queryParams.search]);

  // Use filtered amenities for display
  const displayAmenities = localSearchTerm ? filteredAmenities : allAmenities;

  /* ============
     Handlers
     ============ */
  const handleEdit = (id: string) => navigate(`/admin/amenities/edit/${id}`);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This amenity will be moved to inactive status.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await toast.promise(deleteAmenity(id).unwrap(), {
          loading: "Deleting amenity...",
          success: "Amenity deleted successfully!",
          error: "Failed to delete amenity.",
        });
      } catch (error) {
        console.error("Failed to delete amenity:", error);
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
  };

  // Handle Enter key press for API search fallback
  const handleSearchAction = (value: string) => {
    const trimmedValue = value.trim();
    
    if (trimmedValue) {
      // Trigger API search when Enter is pressed
      setQueryParams(prev => ({
        ...prev,
        page: 1,
        search: trimmedValue,
      }));
      setLocalSearchTerm(trimmedValue);
      toast.success(`Searching for: "${trimmedValue}"`);
    } else {
      // Clear search
      setQueryParams(prev => ({
        ...prev,
        page: 1,
        search: "",
      }));
      setLocalSearchTerm("");
    }
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
    setLocalSearchTerm("");
    setShowFilterModal(false);
    toast.success("All filters reset successfully!");
  };

  const toggleFilterModal = () => {
    setShowFilterModal((prev) => !prev);
  };

  /* ============
     Render
     ============ */
  if (isLoading) return <LoadingSpinner message="Loading amenities..." />;

  if (isError) {
    toast.error("Failed to load amenities.");
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600 dark:text-red-400">
          Failed to load amenities.
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
              Manage Amenities
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create and manage amenities for your properties
            </p>
          </div>

          <div className="flex flex-1 sm:flex-initial items-center gap-3 w-full sm:w-auto">
            <SearchBar
              searchValue={localSearchTerm}
              onSearchChange={handleSearchChange}
              onSearchAction={handleSearchAction}
              onToggleFilters={toggleFilterModal}
              showFilters={showFilterModal}
              placeholder="Search amenities by name, description, or organization..."
            />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <AmenityFilter
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />

      {/* Rest of the component remains the same */}
      <BulkOperations
        selectedCount={selectedIds.length}
        onBulkStatusChange={(status) => {
          console.log("Bulk status change", status, selectedIds);
          toast.success(
            `Bulk status updated to ${status} for ${selectedIds.length} amenities`
          );
        }}
        onExport={() => toast.success("Export initiated successfully!")}
        onPrint={() => toast.success("Printing amenities...")}
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
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Organization
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {displayAmenities.map((amenity) => (
              <tr
                key={amenity.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedIds.includes(amenity.id)}
                    onChange={() => toggleSelection(amenity.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {amenity.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {amenity.description || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {amenity.organization?.name || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {amenity.createdAt
                    ? new Date(amenity.createdAt).toLocaleDateString()
                    : "—"}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <ActionsDropdown
                    actions={[
                      {
                        label: "Edit",
                        onClick: () => handleEdit(amenity.id),
                      },
                      {
                        label: "Delete",
                        onClick: () => handleDelete(amenity.id),
                        danger: true,
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {displayAmenities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {localSearchTerm ? "No amenities found matching your search." : "No amenities found."}
            </p>
          </div>
        )}
      </div>

      <TableFooter
        filteredCount={displayAmenities.length}
        totalCount={pagination.total}
        currentPage={pagination.page}
        pageSize={pagination.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) => {
          setQueryParams((prev) => ({ ...prev, page: 1, limit: newSize }));
          toast.success(`Page size changed to ${newSize}`);
        }}
        onExport={() => toast.success("Amenities exported successfully!")}
        onPrint={() => toast.success("Printing amenities list...")}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};