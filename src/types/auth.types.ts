import type { BaseEntity } from "./base.types";
import type { UserRoleEnum } from "./enum.types";

// ---------- Authentication Types ----------
export interface UserAuth extends BaseEntity {
  userId: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpiresAt?: string;
}

export interface RefreshToken extends BaseEntity {
  userId: string;
  token: string;
  deviceId?: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: string;
  isRevoked: boolean;
  revokedAt?: string;
}

export interface Invite extends BaseEntity {
  email: string;
  organizationId: string;
  role: UserRoleEnum;
  invitedByUserId?: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
}
