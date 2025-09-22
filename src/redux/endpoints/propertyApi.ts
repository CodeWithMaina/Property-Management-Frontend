import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { 
  Property,
  TPropertyInput,
  TPartialPropertyInput,
  TPropertyQueryParams,
  TPaginatedPropertiesResponse,
  TPropertyStats
} from "../../types/property.types";

export const propertyApi = createApi({
  reducerPath: "propertyApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),

  tagTypes: ["Property"],
  endpoints: (builder) => ({
    // Get all properties with optional filtering
    getProperties: builder.query<TPaginatedPropertiesResponse, TPropertyQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.organizationId) queryParams.append("organizationId", params.organizationId);
        if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        
        return `properties?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Property" as const, id })),
              { type: "Property", id: "LIST" },
            ]
          : [{ type: "Property", id: "LIST" }],
    }),

    // Get property by ID
    getPropertyById: builder.query<Property, string>({
      query: (id) => `properties/${id}`,
      providesTags: (_, __, id) => [{ type: "Property", id }],
    }),

    // Create new property
    createProperty: builder.mutation<Property, TPropertyInput>({
      query: (propertyData) => ({
        url: "properties",
        method: "POST",
        body: propertyData,
      }),
      invalidatesTags: [{ type: "Property", id: "LIST" }],
    }),

    // Update property
    updateProperty: builder.mutation<Property, { id: string; propertyData: TPartialPropertyInput }>({
      query: ({ id, propertyData }) => ({
        url: `properties/${id}`,
        method: "PUT",
        body: propertyData,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Property", id }],
    }),

    // Delete property (soft delete)
    deleteProperty: builder.mutation<Property, string>({
      query: (id) => ({
        url: `properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Property", id }],
    }),

    // Restore soft deleted property
    restoreProperty: builder.mutation<Property, string>({
      query: (id) => ({
        url: `properties/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Property", id }],
    }),

    // Hard delete property
    hardDeleteProperty: builder.mutation<void, string>({
      query: (id) => ({
        url: `properties/${id}?hardDelete=true`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Property", id }],
    }),

    // Get property statistics
    getPropertyStats: builder.query<TPropertyStats, string>({
      query: (propertyId) => `properties/${propertyId}/stats`,
      providesTags: (_, __, propertyId) => [{ type: "Property", id: `${propertyId}-STATS` }],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useRestorePropertyMutation,
  useHardDeletePropertyMutation,
  useGetPropertyStatsQuery,
} = propertyApi;