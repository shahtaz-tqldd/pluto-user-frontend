import { apiSlice } from "../api/apiSlice";

export const petApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPet: builder.mutation({
      query: ({ payload, hasImages }) => ({
        url: "/pets/",
        method: "POST",
        body: payload,
        ...(hasImages ? {} : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: ["pets"],
    }),
  }),
});

export const { useCreatePetMutation } = petApiSlice;
