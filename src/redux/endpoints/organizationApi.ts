import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { 
  TOrganization,
  TOrganizationInput,
  TPartialOrganizationInput,
  TOrganizationQueryParams,
  TPaginatedOrganizationsResponse,
  TOrganizationUser,
} from "../../types/organization.types";
import type { TInviteUserInput } from "../../types/user.types";

export const organizationApi = createApi({
  reducerPath: "organizationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),

  tagTypes: ["Organization", "OrganizationUser"],
  endpoints: (builder) => ({
    // Get all organizations with optional filtering
    getOrganizations: builder.query<TPaginatedOrganizationsResponse, TOrganizationQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        
        return `organizations?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Organization" as const, id })),
              { type: "Organization", id: "LIST" },
            ]
          : [{ type: "Organization", id: "LIST" }],
    }),

    // Get organization by ID
    getOrganizationById: builder.query<TOrganization, string>({
      query: (id) => `organizations/${id}`,
      providesTags: (_, __, id) => [{ type: "Organization", id }],
    }),

    // Create new organization
    createOrganization: builder.mutation<TOrganization, TOrganizationInput>({
      query: (organizationData) => ({
        url: "organizations",
        method: "POST",
        body: organizationData,
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),

    // Update organization
    updateOrganization: builder.mutation<TOrganization, { id: string; organizationData: TPartialOrganizationInput }>({
      query: ({ id, organizationData }) => ({
        url: `organizations/${id}`,
        method: "PUT",
        body: organizationData,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Organization", id }],
    }),

    // Delete organization (soft delete)
    deleteOrganization: builder.mutation<TOrganization, string>({
      query: (id) => ({
        url: `organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Organization", id }],
    }),

    // Get organization users
    getOrganizationUsers: builder.query<TOrganizationUser[], string>({
      query: (organizationId) => `organizations/${organizationId}/users`,
      providesTags: (_, __, organizationId) => [{ type: "OrganizationUser", id: organizationId }],
    }),

    // Invite user to organization
    inviteUserToOrganization: builder.mutation<void, { organizationId: string; inviteData: TInviteUserInput }>({
      query: ({ organizationId, inviteData }) => ({
        url: `organizations/${organizationId}/invite`,
        method: "POST",
        body: inviteData,
      }),
      invalidatesTags: (_, __, { organizationId }) => [{ type: "OrganizationUser", id: organizationId }],
    }),

    // Remove user from organization
    removeUserFromOrganization: builder.mutation<void, { organizationId: string; userId: string }>({
      query: ({ organizationId, userId }) => ({
        url: `organizations/${organizationId}/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { organizationId }) => [{ type: "OrganizationUser", id: organizationId }],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetOrganizationUsersQuery,
  useInviteUserToOrganizationMutation,
  useRemoveUserFromOrganizationMutation,
} = organizationApi;