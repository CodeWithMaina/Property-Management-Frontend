import type { BaseEntity } from "./base.types";

export interface Amenity extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
  organization?: {
    id: string;
    name: string;
  };
}

export interface UnitAmenity extends BaseEntity {
  unitId: string;
  amenityId: string;
  amenity: Amenity;
}

/**
 * Base amenity input type for creating new amenities
 */
export type TAmenityInput = {
  organizationId: string;
  name: string;
  description?: string;
};

/**
 * Partial amenity input type for updating existing amenities
 */
export type TPartialAmenityInput = Partial<TAmenityInput> & {
  organizationId?: string;
};

/**
 * Query parameters for fetching amenities with filtering and pagination
 */
export type TAmenityQueryParams = {
  organizationName?: string;
  amenityName?: string;
  description?: string;
  organizationId?: string;
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
};

/**
 * Paginated response structure for amenities
 */
export type TPaginatedAmenitiesResponse = {
  data: Amenity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

/**
 * Validation error response type
 */
export type TAmenityValidationError = {
  field: string;
  message: string;
  value?: unknown;
};

/**
 * API response wrapper for consistent response structure
 */
export type TAmenityApiResponse<T = Amenity> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: TAmenityValidationError[];
  pagination?: TPaginatedAmenitiesResponse["pagination"];
};

/**
 * Error types specific to amenity operations
 */
export type AmenityErrorCode =
  | "AMENITY_NOT_FOUND"
  | "DUPLICATE_AMENITY_NAME"
  | "ORGANIZATION_NOT_FOUND"
  | "AMENITY_IN_USE"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED";

/**
 * Stats type for amenity usage analytics
 */
export type TAmenityStats = {
  amenityId: string;
  totalUnits: number;
  usagePercentage: number;
  popularRank: number;
  createdAt: Date;
  lastAssignedAt?: Date;
};

export interface AmenityFilterFormData {
  organizationName: string;
  amenityName: string;
  description: string;
  isActive: string;
  limit: number;
  organizationId?: string;
}

export interface AmenityFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  queryParams: TAmenityQueryParams;
  setQueryParams: (params: TAmenityQueryParams) => void;
}

export interface CreateAmenityProps {
  /**
   * Optional pre-selected organization ID
   * If provided, the organization selector will be disabled
   */
  preselectedOrganizationId?: string;
  /**
   * Callback function triggered after successful amenity creation
   * @param amenity - The created amenity data
   */
  onSuccess?: (amenity: TAmenityInput) => void;
  /**
   * Callback function triggered when the user cancels the creation
   */
  onCancel?: () => void;
  /**
   * Default values for the form fields
   */
  defaultValues?: Partial<Omit<TAmenityInput, "organizationId">>;
  /**
   * Whether to show the organization selector
   * @default true
   */
  showOrganizationSelector?: boolean;
}
