// leaseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { 
  Lease,
  TLeaseInput,
  TPartialLeaseInput,
  TLeaseQueryParams,
  TLeaseStatusChangeInput,
  TLeaseRenewalInput,
  TLeaseWithDetails,
  TPaginatedLeasesResponse,
  TLeaseBalance,
  TLeaseStats,
  TAnalyticsFilters,
  TTimeSeriesData,
  TDashboardData
} from "../../types/lease.types";

export const leaseApi = createApi({
  reducerPath: "leaseApi",

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

  tagTypes: ["Lease", "Analytics"],
  endpoints: (builder) => ({
    // Get all leases with optional filtering
    getLeases: builder.query<TPaginatedLeasesResponse, TLeaseQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.organizationId) queryParams.append("organizationId", params.organizationId);
        if (params.propertyId) queryParams.append("propertyId", params.propertyId);
        if (params.tenantUserId) queryParams.append("tenantUserId", params.tenantUserId);
        if (params.status) queryParams.append("status", params.status);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        
        return `leases?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Lease" as const, id })),
              { type: "Lease", id: "LIST" },
            ]
          : [{ type: "Lease", id: "LIST" }],
    }),

    // Get lease by ID
    getLeaseById: builder.query<TLeaseWithDetails, string>({
      query: (id) => `leases/${id}`,
      providesTags: (_, __, id) => [{ type: "Lease", id }],
    }),

    // Create new lease
    createLease: builder.mutation<Lease, TLeaseInput>({
      query: (leaseData) => ({
        url: "leases",
        method: "POST",
        body: leaseData,
      }),
      invalidatesTags: [{ type: "Lease", id: "LIST" }, { type: "Analytics", id: "LIST" }],
    }),

    // Update lease
    updateLease: builder.mutation<Lease, { id: string; leaseData: TPartialLeaseInput }>({
      query: ({ id, leaseData }) => ({
        url: `leases/${id}`,
        method: "PUT",
        body: leaseData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Lease", id },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Delete lease
    deleteLease: builder.mutation<Lease, string>({
      query: (id) => ({
        url: `leases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Lease", id },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Activate lease
    activateLease: builder.mutation<Lease, { id: string; statusData: TLeaseStatusChangeInput }>({
      query: ({ id, statusData }) => ({
        url: `leases/${id}/activate`,
        method: "POST",
        body: statusData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Lease", id },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Terminate lease
    terminateLease: builder.mutation<Lease, { id: string; statusData: TLeaseStatusChangeInput }>({
      query: ({ id, statusData }) => ({
        url: `leases/${id}/terminate`,
        method: "POST",
        body: statusData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Lease", id },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Renew lease
    renewLease: builder.mutation<Lease, { id: string; renewalData: TLeaseRenewalInput }>({
      query: ({ id, renewalData }) => ({
        url: `leases/${id}/renew`,
        method: "POST",
        body: renewalData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Lease", id },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Cancel lease
    cancelLease: builder.mutation<Lease, { id: string; statusData: TLeaseStatusChangeInput }>({
      query: ({ id, statusData }) => ({
        url: `leases/${id}/cancel`,
        method: "POST",
        body: statusData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Lease", id },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Update lease status
    updateLeaseStatus: builder.mutation<Lease, { id: string; statusData: TLeaseStatusChangeInput }>({
      query: ({ id, statusData }) => ({
        url: `leases/${id}/status`,
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Lease", id },
        { type: "Analytics", id: "LIST" }
      ],
    }),

    // Get leases by tenant
    getLeasesByTenant: builder.query<Lease[], string>({
      query: (userId) => `leases/tenant/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Lease" as const, id })),
              { type: "Lease", id: "LIST" },
            ]
          : [{ type: "Lease", id: "LIST" }],
    }),

    // Get leases by property
    getLeasesByProperty: builder.query<Lease[], string>({
      query: (propertyId) => `leases/property/${propertyId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Lease" as const, id })),
              { type: "Lease", id: "LIST" },
            ]
          : [{ type: "Lease", id: "LIST" }],
    }),

    // Get lease balance
    getLeaseBalance: builder.query<TLeaseBalance, string>({
      query: (id) => `leases/${id}/balance`,
      providesTags: (_, __, id) => [{ type: "Lease", id }],
    }),

    // Analytics Endpoints

    // Get lease analytics overview
    getLeaseAnalyticsOverview: builder.query<TLeaseStats, TAnalyticsFilters>({
      query: (filters) => {
        const queryParams = new URLSearchParams();
        
        if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
        if (filters.propertyId) queryParams.append("propertyId", filters.propertyId);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        
        return `leases/analytics/overview?${queryParams.toString()}`;
      },
      providesTags: [{ type: "Analytics", id: "OVERVIEW" }],
    }),

    // Get lease status distribution
    getLeaseStatusAnalytics: builder.query<TLeaseStats[], TAnalyticsFilters>({
      query: (filters) => {
        const queryParams = new URLSearchParams();
        
        if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
        if (filters.propertyId) queryParams.append("propertyId", filters.propertyId);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        
        return `leases/analytics/status-distribution?${queryParams.toString()}`;
      },
      providesTags: [{ type: "Analytics", id: "STATUS" }],
    }),

    // Get lease trend analytics
    getLeaseTrendAnalytics: builder.query<TTimeSeriesData[], TAnalyticsFilters>({
      query: (filters) => {
        const queryParams = new URLSearchParams();
        
        if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
        if (filters.propertyId) queryParams.append("propertyId", filters.propertyId);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        
        return `leases/analytics/trend?${queryParams.toString()}`;
      },
      providesTags: [{ type: "Analytics", id: "TREND" }],
    }),

    // Get comprehensive dashboard data
    getLeaseDashboard: builder.query<TDashboardData, TAnalyticsFilters>({
      query: (filters) => {
        const queryParams = new URLSearchParams();
        
        if (filters.organizationId) queryParams.append("organizationId", filters.organizationId);
        if (filters.propertyId) queryParams.append("propertyId", filters.propertyId);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        
        return `leases/analytics/dashboard?${queryParams.toString()}`;
      },
      providesTags: [{ type: "Analytics", id: "DASHBOARD" }],
    }),

    // Refresh analytics data
    refreshAnalytics: builder.mutation<void, void>({
      query: () => ({
        url: 'leases/analytics/refresh',
        method: 'POST',
      }),
      invalidatesTags: [{ type: "Analytics", id: "LIST" }],
    }),
  }),
});

export const {
  useGetLeasesQuery,
  useGetLeaseByIdQuery,
  useCreateLeaseMutation,
  useUpdateLeaseMutation,
  useDeleteLeaseMutation,
  useActivateLeaseMutation,
  useTerminateLeaseMutation,
  useRenewLeaseMutation,
  useCancelLeaseMutation,
  useUpdateLeaseStatusMutation,
  useGetLeasesByTenantQuery,
  useGetLeasesByPropertyQuery,
  useGetLeaseBalanceQuery,
  
  // Analytics hooks
  useGetLeaseAnalyticsOverviewQuery,
  useGetLeaseStatusAnalyticsQuery,
  useGetLeaseTrendAnalyticsQuery,
  useGetLeaseDashboardQuery,
  useRefreshAnalyticsMutation,
} = leaseApi;