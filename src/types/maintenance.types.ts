import type { BaseEntity, MetadataEntity } from "./base.types";
import type { MaintenanceStatusEnum, PriorityEnum } from "./enum.types";

// ---------- Maintenance Types ----------
export interface MaintenanceRequest extends BaseEntity, MetadataEntity {
  organizationId: string;
  propertyId: string;
  unitId?: string;
  createdByUserId: string;
  assignedToUserId?: string;
  title: string;
  description?: string;
  status: MaintenanceStatusEnum;
  priority: PriorityEnum;
  scheduledAt?: string;
  resolvedAt?: string;
  costAmount?: string;
}

export interface MaintenanceComment extends BaseEntity {
  maintenanceRequestId: string;
  authorUserId: string;
  body: string;
}

export interface MaintenanceAttachment extends BaseEntity {
  maintenanceRequestId: string;
  fileUrl: string;
  fileName?: string;
  contentType?: string;
  sizeBytes?: number;
}