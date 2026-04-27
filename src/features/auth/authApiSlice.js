import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // personal profile
    login: builder.mutation({
      query: (data) => {
        return {
          url: `/auth/login/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth", "my-profile"],
    }),

    registration: builder.mutation({
      query: (data) => {
        return {
          url: `/auth/register/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),

    forgotPassword: builder.mutation({
      query: (payload) => {
        return {
          url: `/auth/forget-password`,
          method: "POST",
          body: payload,
        };
      },
    }),

    resetPassword: builder.mutation({
      query: (payload) => {
        const { bodyData, userId, token } = payload;
        return {
          url: `/auth/forget-password/${userId}/${token}`,
          method: "POST",
          body: bodyData,
        };
      },
    }),

    me: builder.query({
      query: () => {
        return {
          url: `/auth/user-details/`,
          method: "GET",
        };
      },
    }),

    changePassword: builder.mutation({
      query: (payload) => {
        return {
          url: `/auth/change-password/`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    updateProfile: builder.mutation({
      query: (payload) => {
        return {
          url: `/auth/me/update/`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    // admin management
    customerList: builder.query({
      query: ({ page = "", page_size = "", search_str = "" } = {}) => {
        return {
          url: `/admin/auth/customers?page=${page}&page_size=${page_size}&search_str=${search_str}`,
          method: "GET",
        };
      },
    }),

    adminUserList: builder.query({
      query: ({ page = "", page_size = "", search_str = "" } = {}) => {
        return {
          url: `/admin/auth/admin-users?page=${page}&page_size=${page_size}&search_str=${search_str}`,
          method: "GET",
        };
      },
      providesTags: ["adminUsers"],
    }),

    sendInvitation: builder.mutation({
      query: (data) => {
        return {
          url: `/admin/auth/send-invitation/`,
          method: "POST",
          body: data,
        };
      },
    }),

    verifyAdminInvitation: builder.query({
      query: (token) => {
        return {
          url: `/auth/admin-invitations/verify/`,
          method: "GET",
          params: { token },
        };
      },
    }),

    adminRegister: builder.mutation({
      query: (data) => {
        return {
          url: `/auth/admin-register/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),

    updateAdminUser: builder.mutation({
      query: ({ data, adminUserId }) => {
        return {
          url: `/admin/auth/admin-users/${adminUserId}/`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["adminUsers"],
    }),

    deleteAdminUser: builder.mutation({
      query: (adminUserId) => {
        return {
          url: `/admin/auth/admin-users/${adminUserId}/`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["adminUsers"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegistrationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useMeQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,

  useCustomerListQuery,
  useAdminUserListQuery,
  useSendInvitationMutation,
  useLazyVerifyAdminInvitationQuery,
  useAdminRegisterMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} = authApiSlice;
