import type { BaseEntity } from "./base.types";
import type { ActivityActionEnum } from "./enum.types";

// ---------- Activity Log Types ----------
export interface ActivityLog extends BaseEntity {
  organizationId?: string;
  actorUserId?: string;
  action: ActivityActionEnum;
  targetTable: string;
  targetId: string;
  description?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}