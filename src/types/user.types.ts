// user.types.ts
import type { BaseEntity, MetadataEntity } from "./base.types";
import type { UserRoleEnum } from "./enum.types";

export interface User extends BaseEntity, MetadataEntity {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  avatarUrl?: string;
}

export interface UserOrganization extends BaseEntity {
  userId: string;
  organizationId: string;
  role: UserRoleEnum;
  isPrimary: boolean;
  isActive: boolean; // Add this if needed
  user: User; // Add this missing property
}

export interface PropertyManager extends BaseEntity {
  id: string;
  propertyId: string;
  userId: string;
  role: string;
  createdAt: string;
  user: User;
}

export interface Tenant {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}














export interface TUser extends MetadataEntity {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  lastLoginAt?: string;
}

export interface TUserInput extends MetadataEntity {
  fullName: string;
  email: string;
  phone: string;
  isActive?: boolean;
  password?: string;
}

export type TPartialUserInput = Partial<TUserInput>;

export interface TUserQueryParams {
  organizationId?: string;
  isActive?: boolean;
  role?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface TPaginatedUsersResponse {
  data: TUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TUserOrganization {
  id: string;
  organizationId: string;
  role: string;
  isPrimary: boolean;
  isActive: boolean;
  organization: {
    id: string;
    name: string;
    legalName: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TInviteUserInput {
  email: string;
  role: string;
  organizationId: string;
  invitedBy: string;
}

export interface TInviteAcceptInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface TUserWithOrganizations extends TUser {
  organizations: TUserOrganization[];
}

export interface TUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
}

export interface TLoginCredentials {
  email: string;
  password: string;
}

export interface TAuthResponse {
  user: TUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TPasswordResetRequest {
  email: string;
}

export interface TPasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface TEmailVerificationRequest {
  email: string;
}

export interface TEmailVerificationConfirm {
  token: string;
}

export interface TPhoneVerificationRequest {
  phone: string;
}

export interface TPhoneVerificationConfirm {
  phone: string;
  code: string;
}

export interface TUserPreferences {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}