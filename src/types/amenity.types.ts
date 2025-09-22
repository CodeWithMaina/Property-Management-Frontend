import type { BaseEntity } from "./base.types";

export interface Amenity extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
}

export interface UnitAmenity extends BaseEntity  {
  unitId: string;
  amenityId: string;
  amenity: Amenity;
}


