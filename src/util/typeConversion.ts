import type { Property } from "../types/property.types";
import type { TUnitInput, TUnitWithDetails, Unit } from "../types/unit.types";

// ---------- Type Conversion Helpers ----------
export function convertUnitToInput(unit: Unit): TUnitInput {
  return {
    propertyId: unit.propertyId,
    code: unit.code,
    floor: unit.floor ? Number(unit.floor) : undefined,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    sizeSqm: unit.sizeSqm ? Number(unit.sizeSqm) : undefined,
    baseRent: Number(unit.baseRent),
    status: unit.status,
    isActive: unit.isActive,
    metadata: unit.metadata,
  };
}

export function convertInputToUnit(input: TUnitInput): Partial<Unit> {
  return {
    propertyId: input.propertyId,
    code: input.code,
    floor: input.floor,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    sizeSqm: input.sizeSqm?.toString(),
    baseRent: input.baseRent.toString(),
    status: input.status,
    isActive: input.isActive,
    metadata: input.metadata,
  };
}

// ============ TRANSFORM FUNCTIONS ============

export const transformUnitData = (unit: TUnitWithDetails): Unit => {
  // The property should already have all required fields if the API is consistent
  // Add fallbacks only for optional fields that might be missing
  const transformedProperty: Property = {
    ...unit.property,
    isActive: unit.property.isActive ?? true,
    createdAt: unit.property.createdAt ?? new Date().toISOString(),
    updatedAt: unit.property.updatedAt ?? new Date().toISOString(),
    metadata: unit.property.metadata ?? {},
    // Ensure optional address fields are properly handled
    addressLine1: unit.property.addressLine1 ?? '',
    addressLine2: unit.property.addressLine2,
    city: unit.property.city ?? '',
    state: unit.property.state ?? '',
    postalCode: unit.property.postalCode,
    country: unit.property.country,
    timezone: unit.property.timezone,
    description: unit.property.description,
  };

  return {
    ...unit,
    property: transformedProperty,
  };
  };

export const extractProperties = (units: TUnitWithDetails[]): Property[] => {
  const propertyMap = new Map<string, Property>();
  
  units.forEach(unit => {
    if (!propertyMap.has(unit.property.id)) {
      propertyMap.set(unit.property.id, unit.property);
    }
  });
  
  return Array.from(propertyMap.values());
};

export const formatCurrency = (amount: string): string => {
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    vacant: "bg-green-100 text-green-800 border-green-200",
    occupied: "bg-blue-100 text-blue-800 border-blue-200",
    unavailable: "bg-yellow-100 text-yellow-800 border-yellow-200",
    reserved: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};
