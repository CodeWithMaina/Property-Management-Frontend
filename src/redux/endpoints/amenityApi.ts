// amenityApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Amenity,
  TAmenityInput,
  TPartialAmenityInput,
  TAmenityQueryParams,
  TPaginatedAmenitiesResponse,
  TAmenityStats,
} from "../../types/amenity.types";

// Helper type for tag invalidation
type TagType = "Amenity" | "OrganizationAmenities";

export const amenityApi = createApi({
  reducerPath: "amenityApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      // Add authentication token if available
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Amenity", "OrganizationAmenities"],

  endpoints: (builder) => ({
    /**
     * @description Get all amenities with optional filtering, pagination, and search
     * @param params - Query parameters for filtering and pagination
     * @returns Paginated list of amenities
     */
    getAmenities: builder.query<TPaginatedAmenitiesResponse, TAmenityQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.organizationId) queryParams.append("organizationId", params.organizationId);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
        
        return `amenities?${queryParams.toString()}`;
      },
      providesTags: (result) => {
        const tags: Array<{ type: TagType; id?: string }> = [
          { type: "Amenity", id: "LIST" },
        ];

        if (result) {
          tags.push(
            ...result.data.map((amenity) => ({
              type: "Amenity" as const,
              id: amenity.id,
            }))
          );
        }

        return tags;
      },
    }),

    /**
     * @description Get amenities for a specific organization
     * @param organizationId - UUID of the organization
     * @returns List of amenities belonging to the organization
     */
    getAmenitiesByOrganization: builder.query<Amenity[], string>({
      query: (organizationId) => `amenities/organization/${organizationId}`,
      providesTags: (result, _, organizationId) => {
        const tags: Array<{ type: TagType; id?: string }> = [
          { type: "OrganizationAmenities", id: organizationId },
        ];

        if (result) {
          tags.push(
            ...result.map((amenity) => ({
              type: "Amenity" as const,
              id: amenity.id,
            }))
          );
        }

        return tags;
      },
    }),

    /**
     * @description Get a specific amenity by ID
     * @param id - UUID of the amenity
     * @returns Amenity details
     */
    getAmenityById: builder.query<Amenity, string>({
      query: (id) => `amenities/${id}`,
      providesTags: (_, __, id) => [{ type: "Amenity", id }],
    }),

    /**
     * @description Create a new amenity
     * @param amenityData - Amenity creation data
     * @returns Created amenity object
     */
    createAmenity: builder.mutation<Amenity, TAmenityInput>({
      query: (amenityData) => ({
        url: "amenities",
        method: "POST",
        body: amenityData,
      }),
      invalidatesTags: (result) => {
        const tags: Array<{ type: TagType; id?: string }> = [
          { type: "Amenity", id: "LIST" },
        ];

        if (result) {
          tags.push({ type: "OrganizationAmenities", id: result.organizationId });
        }

        return tags;
      },
    }),

    /**
     * @description Update an existing amenity
     * @param param0 - Object containing amenity ID and update data
     * @returns Updated amenity object
     */
    updateAmenity: builder.mutation<Amenity, { id: string; amenityData: TPartialAmenityInput }>({
      query: ({ id, amenityData }) => ({
        url: `amenities/${id}`,
        method: "PUT",
        body: amenityData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Amenity", id },
      ],
    }),

    /**
     * @description Delete an amenity
     * @param id - UUID of the amenity to delete
     * @returns Deleted amenity object
     */
    deleteAmenity: builder.mutation<Amenity, string>({
      query: (id) => ({
        url: `amenities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Amenity", id },
        { type: "Amenity", id: "LIST" },
      ],
    }),

    /**
     * @description Get usage statistics for a specific amenity
     * @param amenityId - UUID of the amenity
     * @returns Amenity usage statistics
     */
    getAmenityStats: builder.query<TAmenityStats, string>({
      query: (amenityId) => `amenities/${amenityId}/stats`,
      providesTags: (_, __, amenityId) => [
        { type: "Amenity", id: `${amenityId}-STATS` },
      ],
    }),

    /**
     * @description Check if an amenity name is available within an organization
     * @param param0 - Object containing organizationId and amenity name to check
     * @returns Availability check result
     */
    checkAmenityNameAvailability: builder.query<
      { available: boolean; suggestion?: string }, 
      { organizationId: string; name: string }
    >({
      query: ({ organizationId, name }) => 
        `amenities/check-availability?organizationId=${organizationId}&name=${encodeURIComponent(name)}`,
    }),

    /**
     * @description Bulk create amenities for an organization
     * @param param0 - Object containing organizationId and array of amenity data
     * @returns Array of created amenities
     */
    bulkCreateAmenities: builder.mutation<Amenity[], { organizationId: string; amenities: Omit<TAmenityInput, "organizationId">[] }>({
      query: ({ organizationId, amenities }) => ({
        url: `amenities/bulk`,
        method: "POST",
        body: {
          organizationId,
          amenities,
        },
      }),
      invalidatesTags: (result) => {
        const tags: Array<{ type: TagType; id?: string }> = [
          { type: "Amenity", id: "LIST" },
        ];

        if (result && result.length > 0) {
          // Assuming all amenities belong to the same organization
          const organizationId = result[0]?.organizationId;
          if (organizationId) {
            tags.push({ type: "OrganizationAmenities", id: organizationId });
          }
        }

        return tags;
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAmenitiesQuery,
  useGetAmenitiesByOrganizationQuery,
  useGetAmenityByIdQuery,
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
  useGetAmenityStatsQuery,
  useCheckAmenityNameAvailabilityQuery,
  useBulkCreateAmenitiesMutation,
  // Lazy queries for manual triggering
  useLazyGetAmenitiesQuery,
  useLazyGetAmenityByIdQuery,
  useLazyCheckAmenityNameAvailabilityQuery,
} = amenityApi;