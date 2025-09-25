import type { BaseEntity, MetadataEntity } from "./base.types";

export type SearchBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchAction?: (value: string) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
  placeholder?: string;
};

export interface TPaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TSearchParams {
  query: string;
  fields?: string[];
}

export interface TApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface TErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface TFileUpload extends BaseEntity {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface TAuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface TNotification extends MetadataEntity, BaseEntity {
  type: string;
  title: string;
  message: string;
  read: boolean;
  userId: string;
  readAt?: string;
}