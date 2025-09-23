// unitAmenityApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { TPaginatedUnitAmenitiesResponse, TUnitAmenity, TUnitAmenityInput, TUnitAmenityQueryParams, TUnitAmenityWithDetails } from "../../types/unitAmenity.types";

/**
 * RTK Query API for managing unit amenities
 * 
 * This API provides endpoints for:
 * - Retrieving unit amenities with filtering and pagination
 * - Getting specific unit amenity by IDs
 * - Adding amenities to units
 * - Removing amenities from units
 * 
 * @example
 * // Get all amenities for a unit
 * const { data: amenities } = useGetUnitAmenitiesQuery({ unitId: 'unit-123' });
 * 
 * // Add amenity to unit
 * const [addAmenity] = useAddUnitAmenityMutation();
 * addAmenity({ unitId: 'unit-123', amenityId: 'amenity-456' });
 */
export const unitAmenityApi = createApi({
  reducerPath: "unitAmenityApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    // prepareHeaders: (headers, { getState }) => {
    //   try {
    //     const token =
    //       (getState() as RootState).auth.token || localStorage.getItem("token");
    //     if (token) {
    //       headers.set("Authorization", `Bearer ${token}`);
    //     }
    //     headers.set("Content-Type", "application/json");
    //     return headers;
    //   } catch (error) {
    //     console.error("Error preparing headers:", error);
    //     return headers;
    //   }
    // },
  }),

  tagTypes: ["UnitAmenity"],
  
  endpoints: (builder) => ({
    /**
     * Get all unit amenities with optional filtering and pagination
     * 
     * @param params - Query parameters for filtering and pagination
     * @returns Paginated response containing unit amenities
     * 
     * @example
     * // Get all amenities for a specific unit
     * useGetUnitAmenitiesQuery({ unitId: 'unit-123' })
     * 
     * // Get all amenities with pagination
     * useGetUnitAmenitiesQuery({ page: 1, limit: 20 })
     * 
     * // Get amenities by organization
     * useGetUnitAmenitiesQuery({ organizationId: 'org-123' })
     */
    getUnitAmenities: builder.query<TPaginatedUnitAmenitiesResponse, TUnitAmenityQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.unitId) queryParams.append("unitId", params.unitId);
        if (params.amenityId) queryParams.append("amenityId", params.amenityId);
        if (params.organizationId) queryParams.append("organizationId", params.organizationId);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        
        return `unit-amenities?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "UnitAmenity" as const, id })),
              { type: "UnitAmenity", id: "LIST" },
            ]
          : [{ type: "UnitAmenity", id: "LIST" }],
    }),

    /**
     * Get unit amenity by unit ID and amenity ID
     * 
     * @param unitId - The ID of the unit
     * @param amenityId - The ID of the amenity
     * @returns Unit amenity record with details
     * 
     * @example
     * useGetUnitAmenityByIdQuery({ unitId: 'unit-123', amenityId: 'amenity-456' })
     */
    getUnitAmenityById: builder.query<TUnitAmenityWithDetails, { unitId: string; amenityId: string }>({
      query: ({ unitId, amenityId }) => `unit-amenity/${unitId}/${amenityId}`,
      providesTags: (_, __, { unitId, amenityId }) => [
        { type: "UnitAmenity", id: `${unitId}-${amenityId}` }
      ],
    }),

    /**
     * Create a new unit amenity association
     * 
     * @param unitAmenityData - The unit amenity data to create
     * @returns The created unit amenity record
     * 
     * @example
     * const [createUnitAmenity] = useCreateUnitAmenityMutation();
     * createUnitAmenity({
     *   unitId: 'unit-123',
     *   amenityId: 'amenity-456'
     * });
     */
    createUnitAmenity: builder.mutation<TUnitAmenity, TUnitAmenityInput>({
      query: (unitAmenityData) => ({
        url: "unit-amenity",
        method: "POST",
        body: unitAmenityData,
      }),
      invalidatesTags: (_, __, { unitId }) => [
        { type: "UnitAmenity", id: "LIST" },
        { type: "UnitAmenity", id: `UNIT-${unitId}` }
      ],
    }),

    /**
     * Delete a unit amenity association
     * 
     * @param unitId - The ID of the unit
     * @param amenityId - The ID of the amenity
     * @returns The deleted unit amenity record
     * 
     * @example
     * const [deleteUnitAmenity] = useDeleteUnitAmenityMutation();
     * deleteUnitAmenity({
     *   unitId: 'unit-123',
     *   amenityId: 'amenity-456'
     * });
     */
    deleteUnitAmenity: builder.mutation<TUnitAmenity, { unitId: string; amenityId: string }>({
      query: ({ unitId, amenityId }) => ({
        url: `unit-amenity/${unitId}/${amenityId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { unitId, amenityId }) => [
        { type: "UnitAmenity", id: "LIST" },
        { type: "UnitAmenity", id: `${unitId}-${amenityId}` },
        { type: "UnitAmenity", id: `UNIT-${unitId}` }
      ],
    }),

    /**
     * Get all amenities for a specific unit
     * 
     * @param unitId - The ID of the unit
     * @returns Array of unit amenities for the specified unit
     * 
     * @example
     * useGetAmenitiesByUnitIdQuery('unit-123')
     */
    getAmenitiesByUnitId: builder.query<TUnitAmenity[], string>({
      query: (unitId) => `units/${unitId}/amenities`,
      providesTags: (_, __, unitId) => [
        { type: "UnitAmenity", id: `UNIT-${unitId}` }
      ],
    }),

    /**
     * Batch create multiple unit amenities
     * 
     * @param unitAmenitiesData - Array of unit amenity data to create
     * @returns Array of created unit amenity records
     * 
     * @example
     * const [batchCreateUnitAmenities] = useBatchCreateUnitAmenitiesMutation();
     * batchCreateUnitAmenities([
     *   { unitId: 'unit-123', amenityId: 'amenity-456' },
     *   { unitId: 'unit-123', amenityId: 'amenity-789' }
     * ]);
     */
    batchCreateUnitAmenities: builder.mutation<TUnitAmenity[], TUnitAmenityInput[]>({
      query: (unitAmenitiesData) => ({
        url: "unit-amenities/batch",
        method: "POST",
        body: unitAmenitiesData,
      }),
      invalidatesTags: (_, __, unitAmenities) => [
        { type: "UnitAmenity", id: "LIST" },
        // Invalidate cache for all affected units
        ...Array.from(new Set(unitAmenities.map(({ unitId }) => unitId))).map(unitId => ({
          type: "UnitAmenity" as const,
          id: `UNIT-${unitId}`
        }))
      ],
    }),

    /**
     * Batch delete multiple unit amenities
     * 
     * @param unitAmenityIds - Array of unit amenity IDs to delete
     * @returns Array of deleted unit amenity records
     * 
     * @example
     * const [batchDeleteUnitAmenities] = useBatchDeleteUnitAmenitiesMutation();
     * batchDeleteUnitAmenities([
     *   { unitId: 'unit-123', amenityId: 'amenity-456' },
     *   { unitId: 'unit-123', amenityId: 'amenity-789' }
     * ]);
     */
    batchDeleteUnitAmenities: builder.mutation<TUnitAmenity[], { unitId: string; amenityId: string }[]>({
      query: (unitAmenityIds) => ({
        url: "unit-amenities/batch",
        method: "DELETE",
        body: unitAmenityIds,
      }),
      invalidatesTags: (_, __, unitAmenityIds) => [
        { type: "UnitAmenity", id: "LIST" },
        ...unitAmenityIds.map(({ unitId, amenityId }) => ({
          type: "UnitAmenity" as const,
          id: `${unitId}-${amenityId}`
        })),
        ...Array.from(new Set(unitAmenityIds.map(({ unitId }) => unitId))).map(unitId => ({
          type: "UnitAmenity" as const,
          id: `UNIT-${unitId}`
        }))
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetUnitAmenitiesQuery,
  useGetUnitAmenityByIdQuery,
  useCreateUnitAmenityMutation,
  useDeleteUnitAmenityMutation,
  useGetAmenitiesByUnitIdQuery,
  useBatchCreateUnitAmenitiesMutation,
  useBatchDeleteUnitAmenitiesMutation,
} = unitAmenityApi;