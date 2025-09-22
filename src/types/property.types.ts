// property.types.ts
import type { BaseEntity, MetadataEntity } from "./base.types";
import type { Organization } from "./organization.types";
import type { PropertyManager } from "./user.types";

export interface Property extends BaseEntity, MetadataEntity {
  organizationId: string;
  organization: Organization;
  name: string;
  description?: string;
  propertyManagers?: PropertyManager[];
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  timezone?: string;
  isActive: boolean;
}

export interface TPropertyInput {
  name: string;
  address: string;
  organizationId: string;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  timezone?: string;
}

export type TPartialPropertyInput = Partial<TPropertyInput>;

export interface TPropertyQueryParams {
  organizationId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface TPaginatedPropertiesResponse {
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TPropertyStats {
  id: string;
  name: string;
  unitCount: number;
  occupiedCount?: number;
  vacantCount?: number;
  revenuePotential: number;
  occupancyRate: number;
}