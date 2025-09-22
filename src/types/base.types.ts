// ---------- Base Types ----------
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MetadataEntity {
  metadata?: Record<string, unknown>;
}