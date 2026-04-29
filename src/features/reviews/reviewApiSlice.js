import { apiSlice } from "../api/apiSlice";

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: ({ payload, hasImages }) => ({
        url: "/reviews/create/",
        method: "POST",
        body: payload,
        ...(hasImages
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: ["reviews"],
    }),
    reviewList: builder.query({
      query: () => ({
        url: "/reviews/",
        method: "GET",
      }),
      providesTags: ["reviews"],
    }),
  }),
});

export const { useReviewListQuery, useCreateReviewMutation } = reviewApiSlice;
