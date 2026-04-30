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

    petDetails: builder.query({
      query: (petId) => ({
        url: `pets/${petId}/`,
        method: "GET",
      }),
      providesTags: ["petDetails"],
    }),

    rescuerPetList: builder.query({
      query: ({ status, page, pageSize }) => ({
        url: `/pets/rescuer-pets/?status=${status}&page=${page}&page_size=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["rescuerPets"],
    }),
  }),
});

export const {
  useCreatePetMutation,
  usePetListQuery,
  useRescuerPetListQuery,
  usePetDetailsQuery,
} = petApiSlice;
