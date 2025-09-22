import type { LeaseStatusEnum, PaymentMethodEnum, UnitStatusEnum } from "./enum.types";

// ---------- Utility Types ----------
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// ---------- Type Guards ----------
export function isUnitStatus(status: string): status is UnitStatusEnum {
  return ["vacant", "reserved", "occupied", "unavailable"].includes(status);
}

export function isLeaseStatus(status: string): status is LeaseStatusEnum {
  return ["draft", "active", "pendingMoveIn", "ended", "terminated", "cancelled"].includes(status);
}

export function isPaymentMethod(method: string): method is PaymentMethodEnum {
  return ["cash", "mpesa", "bankTransfer", "card", "cheque", "other"].includes(method);
}

