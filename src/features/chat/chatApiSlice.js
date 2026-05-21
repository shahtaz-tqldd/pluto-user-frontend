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

    userChatList: builder.query({
      query: ({ status, page, pageSize }) => ({
        url: `/pets/rescuer-pets/?status=${status}&page=${page}&page_size=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["rescuerPets"],
    }),

    conversationList: builder.query({
      query: ({ status, page, pageSize }) => ({
        url: `/chat/?status=${status}&page=${page}&page_size=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["conversations"],
    }),

    chatMessageList: builder.query({
      query: (params) => {
        const conversationId =
          typeof params === "object" ? params.conversationId : params;
        const page = typeof params === "object" ? params.page : undefined;
        const pageSize =
          typeof params === "object" ? params.pageSize : undefined;
        const searchParams = new URLSearchParams();

        if (page) searchParams.set("page", page);
        if (pageSize) searchParams.set("page_size", pageSize);

        return {
          url: `/chat/${conversationId}/messages/${
            searchParams.toString() ? `?${searchParams.toString()}` : ""
          }`,
          method: "GET",
        };
      },

      providesTags: (_result, _error, params) => {
        const conversationId =
          typeof params === "object" ? params.conversationId : params;

        return [{ type: "chatMessages", id: conversationId }];
      },
    }),
  }),
});

export const {
  usePetChatListQuery,
  useChatDetailsQuery,
  useChatMessageListQuery,
  useUserChatListQuery,
  useConversationListQuery,
} = chatApiSlice;
