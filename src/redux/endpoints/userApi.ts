import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { 
  TUser,
  TUserInput,
  TPartialUserInput,
  TUserQueryParams,
  TPaginatedUsersResponse,
  TUserOrganization,
  TInviteAcceptInput,
  TInviteUserInput
} from "../../types/user.types";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),

  tagTypes: ["User", "UserOrganization"],
  endpoints: (builder) => ({
    // Get all users with optional filtering
    getUsers: builder.query<TPaginatedUsersResponse, TUserQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.organizationId) queryParams.append("organizationId", params.organizationId);
        if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
        if (params.role) queryParams.append("role", params.role);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        
        return `users?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // Search users
    searchUsers: builder.query<TUser[], { field: string; value: string }>({
      query: ({ field, value }) => `users/search?${field}=${value}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "User" as const, id }))
          : [{ type: "User", id: "LIST" }],
    }),

    // Get user by ID
    getUserById: builder.query<TUser, string>({
      query: (id) => `users/${id}`,
      providesTags: (_, __, id) => [{ type: "User", id }],
    }),

    // Create new user
    createUser: builder.mutation<TUser, TUserInput>({
      query: (userData) => ({
        url: "users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // Update user
    updateUser: builder.mutation<TUser, { id: string; userData: TPartialUserInput }>({
      query: ({ id, userData }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "User", id }],
    }),

    // Delete user (soft delete)
    deleteUser: builder.mutation<TUser, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "User", id }],
    }),

    // Activate user
    activateUser: builder.mutation<TUser, string>({
      query: (id) => ({
        url: `users/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [{ type: "User", id }],
    }),

    // Deactivate user
    deactivateUser: builder.mutation<TUser, string>({
      query: (id) => ({
        url: `users/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [{ type: "User", id }],
    }),

    // Get user organizations
    getUserOrganizations: builder.query<TUserOrganization[], string>({
      query: (userId) => `users/${userId}/organizations`,
      providesTags: (_, __, userId) => [{ type: "UserOrganization", id: userId }],
    }),

    // Invite user
    inviteUser: builder.mutation<void, TInviteUserInput>({
      query: (inviteData) => ({
        url: "users/invite",
        method: "POST",
        body: inviteData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // Accept invite
    acceptInvite: builder.mutation<TUser, { token: string; acceptData: TInviteAcceptInput }>({
      query: ({ token, acceptData }) => ({
        url: `invites/${token}/accept`,
        method: "POST",
        body: acceptData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useSearchUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useGetUserOrganizationsQuery,
  useInviteUserMutation,
  useAcceptInviteMutation,
} = userApi;