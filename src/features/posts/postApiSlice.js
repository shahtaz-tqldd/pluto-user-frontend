import { apiSlice } from "../api/apiSlice";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: ({ payload, hasImages }) => ({
        url: "/posts/",
        method: "POST",
        body: payload,
        ...(hasImages
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: ["posts"],
    }),

    postList: builder.query({
      query: () => ({
        url: "/posts/",
        method: "GET",
      }),
      providesTags: ["posts"],
    }),

    myPostList: builder.query({
      query: () => ({
        url: "/posts/mine/",
        method: "GET",
      }),
      providesTags: ["myPosts"],
    }),

    savedPostList: builder.query({
      query: () => ({
        url: "/posts/saved/",
        method: "GET",
      }),
      providesTags: ["savedPosts"],
    }),

    postDetails: builder.query({
      query: (postId) => ({
        url: `/posts/${postId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, postId) => [
        { type: "postDetails", id: postId },
      ],
    }),

    updatePost: builder.mutation({
      query: ({ postId, payload, hasImages }) => ({
        url: `/posts/${postId}/`,
        method: "PATCH",
        body: payload,
        ...(hasImages
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        "posts",
        "myPosts",
        "savedPosts",
        { type: "postDetails", id: postId },
      ],
    }),

    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, postId) => [
        "posts",
        "myPosts",
        "savedPosts",
        { type: "postDetails", id: postId },
      ],
    }),

    togglePostSave: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/save/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, postId) => [
        "posts",
        "savedPosts",
        { type: "postDetails", id: postId },
      ],
    }),

    postComments: builder.query({
      query: (postId) => ({
        url: `/posts/${postId}/comments/`,
        method: "GET",
      }),
      providesTags: (_result, _error, postId) => [
        { type: "postComments", id: postId },
      ],
    }),

    createPostComment: builder.mutation({
      query: ({ postId, payload, hasImage }) => ({
        url: `/posts/${postId}/comments/`,
        method: "POST",
        body: payload,
        ...(hasImage
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        "posts",
        { type: "postComments", id: postId },
      ],
    }),

    updatePostComment: builder.mutation({
      query: ({ commentId, payload, hasImage }) => ({
        url: `/posts/comments/${commentId}/`,
        method: "PATCH",
        body: payload,
        ...(hasImage
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: (
        _result,
        _error,
        { postId, commentId, parentCommentId },
      ) => [
        "posts",
        { type: "postComments", id: postId },
        { type: "commentReplies", id: parentCommentId || commentId },
      ],
    }),

    deletePostComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `/posts/comments/${commentId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (
        _result,
        _error,
        { postId, commentId, parentCommentId },
      ) => [
        "posts",
        { type: "postComments", id: postId },
        { type: "commentReplies", id: parentCommentId || commentId },
      ],
    }),

    commentReplies: builder.query({
      query: (commentId) => ({
        url: `/posts/comments/${commentId}/replies/`,
        method: "GET",
      }),
      providesTags: (_result, _error, commentId) => [
        { type: "commentReplies", id: commentId },
      ],
    }),

    createCommentReply: builder.mutation({
      query: ({ commentId, payload, hasImage }) => ({
        url: `/posts/comments/${commentId}/replies/`,
        method: "POST",
        body: payload,
        ...(hasImage
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: (_result, _error, { postId, commentId }) => [
        "posts",
        { type: "postComments", id: postId },
        { type: "commentReplies", id: commentId },
      ],
    }),
  }),
});

export const {
  useCreatePostMutation,
  usePostListQuery,
  useMyPostListQuery,
  useSavedPostListQuery,
  usePostDetailsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useTogglePostSaveMutation,
  usePostCommentsQuery,
  useCreatePostCommentMutation,
  useUpdatePostCommentMutation,
  useDeletePostCommentMutation,
  useCommentRepliesQuery,
  useCreateCommentReplyMutation,
} = postApiSlice;
