import type { BaseEntity, MetadataEntity } from "./base.types";
import type { LeaseStatusEnum } from "./enum.types";
import type { Invoice } from "./invoice.types";
import type { Payment } from "./payment.types";
import type { Property } from "./property.types";
import type { Unit } from "./unit.types";
import type { Tenant } from "./user.types";

// ---------- Lease Types ----------
export interface Lease extends BaseEntity, MetadataEntity {
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


export interface TLeaseInput extends Omit<Lease, 'id' | 'createdAt' | 'updatedAt' | 'tenant'> {
  tenantUserId: string; // Keep tenantUserId for creation
}
export interface TPartialLeaseInput extends Partial<Omit<Lease, 'id' | 'createdAt' | 'updatedAt' | 'tenant'>> {
  tenantUserId?: string;
}

export interface TLeaseQueryParams {
  organizationId?: string;
  propertyId?: string;
  tenantUserId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface TLeaseStatusChangeInput {
  reason?: string;
  notes?: string;
  effectiveDate?: string;
}

export interface TLeaseRenewalInput {
  startDate: string;
  endDate: string;
  rentAmount?: number;
  notes?: string;
}

export interface TLeaseWithDetails extends Lease {
  property?: Property;
  unit?: Unit;
  invoices?: Invoice[];
  payments?: Payment[];
}

export interface TPaginatedLeasesResponse {
  data: Lease[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TLeaseBalance {
  leaseId: string;
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  overdueAmount: number;
  currency: string;
}

export interface TLeaseStats {
  totalLeases: number;
  activeLeases: number;
  draftLeases: number;
  endedLeases: number;
  terminatedLeases: number;
  totalRent: number;
  averageRent: number;
  occupancyRate: number;
}

export interface TAnalyticsFilters {
  organizationId?: string;
  propertyId?: string;
  startDate?: string;
  endDate?: string;
}

export interface TTimeSeriesData {
  date: string;
  value: number;
}

export interface TDashboardData {
  overview: TLeaseStats;
  recentLeases: Lease[];
  upcomingRenewals: Lease[];
  statusDistribution: Record<string, number>;
  trendData: TTimeSeriesData[];
}
