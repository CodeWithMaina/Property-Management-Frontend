import type { BaseEntity, MetadataEntity } from "./base.types";
import type { LeaseStatusEnum } from "./enum.types";
import type { Tenant } from "./user.types";

// ---------- Lease Types ----------
export interface Lease extends BaseEntity, MetadataEntity {
  id: string;
  organizationId: string;
  propertyId: string;
  unitId: string;
  tenantUserId: string;
  tenant: Tenant;
  status: LeaseStatusEnum;
  startDate: string;
  endDate?: string;
  rentAmount: string;
  depositAmount: string;
  dueDayOfMonth: number;
  billingCurrency: string;
  lateFeePercent?: string;
  notes?: string;
}
