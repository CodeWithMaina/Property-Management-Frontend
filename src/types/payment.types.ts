import type { BaseEntity, MetadataEntity } from "./base.types";
import type { PaymentMethodEnum, PaymentStatusEnum } from "./enum.types";

export interface Payment extends BaseEntity, MetadataEntity {
  organizationId: string;
  leaseId?: string;
  receivedFromUserId?: string;
  receivedByUserId?: string;
  method: PaymentMethodEnum;
  status: PaymentStatusEnum;
  amount: string;
  currency: string;
  referenceCode?: string;
  narrative?: string;
  receivedAt: string;
}

export interface PaymentAllocation extends BaseEntity {
  paymentId: string;
  invoiceId: string;
  amountApplied: string;
}