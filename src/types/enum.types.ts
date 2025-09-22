// ---------- Enum Types ----------
export type UserRoleEnum = "tenant" | "caretaker" | "admin" | "superAdmin" | "propertyOwner" | "manager";
export type UnitStatusEnum = "vacant" | "reserved" | "occupied" | "unavailable";
export type LeaseStatusEnum = "draft" | "active" | "pendingMoveIn" | "ended" | "terminated" | "cancelled";
export type InvoiceStatusEnum = "draft" | "issued" | "partiallyPaid" | "paid" | "void" | "overdue";
export type PaymentMethodEnum = "cash" | "mpesa" | "bankTransfer" | "card" | "cheque" | "other";
export type PaymentStatusEnum = "pending" | "completed" | "failed" | "refunded" | "cancelled";
export type MaintenanceStatusEnum = "open" | "inProgress" | "onHold" | "resolved" | "closed" | "cancelled";
export type PriorityEnum = "low" | "medium" | "high" | "urgent";
export type ActivityActionEnum = "create" | "update" | "delete" | "statusChange" | "assign" | "unassign" | "comment" | "payment" | "issueInvoice" | "voidInvoice";