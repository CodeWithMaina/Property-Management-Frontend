// organization.types.ts
import type { BaseEntity, MetadataEntity } from "./base.types";

export interface Organization extends BaseEntity, MetadataEntity {
  id: string;
  name: string;
  legalName?: string;
  taxId?: string;
  isActive: boolean;
}




export interface TOrganization extends BaseEntity, MetadataEntity {
  name: string;
  legalName: string;
  taxId: string;
  isActive: boolean;
  deletedAt?: string;
}

export interface TOrganizationInput extends MetadataEntity {
  name: string;
  legalName: string;
  taxId: string;
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
  data: TOrganization[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
    phone: string;
    isActive: boolean;
  };
}

// export interface TInviteUserInput {
//   email: string;
//   role: string;
//   organizationId: string;
//   invitedBy: string;
// }

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