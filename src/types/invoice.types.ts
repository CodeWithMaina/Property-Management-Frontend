import type { BaseEntity, MetadataEntity } from "./base.types";
import type { InvoiceStatusEnum } from "./enum.types";

// ---------- Invoicing Types ----------
export interface Invoice extends BaseEntity, MetadataEntity {
  organizationId: string;
  leaseId: string;
  invoiceNumber: string;
  status: InvoiceStatusEnum;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotalAmount: string;
  taxAmount: string;
  totalAmount: string;
  balanceAmount: string;
  notes?: string;
}

export interface InvoiceItem extends BaseEntity, MetadataEntity {
  invoiceId: string;
  description: string;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
}