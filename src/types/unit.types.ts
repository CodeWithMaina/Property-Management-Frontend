import type { UnitAmenity } from "./amenity.types";
import type { BaseEntity, MetadataEntity } from "./base.types";
import type { UnitStatusEnum } from "./enum.types";
import type { Lease } from "./lease.types";
import type { Organization } from "./organization.types";
import type { Property } from "./property.types";

export interface Unit extends BaseEntity, MetadataEntity {
  propertyId: string;
  code: string;
  floor?: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqm?: string;
  baseRent: string;
  status: UnitStatusEnum;
  isActive: boolean;
  property: Property;
  unitAmenities: UnitAmenity[];
  leases: Lease[];
}


export interface FilterOptions {
  property: string | null;
  status: UnitStatusEnum[];
  organization: string | null;
  rent: [number, number];
  search: string;
}

export interface UnitActionsDropdownProps {
  unit: Unit;
}

export interface FilterPanelProps {
  filterOptions: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
  onReset: () => void;
  onApply: () => void;
  properties: Property[];
  organizations: Organization[];
}

export interface BulkOperationsProps {
  selectedCount: number;
  onBulkStatusChange: (status: UnitStatusEnum) => void;
  onExport: () => void;
  onPrint: () => void;
  onClearSelection: () => void;
}

export interface UnitsTableProps {
  units: Unit[];
  selectedUnits: string[];
  onToggleUnitSelection: (id: string) => void;
  onToggleSelectAll: () => void;
}

export interface TableFooterProps {
  filteredCount: number;
  totalCount: number;
  onExport: () => void;
  onPrint: () => void;
  onResetFilters: () => void;
}

export interface ApiUnitsResponse {
  success: boolean;
  message: string;
  data: Unit[];
  errorCode: string | null;
  errors: any;
  meta: {
    pagination: {
      total: string;
      count: number;
      perPage: number;
      currentPage: number;
      totalPages: number;
      links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
      };
    };
  };
  timestamp: string;
}

// ---------- Unit-Specific Types for API Responses ----------
export interface TUnitInput {
  propertyId: string;
  code: string;
  floor?: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqm?: number;
  baseRent: number;
  status: UnitStatusEnum;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface TPartialUnitInput {
  propertyId?: string;
  code?: string;
  floor?: number | null;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqm?: number | null;
  baseRent?: number;
  status?: UnitStatusEnum;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface TUnitQueryParams {
  propertyId?: string;
  organizationId?: string;
  status?: string; // Changed to string to accept comma-separated values
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string; // Added search parameter
}
export interface TUnitAmenity {
  id: string;
  name: string;
  description?: string;
  unitAmenityId: string;
  createdAt: string;
}

export interface TUnitAmenityInput {
  amenityId: string;
}

export interface TUnitStatusChangeInput {
  reason?: string;
  notes?: string;
}

// ---------- Detailed Response Types ----------
export interface TUnitWithDetails extends Unit {
  property: Property
  unitAmenities: UnitAmenity[];
  leases: Lease[];
}

export interface TPaginatedUnitsResponse {
  data: TUnitWithDetails[];
  pagination: {
    total: number;
    count: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
    links: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
    };
  };
  message: string;
  status: string;
}

// ---------- API Response Types ----------
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    count: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
    links: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
    };
  };
}

export type Status = 'vacant' | 'occupied' | 'maintenance' | 'reserved';

export interface UnitActionsDropdownProps {
  unit: Unit;
}


export interface TUnitStats {
  total: number;
  active: number;
  inactive: number;
  byStatus: Record<string, number>;
  byBedrooms: Record<number, number>;
  byBathrooms: Record<number, number>;
  occupancyRate: number;
  totalRevenuePotential: number;
  averageRent: number;
}

export interface TPropertyStats {
  propertyId: string;
  propertyName: string;
  unitCount: number;
  occupiedCount: number;
  vacantCount: number;
  revenuePotential: number;
  occupancyRate: number;
}

export interface TTimeSeriesData {
  date: string;
  occupied: number;
  vacant: number;
  reserved: number;
  unavailable: number;
}



export interface TDashboardData {
  overview: TUnitStats;
  properties: TPropertyStats[];
  trend: TTimeSeriesData[];
  timestamp: string;
}


// export type UnitStatus = "occupied" | "vacant" | "reserved" | "unavailable";

export interface TAnalyticsFilters {
  organizationId?: string | null;
  propertyId?: string | null;
  startDate?: string | null; // ISO yyyy-mm-dd
  endDate?: string | null; // ISO yyyy-mm-dd
  bedrooms?: number[];
  bathrooms?: number[];
  statuses?: Status[];
}

export interface TUnitStats {
  totalUnits: number;
  activeUnits: number;
  inactiveUnits: number;
  occupancyRate: number; // 0-100
  totalRevenuePotential: number;
  averageRent: number;
  statusBreakdown: { name: Status; value: number }[];
}

export interface TPropertyStats {
  id: string;
  name: string;
  unitCount: number;
  occupancyRate: number; // 0-100
  revenuePotential: number;
}

export interface TTimeSeriesPoint {
  date: string; // ISO date
  occupied: number;
  vacant: number;
  reserved: number;
  unavailable: number;
  maintenance: number;
}

export interface TDashboardData {
  overview: TUnitStats;
  properties: TPropertyStats[];
  trend: TTimeSeriesData[];
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | string;
    name: string;
    color: string;
    payload?: any;
  }>;
  label?: string;
}



export interface EditUnitFormData {
  propertyId: string;
  code: string;
  floor?: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqm?: number;
  baseRent: number;
  status: UnitStatusEnum;
  isActive: boolean;
}

export interface CreateUnitFormData {
  propertyId: string;
  code: string;
  floor?: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqm?: number;
  baseRent: number;
  status: UnitStatusEnum;
}




// export interface UnitActionsDropdownProps {
//   unit: Unit;
// }

// export interface TableFooterProps {
//   filteredCount: number;
//   totalCount: number;
//   onExport: () => void;
//   onPrint: () => void;
//   onResetFilters: () => void;
// }

// export interface BulkOperationsProps {
//   selectedCount: number;
//   onBulkStatusChange: (status: "vacant" | "occupied" | "unavailable" | "reserved") => void;
//   onExport: () => void;
//   onPrint: () => void;
//   onClearSelection: () => void;
// }