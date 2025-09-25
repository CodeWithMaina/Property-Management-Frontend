import React, { useState, useMemo, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useGetUnitsQuery } from "../../../redux/endpoints/unitApi";
import { useGetOrganizationsQuery } from "../../../redux/endpoints/organizationApi";
import { useGetPropertiesQuery } from "../../../redux/endpoints/propertyApi";
import type {
  FilterOptions,
} from "../../../types/unit.types";
import {
  transformUnitData,
} from "../../../util/typeConversion";
import { SearchBar } from "../../components/common/SearchBar";
import { FilterPanel } from "../../components/units/FilterPanel";
import { BulkOperations } from "../common/BulkOperations";
import { UnitsTable } from "../../components/units/UnitsTable";
import { TableFooter } from "../common/TableFooter";

// ============ MAIN COMPONENT ============
export const UnitsPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    property: null,
    status: [],
    organization: null,
    rent: [0, 100000],
    search: "",
  });

  // Fetch organizations and properties for filters
  const { data: organizationsResponse, isLoading: organizationsLoading } = 
    useGetOrganizationsQuery({ page: 1, limit: 100 });
  
  const { data: propertiesResponse, isLoading: propertiesLoading } = 
    useGetPropertiesQuery({ 
      organizationId: filterOptions.organization || undefined,
      page: 1, 
      limit: 100 
    });

  // Fetch units with filtering
  const { data, error, isLoading, refetch } = useGetUnitsQuery({
    organizationId: filterOptions.organization || undefined,
    propertyId: filterOptions.property || undefined,
    status: filterOptions.status.length > 0 ? filterOptions.status.join(',') : undefined,
    search: filterOptions.search || undefined,
    page: 1,
    limit: 100,
    isActive: true
  });

  // Debounced refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filterOptions, refetch]);

  // Transform API data to match component expectations
  const transformedUnits = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(transformUnitData);
  }, [data]);

  const organizations = useMemo(() => 
    organizationsResponse?.data || [], 
    [organizationsResponse]
  );

  const properties = useMemo(() => 
    propertiesResponse?.data || [], 
    [propertiesResponse]
  );

  const filteredProperties = useMemo(() => 
    filterOptions.organization 
      ? properties.filter(prop => prop.organizationId === filterOptions.organization)
      : properties,
    [properties, filterOptions.organization]
  );

  // Filter units based on filter options (client-side filtering for additional criteria)
  const filteredUnits = useMemo(() => {
    if (!transformedUnits) return [];

    return transformedUnits.filter((unit) => {
      // Search filter (client-side for better UX)
      if (filterOptions.search) {
        const searchTerm = filterOptions.search.toLowerCase();
        const matchesCode = unit.code.toLowerCase().includes(searchTerm);
        const matchesProperty = unit.property.name
          .toLowerCase()
          .includes(searchTerm);
        const matchesOrg = unit.property.organization.name
          .toLowerCase()
          .includes(searchTerm);

        // Check tenant names
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

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilterOptions((prev) => ({ ...prev, [key]: value }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterOptions({
      property: null,
      status: [],
      organization: null,
      rent: [0, 100000],
      search: "",
    });
    toast.success("Filters reset");
  };

  // Toggle unit selection
  const toggleUnitSelection = (id: string) => {
    setSelectedUnits((prev) =>
      prev.includes(id) ? prev.filter((unitId) => unitId !== id) : [...prev, id]
    );
  };

  // Select all units
  const toggleSelectAll = () => {
    if (selectedUnits.length === filteredUnits.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(filteredUnits.map((unit) => unit.id));
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredUnits.length === 0) {
      toast.error("No units to export");
      return;
    }

    // In a real app, this would generate an actual CSV file
    toast.success(`Exported ${filteredUnits.length} units to CSV`);
  };

  // Bulk status change
  const bulkStatusChange = (
    status: "vacant" | "occupied" | "unavailable" | "reserved"
  ) => {
    if (selectedUnits.length === 0) {
      toast.error("No units selected");
      return;
    }

    // In a real app, this would update the status of selected units
    toast.success(
      `Changed status to ${status} for ${selectedUnits.length} units`
    );
  };

  // Print labels
  const printLabels = () => {
    if (selectedUnits.length === 0) {
      toast.error("No units selected");
      return;
    }

    // In a real app, this would print labels for selected units
    toast.success(`Printed labels for ${selectedUnits.length} units`);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleSearchChange = (value: string) => {
    handleFilterChange("search", value);
  };

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

  return (
    <div className="container">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Units</h1>
          <p className="text-sm text-gray-500">
            Manage all property units in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(filterOptions.organization || filterOptions.property) && (
            <div className="badge badge-secondary">
              {filterOptions.property 
                ? `Property: ${properties.find(p => p.id === filterOptions.property)?.name}`
                : filterOptions.organization 
                  ? `Org: ${organizations.find(o => o.id === filterOptions.organization)?.name}`
                  : ''
              }
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm">
        <SearchBar
          searchValue={filterOptions.search}
          onSearchChange={handleSearchChange}
          onToggleFilters={toggleFilters}
          showFilters={showFilters}
          placeholder="Search units by code, property, tenant, or organization..."
        />

        {/* Advanced Filters Panel */}
        {showFilters && (
          <FilterPanel
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            onApply={() => setShowFilters(false)}
            properties={filteredProperties}
            organizations={organizations}
          />
        )}
      </div>

      {/* Bulk Operations */}
      <BulkOperations
        selectedCount={selectedUnits.length}
        onBulkStatusChange={bulkStatusChange}
        onExport={exportToCSV}
        onPrint={printLabels}
        onClearSelection={() => setSelectedUnits([])}
      />

      {/* Units Table */}
      <UnitsTable
        units={filteredUnits}
        selectedUnits={selectedUnits}
        onToggleUnitSelection={toggleUnitSelection}
        onToggleSelectAll={toggleSelectAll}
      />

      {/* Table Footer */}
      <TableFooter
        filteredCount={filteredUnits.length}
        totalCount={transformedUnits.length}
        onExport={exportToCSV}
        onPrint={printLabels}
        onResetFilters={resetFilters}
      />
    </div>
  );
};