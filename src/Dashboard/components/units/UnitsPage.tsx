// UnitsPage.tsx - Updated with modal functionality
import React, { useState, useMemo, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useGetUnitsQuery } from "../../../redux/endpoints/unitApi";
import { useGetOrganizationsQuery } from "../../../redux/endpoints/organizationApi";
import { useGetPropertiesQuery } from "../../../redux/endpoints/propertyApi";
import type { FilterOptions } from "../../../types/unit.types";
import { transformUnitData } from "../../../util/typeConversion";
import { SearchBar } from "../../components/common/SearchBar";
import { FilterPanel } from "../../components/units/FilterPanel";
import { BulkOperations } from "../common/BulkOperations";
import { UnitsTable } from "../../components/units/UnitsTable";
import { TableFooter } from "../common/TableFooter";

// ============ CONSTANTS ============
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_RENT_RANGE: [number, number] = [0, 100000];

// ============ MAIN COMPONENT ============
export const UnitsPage: React.FC = () => {
  // ============ STATE MANAGEMENT ============
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    property: null,
    status: [],
    organization: null,
    rent: DEFAULT_RENT_RANGE,
    search: "",
  });

  // ============ API QUERIES ============
  const { data: organizationsResponse, isLoading: organizationsLoading } =
    useGetOrganizationsQuery({
      page: DEFAULT_CURRENT_PAGE,
      limit: 100,
    });

  const { data: propertiesResponse, isLoading: propertiesLoading } =
    useGetPropertiesQuery({
      organizationId: filterOptions.organization || undefined,
      page: DEFAULT_CURRENT_PAGE,
      limit: 100,
    });

  const { data, error, isLoading, refetch } = useGetUnitsQuery({
    organizationId: filterOptions.organization || undefined,
    propertyId: filterOptions.property || undefined,
    status:
      filterOptions.status.length > 0
        ? filterOptions.status.join(",")
        : undefined,
    search: filterOptions.search || undefined,
    page: currentPage,
    limit: pageSize,
    isActive: true,
  });

  // ============ SIDE EFFECTS ============
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filterOptions, refetch]);

  useEffect(() => {
    setCurrentPage(DEFAULT_CURRENT_PAGE);
  }, [filterOptions, pageSize]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFilterModal) {
        setShowFilterModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showFilterModal]);

  // ============ DATA TRANSFORMATION ============
  const transformedUnits = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(transformUnitData);
  }, [data]);

  const organizations = useMemo(
    () => organizationsResponse?.data || [],
    [organizationsResponse]
  );

  const properties = useMemo(
    () => propertiesResponse?.data || [],
    [propertiesResponse]
  );

  const filteredProperties = useMemo(
    () =>
      filterOptions.organization
        ? properties.filter(
            (prop) => prop.organizationId === filterOptions.organization
          )
        : properties,
    [properties, filterOptions.organization]
  );

  const filteredUnits = useMemo(() => {
    if (!transformedUnits) return [];

    return transformedUnits.filter((unit) => {
      // Search filter (client-side for better UX with tenant data)
      if (filterOptions.search) {
        const searchTerm = filterOptions.search.toLowerCase();
        const matchesCode = unit.code.toLowerCase().includes(searchTerm);
        const matchesProperty = unit.property.name
          .toLowerCase()
          .includes(searchTerm);
        const matchesOrg = unit.property.organization.name
          .toLowerCase()
          .includes(searchTerm);

        // Check tenant names and emails
        const matchesTenant = unit.leases.some(
          (lease) =>
            lease.tenant.fullName.toLowerCase().includes(searchTerm) ||
            lease.tenant.email.toLowerCase().includes(searchTerm)
        );

        if (!matchesCode && !matchesProperty && !matchesOrg && !matchesTenant)
          return false;
      }

      // Rent filter (client-side)
      const baseRent = parseFloat(unit.baseRent);
      if (baseRent < filterOptions.rent[0] || baseRent > filterOptions.rent[1])
        return false;

      return true;
    });
  }, [transformedUnits, filterOptions.search, filterOptions.rent]);

  // ============ EVENT HANDLERS ============
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilterOptions((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilterOptions({
      property: null,
      status: [],
      organization: null,
      rent: DEFAULT_RENT_RANGE,
      search: "",
    });
    setCurrentPage(DEFAULT_CURRENT_PAGE);
    toast.success("Filters reset");
  };

  const toggleUnitSelection = (id: string) => {
    setSelectedUnits((prev) =>
      prev.includes(id) ? prev.filter((unitId) => unitId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUnits.length === filteredUnits.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(filteredUnits.map((unit) => unit.id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(DEFAULT_CURRENT_PAGE);
  };

  const exportToCSV = () => {
    if (filteredUnits.length === 0) {
      toast.error("No units to export");
      return;
    }
    toast.success(`Exported ${filteredUnits.length} units to CSV`);
  };

  const bulkStatusChange = (
    status: "vacant" | "occupied" | "unavailable" | "reserved"
  ) => {
    if (selectedUnits.length === 0) {
      toast.error("No units selected");
      return;
    }
    toast.success(
      `Changed status to ${status} for ${selectedUnits.length} units`
    );
  };

  const printLabels = () => {
    if (selectedUnits.length === 0) {
      toast.error("No units selected");
      return;
    }
    toast.success(`Printed labels for ${selectedUnits.length} units`);
  };

  const handleSearchChange = (value: string) => {
    handleFilterChange("search", value);
  };

  // ============ LOADING AND ERROR STATES ============
  const loading = isLoading || organizationsLoading || propertiesLoading;

  if (loading) {
    return (
      <div className="container flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Error loading units. Please try again later.
        </div>
      </div>
    );
  }

  // ============ RENDER ============
  return (
    <div className="container relative">
      <Toaster position="top-right" />

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterPanel
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          onApply={() => {}}
          properties={filteredProperties}
          organizations={organizations}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Units</h1>
          <p className="text-sm text-gray-500">
            Manage all property units in one place
          </p>
        </div>
        
        {/* Filter Badges */}
        <div className="flex items-center gap-2">
          {(filterOptions.organization || filterOptions.property || filterOptions.status.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.organization && (
                <div className="badge badge-secondary badge-lg">
                  Org: {
                    organizations.find((o) => o.id === filterOptions.organization)?.name
                  }
                </div>
              )}
              {filterOptions.property && (
                <div className="badge badge-primary badge-lg">
                  Property: {
                    properties.find((p) => p.id === filterOptions.property)?.name
                  }
                </div>
              )}
              {filterOptions.status.length > 0 && (
                <div className="badge badge-accent badge-lg">
                  Status: {filterOptions.status.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            searchValue={filterOptions.search}
            onSearchChange={handleSearchChange}
            onToggleFilters={() => setShowFilterModal(true)}
            showFilters={showFilterModal}
            placeholder="Search units by code, property, tenant, or organization..."
          />
        </div>
      </div>

      {/* Bulk Operations Section */}
      <BulkOperations
        selectedCount={selectedUnits.length}
        onBulkStatusChange={bulkStatusChange}
        onExport={exportToCSV}
        onPrint={printLabels}
        onClearSelection={() => setSelectedUnits([])}
      />

      {/* Units Table Section */}
      <UnitsTable
        units={filteredUnits}
        selectedUnits={selectedUnits}
        onToggleUnitSelection={toggleUnitSelection}
        onToggleSelectAll={toggleSelectAll}
      />

      {/* Table Footer Section */}
      <TableFooter
        filteredCount={filteredUnits.length}
        totalCount={transformedUnits.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onExport={exportToCSV}
        onPrint={printLabels}
        onResetFilters={resetFilters}
      />
    </div>
  );
};