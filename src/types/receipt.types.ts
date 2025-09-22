import type { BaseEntity } from "./base.types";

export interface Receipt extends BaseEntity {
  organizationId: string;
  paymentId: string;
  receiptNumber: string;
  issuedAt: string;
}