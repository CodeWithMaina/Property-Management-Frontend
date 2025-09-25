// src/Dashboard/components/organizations/OrganizationsList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { BulkOperations } from "../common/BulkOperations";
import { TableFooter } from "../common/TableFooter";
import { ActionsDropdown } from "../common/ActionsDropdown";
import { LoadingSpinner } from "../common/LoadingSpinner";
import {
  useGetOrganizationsQuery,
  useDeleteOrganizationMutation,
} from "../../../redux/endpoints/organizationApi";
import type {
  TOrganization,
  TPaginatedOrganizationsResponse,
  TOrganizationQueryParams,
} from "../../../types/organization.types";
import { Users, Building } from "lucide-react";
import { OrganizationFilter } from "./OrganizationFilter";
import { SearchBar } from "../common/SearchBar";

export const OrganizationsList: React.FC = () => {
  const navigate = useNavigate();

  // Query params for backend filtering
  const [queryParams, setQueryParams] = useState<TOrganizationQueryParams>({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, isError } = useGetOrganizationsQuery(queryParams);
  const [deleteOrganization] = useDeleteOrganizationMutation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false); // Fixed variable name

  // Extract organizations and pagination from API response
  const responseData = data as TPaginatedOrganizationsResponse;
  const organizations: TOrganization[] = responseData?.data ?? [];
  const paginationData = responseData?.meta?.pagination;

  // Safe pagination with defaults
  const pagination = {
    total: paginationData ? parseInt(paginationData.total) || 0 : 0,
    page: paginationData?.currentPage || queryParams.page || 1,
    limit: paginationData?.perPage || queryParams.limit || 10,
  };

  // Calculate statistics for each organization
  const organizationsWithStats = organizations.map((org) => ({
    ...org,
    memberCount: org.userOrganizations?.length || 0,
    propertyCount: org.properties?.length || 0,
    contactEmail:
      org.userOrganizations?.find(
        (uo) => uo.role === "superAdmin" || uo.role === "propertyOwner"
      )?.user?.email || "No contact",
    contactName:
      org.userOrganizations?.find(
        (uo) => uo.role === "superAdmin" || uo.role === "propertyOwner"
      )?.user?.fullName || "No contact",
  }));

  /* ============
     Handlers
     ============ */
  const handleViewDetails = (id: string) =>
    navigate(`/admin/organizations/display/${id}`);
  const handleEdit = (id: string) =>
    navigate(`/admin/organizations/edit/${id}`);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This organization will be moved to inactive status.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await toast.promise(deleteOrganization(id).unwrap(), {
          loading: "Deleting organization...",
          success: "Organization deleted successfully!",
          error: "Failed to delete organization.",
        });
      } catch (error) {
        console.error("Failed to delete organization:", error);
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
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
  if (isLoading) return <LoadingSpinner message="Loading organizations..." />;

  if (isError) {
    toast.error("Failed to load organizations.");
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600 dark:text-red-400">
          Failed to load organizations.
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
              Manage Organizations
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create and manage your organizations and their settings
            </p>
          </div>

          <div className="flex flex-1 sm:flex-initial items-center gap-3 w-full sm:w-auto">
            {/* ✅ Updated Search Bar with proper props */}
            <SearchBar
              searchValue={queryParams.search || ""} // Pass current search value
              onSearchChange={handleSearchChange}
              onToggleFilters={toggleFilters}
              showFilters={showFilters}
              placeholder="Search organizations by name, contact, or tax ID..."
            />
          </div>
        </div>
      </div>

      {/* Filter Floating Panel */}
      {showFilters && (
        <OrganizationFilter
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
            `Bulk status updated to ${status} for ${selectedIds.length} organizations`
          );
        }}
        onExport={() => toast.success("Export initiated successfully!")}
        onPrint={() => toast.success("Printing organizations...")}
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
                Organization
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Tax ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Statistics
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
            {organizationsWithStats.map((organization) => (
              <tr
                key={organization.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedIds.includes(organization.id)}
                    onChange={() => toggleSelection(organization.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {organization.name}
                  </div>
                  {organization.legalName &&
                    organization.legalName !== organization.name && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {organization.legalName}
                      </div>
                    )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-gray-900 dark:text-white font-medium">
                    {organization.contactName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {organization.contactEmail}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  {organization.taxId || "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{organization.memberCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Building className="w-4 h-4" />
                      <span>{organization.propertyCount}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      organization.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                    }`}
                  >
                    {organization.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ActionsDropdown
                    actions={[
                      {
                        label: "View Details",
                        onClick: () => handleViewDetails(organization.id),
                      },
                      {
                        label: "Edit",
                        onClick: () => handleEdit(organization.id),
                      },
                      ...(organization.isActive
                        ? [
                            {
                              label: "Delete",
                              onClick: () => handleDelete(organization.id),
                              danger: true,
                            },
                          ]
                        : []),
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {organizations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No organizations found.
            </p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      <TableFooter
        filteredCount={organizations.length}
        totalCount={pagination.total}
        currentPage={pagination.page}
        pageSize={pagination.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) => {
          setQueryParams((prev) => ({ ...prev, page: 1, limit: newSize }));
          toast.success(`Page size changed to ${newSize}`);
        }}
        onExport={() => toast.success("Organizations exported successfully!")}
        onPrint={() => toast.success("Printing organizations list...")}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};