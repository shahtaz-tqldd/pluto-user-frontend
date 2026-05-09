import { apiSlice } from "../api/apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    petChatList: builder.query({
      query: (petId) => ({
        url: `/messages/pets/${petId}/conversations/`,
        method: "GET",
      }),
      providesTags: ["petConvList"],
    }),

    chatDetails: builder.query({
      query: (conversationId) => ({
        url: `/messages/conversations/${conversationId}/`,
        method: "GET",
      }),
      providesTags: ["pets"],
    }),

    chatMessageList: builder.query({
      query: (conversationId) => ({
        url: `/messages/conversations/${conversationId}/messages/`,
        method: "GET",
      }),
      providesTags: (_result, _error, conversationId) => [
        { type: "chatMessages", id: conversationId },
      ],
    }),

    userChatList: builder.query({
      query: ({ status, page, pageSize }) => ({
        url: `/pets/rescuer-pets/?status=${status}&page=${page}&page_size=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["rescuerPets"],
    }),
  }),
});

export const {
  usePetChatListQuery,
  useChatDetailsQuery,
  useChatMessageListQuery,
  useUserChatListQuery,
} = chatApiSlice;
