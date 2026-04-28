import { apiSlice } from "../api/apiSlice";

export const petApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPet: builder.mutation({
      query: ({ payload, hasImages }) => ({
        url: "/pets/",
        method: "POST",
        body: payload,
        ...(hasImages
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: ["pets"],
    }),
    petList: builder.query({
      query: () => ({
        url: "/pets/",
        method: "GET",
      }),
      providesTags: ["pets"],
    }),
  }),
});

export const { useCreatePetMutation, usePetListQuery } = petApiSlice;
