// organization.types.ts
import type { BaseEntity, MetadataEntity } from "./base.types";
import type { Property } from "./property.types";
import type { UserOrganization } from "./user.types";

export interface Organization extends BaseEntity, MetadataEntity {
  id: string;
  name: string;
  legalName?: string;
  taxId?: string;
  isActive: boolean;
}

export interface TOrganization extends BaseEntity, MetadataEntity {
  id: string;
  name: string;
  legalName?: string; // Make optional since it might not always be present
  taxId?: string; // Make optional since it might not always be present
  isActive: boolean;
  userOrganizations?: UserOrganization[];
  properties?: Property[];
  createdAt: string;
  updatedAt: string;
}

export interface TOrganizationInput extends MetadataEntity {
  name: string;
  legalName?: string;
  taxId?: string;
  isActive?: boolean;
}

export type TPartialOrganizationInput = Partial<TOrganizationInput>;

export interface TOrganizationQueryParams {
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface TPaginatedOrganizationsResponse {
  success: boolean;
  message: string;
  data: TOrganization[];
  errorCode: string | null;
  errors: any | null;
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

export interface TOrganizationUser extends BaseEntity{
  userId: string;
  organizationId: string;
  role: string;
  isPrimary: boolean;
  isActive: boolean;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string; // Make optional
    isActive: boolean;
  };
}

export interface TOrganizationMembership extends BaseEntity {
  userId: string;
  organizationId: string;
  role: string;
  isPrimary: boolean;
  isActive: boolean;
}

export interface TOrganizationWithStats extends TOrganization {
  stats: {
    totalProperties: number;
    totalUnits: number;
    totalUsers: number;
    activeUsers: number;
  };
}