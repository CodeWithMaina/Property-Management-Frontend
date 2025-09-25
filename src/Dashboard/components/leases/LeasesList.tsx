// src/Dashboard/components/leases/LeasesList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { BulkOperations } from "../common/BulkOperations";
import { TableFooter } from "../common/TableFooter";
import { ActionsDropdown } from "../common/ActionsDropdown";
import { LoadingSpinner } from "../common/LoadingSpinner";
import {
  useGetLeasesQuery,
  useDeleteLeaseMutation,
  useActivateLeaseMutation,
  useTerminateLeaseMutation,
  useCancelLeaseMutation,
} from "../../../redux/endpoints/leaseApi";
import type {
  Lease,
  TPaginatedLeasesResponse,
  TLeaseQueryParams,
} from "../../../types/lease.types";
import { LeaseFilter } from "./LeaseFilter";
import { SearchBar } from "../common/SearchBar";

export const LeasesList: React.FC = () => {
  const navigate = useNavigate();

  // Query params for backend filtering
  const [queryParams, setQueryParams] = useState<TLeaseQueryParams>({
    page: 1,
    limit: 10,
    search: "", // Now valid due to updated type
  });

  const { data, isLoading, isError } = useGetLeasesQuery(queryParams);
  const [deleteLease] = useDeleteLeaseMutation();
  const [activateLease] = useActivateLeaseMutation();
  const [terminateLease] = useTerminateLeaseMutation();
  const [cancelLease] = useCancelLeaseMutation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Safely extract leases and pagination data
  const leases: Lease[] = (data as TPaginatedLeasesResponse)?.data ?? [];
  
  // Handle pagination data from your API response structure
  const apiPagination = (data as TPaginatedLeasesResponse)?.pagination;
  const apiMeta = (data as any)?.meta?.pagination; // Handle your API's meta structure
  
  const pagination = {
    total: typeof apiPagination?.total === 'string' ? parseInt(apiPagination.total) : 
           apiPagination?.total || 
           typeof apiMeta?.total === 'string' ? parseInt(apiMeta.total) : 
           apiMeta?.total || 
           0,
    page: apiPagination?.currentPage || apiMeta?.currentPage || queryParams.page || 1,
    limit: apiPagination?.perPage || apiMeta?.perPage || queryParams.limit || 10,
    totalPages: apiPagination?.totalPages || apiMeta?.totalPages || 1,
  };

  /* ============
     Handlers
     ============ */
  const handleViewDetails = (id: string) => navigate(`/admin/leases/display/${id}`);
  const handleEdit = (id: string) => navigate(`/admin/leases/edit/${id}`);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This lease will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await toast.promise(deleteLease(id).unwrap(), {
          loading: "Deleting lease...",
          success: "Lease deleted successfully!",
          error: "Failed to delete lease.",
        });
      } catch (error) {
        console.error("Failed to delete lease:", error);
      }
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await toast.promise(activateLease({ id, statusData: {} }).unwrap(), {
        loading: "Activating lease...",
        success: "Lease activated successfully!",
        error: "Failed to activate lease.",
      });
    } catch (error) {
      console.error("Failed to activate lease:", error);
    }
  };

  const handleTerminate = async (id: string) => {
    const result = await Swal.fire({
      title: "Terminate Lease",
      text: "Are you sure you want to terminate this lease?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, terminate!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await toast.promise(terminateLease({ id, statusData: {} }).unwrap(), {
          loading: "Terminating lease...",
          success: "Lease terminated successfully!",
          error: "Failed to terminate lease.",
        });
      } catch (error) {
        console.error("Failed to terminate lease:", error);
      }
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await toast.promise(cancelLease({ id, statusData: {} }).unwrap(), {
        loading: "Canceling lease...",
        success: "Lease canceled successfully!",
        error: "Failed to cancel lease.",
      });
    } catch (error) {
      console.error("Failed to cancel lease:", error);
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
      search: value, // Now valid due to updated type
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
      search: "", // Now valid due to updated type
    });
    toast.success("Filters reset successfully!");
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  // Format currency for display
  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(amount));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", darkBg: "dark:bg-green-800", darkText: "dark:text-green-100", label: "Active" },
      draft: { bg: "bg-gray-100", text: "text-gray-800", darkBg: "dark:bg-gray-800", darkText: "dark:text-gray-100", label: "Draft" },
      terminated: { bg: "bg-red-100", text: "text-red-800", darkBg: "dark:bg-red-800", darkText: "dark:text-red-100", label: "Terminated" },
      ended: { bg: "bg-blue-100", text: "text-blue-800", darkBg: "dark:bg-blue-800", darkText: "dark:text-blue-100", label: "Ended" },
      cancelled: { bg: "bg-orange-100", text: "text-orange-800", darkBg: "dark:bg-orange-800", darkText: "dark:text-orange-100", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return {
      className: `px-2 py-1 text-xs rounded-full font-medium ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}`,
      label: config.label,
    };
  };

  /* ============
     Render
     ============ */
  if (isLoading) return <LoadingSpinner message="Loading leases..." />;
  
  if (isError) {
    toast.error("Failed to load leases.");
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600 dark:text-red-400">
          Failed to load leases.
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
              Manage Leases
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create and manage lease agreements and their settings
            </p>
          </div>

          <div className="flex flex-1 sm:flex-initial items-center gap-3 w-full sm:w-auto">
            <SearchBar
              searchValue={queryParams.search || ""}
              onSearchChange={handleSearchChange}
              onToggleFilters={toggleFilters}
              showFilters={showFilters}
              placeholder="Search leases by tenant name, property, or unit..."
            />
          </div>
        </div>
      </div>

      {/* Filter Floating Panel */}
      {showFilters && (
        <LeaseFilter
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Bulk Operations */}
      <BulkOperations
        selectedCount={selectedIds.length}
        onBulkStatusChange={(status) => {
          console.log("Bulk status change", status, selectedIds);
          toast.success(
            `Bulk status updated to ${status} for ${selectedIds.length} leases`
          );
        }}
        onExport={() => toast.success("Export initiated successfully!")}
        onPrint={() => toast.success("Printing leases...")}
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
                Tenant
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Property & Unit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Lease Period
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Rent Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Due Date
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
            {leases.map((lease) => {
              const statusBadge = getStatusBadge(lease.status);
              
              return (
                <tr 
                  key={lease.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedIds.includes(lease.id)}
                      onChange={() => toggleSelection(lease.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {lease.tenant?.fullName || "—"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {lease.tenant?.email || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {lease.property?.name || "—"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Unit: {lease.unit?.code || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    <div>{formatDate(lease.startDate)}</div>
                    <div className="text-xs">
                      {lease.endDate ? `to ${formatDate(lease.endDate)}` : "No end date"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {formatCurrency(lease.rentAmount, lease.billingCurrency)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    Day {lease.dueDayOfMonth}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={statusBadge.className}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ActionsDropdown
                      actions={[
                        {
                          label: "View Details",
                          onClick: () => handleViewDetails(lease.id),
                        },
                        {
                          label: "Edit",
                          onClick: () => handleEdit(lease.id),
                        },
                        ...(lease.status === "draft"
                          ? [
                              {
                                label: "Activate",
                                onClick: () => handleActivate(lease.id),
                              },
                            ]
                          : []),
                        ...(lease.status === "active"
                          ? [
                              {
                                label: "Terminate",
                                onClick: () => handleTerminate(lease.id),
                                danger: true,
                              },
                              {
                                label: "Cancel",
                                onClick: () => handleCancel(lease.id),
                                danger: true,
                              },
                            ]
                          : []),
                        {
                          label: "Delete",
                          onClick: () => handleDelete(lease.id),
                          danger: true,
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {leases.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No leases found.
            </p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      <TableFooter
        filteredCount={leases.length}
        totalCount={pagination.total}
        currentPage={pagination.page}
        pageSize={pagination.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) => {
          setQueryParams((prev) => ({ ...prev, page: 1, limit: newSize }));
          toast.success(`Page size changed to ${newSize}`);
        }}
        onExport={() => toast.success("Leases exported successfully!")}
        onPrint={() => toast.success("Printing leases list...")}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};