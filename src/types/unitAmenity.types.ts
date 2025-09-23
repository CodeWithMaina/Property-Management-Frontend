
// types/unitAmenity.types.ts
export type TUnitAmenity = {
  id: string;
  unitId: string;
  amenityId: string;
  createdAt: string;
  updatedAt?: string;
};

export type TUnitAmenityInput = {
  unitId: string;
  amenityId: string;
};

export type TUnitAmenityQueryParams = {
  unitId?: string;
  amenityId?: string;
  organizationId?: string;
  page?: number;
  limit?: number;
};

export type TPaginatedUnitAmenitiesResponse = {
  data: TUnitAmenity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TUnitAmenityWithDetails = TUnitAmenity & {
  unit?: {
    id: string;
    code: string;
    propertyId: string;
  };
  amenity?: {
    id: string;
    name: string;
    description?: string;
  };
};