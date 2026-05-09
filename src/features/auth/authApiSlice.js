import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
          url: `/auth/user-details/update/`,
          method: "PATCH",
          body: payload,
        };
      },
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
} = authApiSlice;
