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
      providesTags: (_result, _error, petId) => [
        { type: "petDetails", id: petId },
      ],
    }),

    rescuerPetList: builder.query({
      query: ({ status, page, pageSize }) => ({
        url: `/pets/rescuer-pets/?status=${status}&page=${page}&page_size=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["rescuerPets"],
    }),

    userRequestStatus: builder.query({
      query: (petId) => ({
        url: `/pets/user-request-status/${petId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, petId) => [
        { type: "adoptionRequestStatus", id: petId },
      ],
    }),

    userRequestList: builder.query({
      query: (petId) => ({
        url: `/pets/user-request-list/${petId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, petId) => [
        { type: "adoptionRequests", id: petId },
      ],
    }),

    createPetRequest: builder.mutation({
      query: ({ petId, payload }) => ({
        url: `/pets/create-request/${petId}/`,
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (_result, _error, { petId }) => [
        { type: "adoptionRequestStatus", id: petId },
        { type: "petDetails", id: petId },
      ],
    }),

    updatePetRequest: builder.mutation({
      query: ({ requestId, payload }) => ({
        url: `/pets/update-request/${requestId}/`,
        method: "PATCH",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (_result, _error, { petId }) => [
        { type: "adoptionRequests", id: petId },
        { type: "adoptionRequestStatus", id: petId },
        { type: "petDetails", id: petId },
      ],
    }),
  }),
});

export const {
  useCreatePetMutation,
  usePetListQuery,
  useRescuerPetListQuery,
  usePetDetailsQuery,
  useUserRequestStatusQuery,
  useUserRequestListQuery,
  useCreatePetRequestMutation,
  useUpdatePetRequestMutation,
} = petApiSlice;
