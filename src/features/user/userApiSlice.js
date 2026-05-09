import { apiSlice } from "../api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: (userName) => {
        return {
          url: `/user/profile/${userName}/`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, userName) => [
        { type: "userProfile", id: userName },
      ],
    }),
  }),
});

export const { useUserProfileQuery } = userApiSlice;
