import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { 
  TUnitAmenityInput, 
  Unit,
  TUnitInput,
  TPartialUnitInput,
  TUnitQueryParams,
  TUnitAmenity,
  TUnitStatusChangeInput,
  TUnitWithDetails,
  TPaginatedUnitsResponse, 
  TUnitStats,
  TAnalyticsFilters,
  TPropertyStats,
  TTimeSeriesData,
  TDashboardData
} from "../../types/unit.types";


export const unitsApi = createApi({
  reducerPath: "unitsApi",

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

  tagTypes: ["Unit", "UnitAmenity", "Analytics"],
  endpoints: (builder) => ({
    // Get all units with optional filtering
    getUnits: builder.query<TPaginatedUnitsResponse, TUnitQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.propertyId) queryParams.append("propertyId", params.propertyId);
        if (params.organizationId) queryParams.append("organizationId", params.organizationId);
        if (params.status) queryParams.append("status", params.status);
        if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        
        return `units?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Unit" as const, id })),
              { type: "Unit", id: "LIST" },
            ]
          : [{ type: "Unit", id: "LIST" }],
    }),

    // Get unit by ID
    getUnitById: builder.query<TUnitWithDetails, string>({
      query: (id) => `units/${id}`,
      providesTags: (_, __, id) => [{ type: "Unit", id }],
    }),

    // Create new unit
    createUnit: builder.mutation<Unit, TUnitInput>({
      query: (unitData) => ({
        url: "units",
        method: "POST",
        body: unitData,
      }),
      invalidatesTags: [{ type: "Unit", id: "LIST" }, { type: "Analytics", id: "LIST" }],
    }),

    // Update unit
    updateUnit: builder.mutation<Unit, { id: string; unitData: TPartialUnitInput }>({
      query: ({ id, unitData }) => ({
        url: `units/${id}`,
        method: "PUT",
        body: unitData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Unit", id },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Delete unit (soft delete)
    deleteUnit: builder.mutation<Unit, string>({
      query: (id) => ({
        url: `units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Unit", id },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Get unit amenities
    getUnitAmenities: builder.query<TUnitAmenity[], string>({
      query: (unitId) => `units/${unitId}/amenities`,
      providesTags: (_, __, unitId) => [{ type: "UnitAmenity", id: unitId }],
    }),

    // Add amenity to unit
    addUnitAmenity: builder.mutation<any, { unitId: string; amenityData: TUnitAmenityInput }>({
      query: ({ unitId, amenityData }) => ({
        url: `units/${unitId}/amenities`,
        method: "POST",
        body: amenityData,
      }),
      invalidatesTags: (_, __, { unitId }) => [{ type: "UnitAmenity", id: unitId }],
    }),

    // Remove amenity from unit
    removeUnitAmenity: builder.mutation<any, { unitId: string; amenityId: string }>({
      query: ({ unitId, amenityId }) => ({
        url: `units/${unitId}/amenities/${amenityId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { unitId }) => [{ type: "UnitAmenity", id: unitId }],
    }),

    // Mark unit as occupied
    markUnitOccupied: builder.mutation<Unit, { unitId: string; statusData: TUnitStatusChangeInput }>({
      query: ({ unitId, statusData }) => ({
        url: `units/${unitId}/mark-occupied`,
        method: "POST",
        body: statusData,
      }),
      invalidatesTags: (_, __, { unitId }) => [
        { type: "Unit", id: unitId },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Mark unit as vacant
    markUnitVacant: builder.mutation<Unit, { unitId: string; statusData: TUnitStatusChangeInput }>({
      query: ({ unitId, statusData }) => ({
        url: `units/${unitId}/mark-vacant`,
        method: "POST",
        body: statusData,
      }),
      invalidatesTags: (_, __, { unitId }) => [
        { type: "Unit", id: unitId },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Mark unit as unavailable
    markUnitUnavailable: builder.mutation<Unit, { unitId: string; statusData: TUnitStatusChangeInput }>({
      query: ({ unitId, statusData }) => ({
        url: `units/${unitId}/mark-unavailable`,
        method: "POST",
        body: statusData,
      }),
      invalidatesTags: (_, __, { unitId }) => [
        { type: "Unit", id: unitId },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Analytics Endpoints

    // Get unit analytics overview
    getUnitAnalyticsOverview: builder.query<TUnitStats, TAnalyticsFilters>({
      query: (filters) => {
        const queryParams = new URLSearchParams();
        
        if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
        if (filters.propertyId) queryParams.append("propertyId", filters.propertyId);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        
        return `units/analytics/overview?${queryParams.toString()}`;
      },
      providesTags: [{ type: "Analytics", id: "OVERVIEW" }],
    }),

    // Get property analytics
    getPropertyAnalytics: builder.query<TPropertyStats[], TAnalyticsFilters>({
      query: (filters) => {
        const queryParams = new URLSearchParams();
        
        if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
        if (filters.propertyId) queryParams.append("propertyId", filters.propertyId);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        
        return `units/analytics/properties?${queryParams.toString()}`;
      },
      providesTags: [{ type: "Analytics", id: "PROPERTIES" }],
    }),

    // Get occupancy trend analytics
    getOccupancyTrendAnalytics: builder.query<TTimeSeriesData[], TAnalyticsFilters>({
      query: (filters) => {
        const queryParams = new URLSearchParams();
        
        if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
        if (filters.propertyId) queryParams.append("propertyId", filters.propertyId);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        
        return `units/analytics/occupancy-trend?${queryParams.toString()}`;
      },
      providesTags: [{ type: "Analytics", id: "TREND" }],
    }),

    // Get comprehensive dashboard data
    getUnitDashboard: builder.query<TDashboardData, TAnalyticsFilters>({
      query: (filters) => {
        const queryParams = new URLSearchParams();
        
        if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
        if (filters.propertyId) queryParams.append("propertyId", filters.propertyId);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        
        return `units/analytics/dashboard?${queryParams.toString()}`;
      },
      providesTags: [{ type: "Analytics", id: "DASHBOARD" }],
    }),

    // Refresh analytics data
    refreshAnalytics: builder.mutation<void, void>({
      query: () => ({
        url: 'units/analytics/refresh',
        method: 'POST',
      }),
      invalidatesTags: [{ type: "Analytics", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useGetUnitAmenitiesQuery,
  useAddUnitAmenityMutation,
  useRemoveUnitAmenityMutation,
  useMarkUnitOccupiedMutation,
  useMarkUnitVacantMutation,
  useMarkUnitUnavailableMutation,
  
  // Analytics hooks
  useGetUnitAnalyticsOverviewQuery,
  useGetPropertyAnalyticsQuery,
  useGetOccupancyTrendAnalyticsQuery,
  useGetUnitDashboardQuery,
  useRefreshAnalyticsMutation,
} = unitsApi;