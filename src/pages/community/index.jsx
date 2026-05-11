import React from "react";
import {
  Binoculars,
  Bookmark,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  ImagePlus,
  LoaderCircle,
  MapPin,
  MessageCircle,
  MoreVertical,
  PawPrint,
  Phone,
  RefreshCcw,
  Reply,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
  Trash2,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import { FloatingTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useCommentRepliesQuery,
  useCreateCommentReplyMutation,
  useCreatePostCommentMutation,
  useDeletePostCommentMutation,
  usePostCommentsQuery,
  usePostListQuery,
  useTogglePostSaveMutation,
  useUpdatePostCommentMutation,
} from "@/features/posts/postApiSlice";
import { useSelector } from "react-redux";
import CommunityRighSidebar from "./components/community-right-sidebar";
import CreatePost from "./components/create-post";
import { Link } from "react-router-dom";

const postTypeConfig = {
  LOST_AND_FOUND: {
    label: "Lost & found",
    icon: Search,
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  LOST_PET: {
    label: "Lost pet",
    icon: Search,
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  FOUND_PET: {
    label: "Found pet",
    icon: PawPrint,
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  HELP_SEEKING: {
    label: "Need Help",
    icon: Stethoscope,
    badgeClass: "bg-red-50 text-red-600 ring-red-100",
  },
  DISCUSSION: {
    label: "Discussion",
    icon: MessageCircle,
    badgeClass: "bg-blue-50 text-blue-700 ring-blue-100",
  },
};

const fallbackPostType = {
  label: "Community post",
  icon: PawPrint,
  badgeClass: "bg-slate-100 text-slate-700 ring-slate-200",
};

const helpCategoryLabels = {
  URGENT_RESCUE: "Urgent rescue",
  MEDICAL: "Medical",
  FOSTER: "Foster",
  TRANSPORT: "Transport",
  SUPPLIES: "Supplies",
  OTHER: "Other help",
};

const postTypeFilterOptions = [
  "LOST_PET",
  "FOUND_PET",
  "HELP_SEEKING",
  "DISCUSSION",
].map((value) => ({
  value,
  label: postTypeConfig[value].label,
  icon: postTypeConfig[value].icon,
}));

const helpCategoryFilterOptions = Object.entries(helpCategoryLabels).map(
  ([value, label]) => ({ value, label }),
);

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "PL";

const formatRelativeTime = (dateValue) => {
  if (!dateValue) return "Recently";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently";

  const differenceInSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const divisions = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];

  let duration = differenceInSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
        Math.round(duration),
        division.unit,
      );
    }
    duration /= division.amount;
  }

  return "Recently";
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatPostTitle = (post) => {
  if (post.title) return post.title;

  if (
    post.post_type === "LOST_AND_FOUND" ||
    post.post_type === "LOST_PET" ||
    post.post_type === "FOUND_PET"
  ) {
    return [post.lost_found_name, post.lost_found_type]
      .filter(Boolean)
      .join(" the ");
  }

  return "Community post";
};

const getPostBody = (post) => {
  if (post.body) return post.body;
  if (post.details) return post.details;
  return "No additional details were added.";
};

const getPostLocation = (post) => post.last_seen_location || "";

const getCollection = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const getItemImages = (item) => {
  const images = [
    ...(Array.isArray(item?.images) ? item.images : []),
    item?.image,
    item?.image_url,
  ].filter(Boolean);

  return images
    .filter(Boolean)
    .map((image) =>
      typeof image === "string"
        ? { id: image, image_url: image }
        : {
            ...image,
            image_url:
              image.image_url ||
              image.url ||
              image.image ||
              image.file ||
              image.thumbnail,
          },
    )
    .filter((image) => image.image_url);
};

const getOwner = (item) =>
  item?.owner || item?.user || item?.author || item?.created_by || {};

const normalizeComparable = (value) =>
  value === null || value === undefined ? "" : String(value);

const getIdentityValues = (entity = {}) =>
  [
    entity.id,
    entity.user_id,
    entity.owner_id,
    entity.author_id,
    entity.uuid,
    entity.username,
    entity.email,
  ]
    .map(normalizeComparable)
    .filter(Boolean);

const isOwnedByCurrentUser = (item, currentUser) => {
  if (!item || !currentUser) return false;
  if (item.is_mine || item.is_owner) return true;

  const itemOwner = getOwner(item);
  const ownerValues = new Set([
    ...getIdentityValues(itemOwner),
    ...getIdentityValues({
      id: item.owner_id,
      user_id: item.user_id,
      author_id: item.author_id,
      username: item.owner_username || item.username,
    }),
  ]);

  return getIdentityValues(currentUser).some((value) => ownerValues.has(value));
};

const buildCommentPayload = ({ body, image, removeImageIds = [] }) => {
  const trimmedBody = body.trim();

  if (image) {
    const formData = new FormData();
    formData.append("body", trimmedBody);
    formData.append("image", image);
    removeImageIds.forEach((imageId) => {
      formData.append("remove_image_ids", imageId);
    });

    return { payload: formData, hasImage: true };
  }

  return {
    payload: {
      body: trimmedBody,
      ...(removeImageIds.length ? { remove_image_ids: removeImageIds } : {}),
    },
    hasImage: false,
  };
};

const buildPostChips = (post) => {
  const chips = [];

  if (post.post_type === "HELP_SEEKING" && post.help_category) {
    chips.push({
      label: helpCategoryLabels[post.help_category] || post.help_category,
      icon: Stethoscope,
      className: "bg-red-50 text-red-600",
    });
  }

  if (post.lost_found_type) {
    chips.push({
      label: post.lost_found_type,
      icon: PawPrint,
      className: "bg-slate-100 text-slate-700",
    });
  }

  if (post.lost_found_name) {
    chips.push({
      label: post.lost_found_name,
      icon: ShieldCheck,
      className: "bg-orange-50 text-primary",
    });
  }

  if (post.last_seen_location) {
    chips.push({
      label: post.last_seen_location,
      icon: MapPin,
      className: "bg-emerald-50 text-emerald-700",
    });
  }

  if (post.last_seen_at) {
    chips.push({
      label: formatDateTime(post.last_seen_at),
      icon: Clock,
      className: "bg-blue-50 text-blue-700",
    });
  }

  if (post.contact) {
    chips.push({
      label: post.contact,
      icon: MessageCircle,
      className: "bg-slate-100 text-slate-700",
    });
  }

  return chips;
};

const useDebouncedValue = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
};

const CommunityPage = () => {
  const [filters, setFilters] = React.useState({
    search: "",
    postType: "",
    helpCategory: "",
  });
  const debouncedSearch = useDebouncedValue(filters.search.trim());
  const postListFilters = React.useMemo(
    () => ({
      search: debouncedSearch,
      postType: filters.postType,
      helpCategory:
        filters.postType === "HELP_SEEKING" ? filters.helpCategory : "",
    }),
    [debouncedSearch, filters.helpCategory, filters.postType],
  );
  const { data, isLoading, isFetching, isError, refetch } =
    usePostListQuery(postListFilters);
  const posts = getCollection(data);

  const handleFiltersChange = (nextFilters) => {
    setFilters((current) => {
      const updatedFilters = { ...current, ...nextFilters };

      if (updatedFilters.postType !== "HELP_SEEKING") {
        updatedFilters.helpCategory = "";
      }

      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      postType: "",
      helpCategory: "",
    });
  };

  return (
    <div className="flex flex-col gap-4 py-4 xl:flex-row">
      <main className="w-full space-y-5">
        <CreatePost />

        {isLoading ? <PostListSkeleton /> : null}

        {!isLoading && isError ? (
          <FeedState
            title="Posts could not be loaded"
            description="Try refreshing the community feed."
            actionLabel="Refresh"
            onAction={refetch}
          />
        ) : null}

        {!isLoading && !isError && !posts.length ? (
          <FeedState
            title="No community posts yet"
            description="Create the first post for lost pets, help requests, or discussions."
          />
        ) : null}

        {!isLoading && !isError && posts.length ? (
          <div className="space-y-4">
            {isFetching ? (
              <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
                <RefreshCcw className="size-4 animate-spin" />
                Refreshing posts
              </div>
            ) : null}

            {posts.map((post) => (
              <CommunityPost key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </main>

      <CommunityRighSidebar
        className="w-full xl:w-[48rem] xl:max-w-sm"
        filters={filters}
        postTypes={postTypeFilterOptions}
        helpCategories={helpCategoryFilterOptions}
        onFiltersChange={handleFiltersChange}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

const FeedState = ({ title, description, actionLabel, onAction }) => (
  <section className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_54px_rgba(15,23,42,0.05)]">
    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/8 text-primary">
      <PawPrint className="size-6" />
    </div>
    <h2 className="mt-4 text-lg font-bold text-slate-950">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
      {description}
    </p>
    {actionLabel ? (
      <button
        type="button"
        onClick={onAction}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white"
      >
        <RefreshCcw className="size-4" />
        {actionLabel}
      </button>
    ) : null}
  </section>
);

const PostListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2].map((item) => (
      <article
        key={item}
        className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_54px_rgba(15,23,42,0.05)]"
      >
        <div className="flex animate-pulse gap-4">
          <div className="size-12 rounded-full bg-slate-100" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-4 w-44 rounded-full bg-slate-100" />
            <div className="h-6 w-2/3 rounded-full bg-slate-100" />
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-3/4 rounded-full bg-slate-100" />
          </div>
          <div className="hidden h-32 w-44 rounded-2xl bg-slate-100 md:block" />
        </div>
      </article>
    ))}
  </div>
);

const CommunityPost = ({ post }) => {
  const [activeImage, setActiveImage] = React.useState(0);
  const [commentsOpen, setCommentsOpen] = React.useState(false);
  const [togglePostSave, { isLoading: isSaving }] = useTogglePostSaveMutation();

  if (post.post_type === "LOST_PET" || post.post_type === "FOUND_PET") {
    return <LostAndFoundPost post={post} />;
  }

  const config = postTypeConfig[post.post_type] || fallbackPostType;
  const TypeIcon = config.icon;
  const owner = post.owner || {};
  const images = getItemImages(post).sort(
    (first, second) => first.sort_order - second.sort_order,
  );
  const currentImage = images[activeImage];
  const chips = buildPostChips(post);
  const location = getPostLocation(post);

  const showPreviousImage = () => {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const showNextImage = () => {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  const handleSave = async () => {
    try {
      await togglePostSave(post.id).unwrap();
    } catch {
      toast.error("Could not update saved posts.");
    }
  };

  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_54px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="p-5 flex-1">
          <div className="flex gap-4">
            <Avatar owner={owner} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-slate-950">
                  {owner.name || owner.username || "Pluto member"}
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1",
                    config.badgeClass,
                  )}
                >
                  <TypeIcon className="size-3.5" />
                  {config.label}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span>{formatRelativeTime(post.created_at)}</span>
                {owner.username ? (
                  <>
                    <span className="size-1 rounded-full bg-slate-300" />
                    <span>@{owner.username}</span>
                  </>
                ) : null}
                {location ? (
                  <>
                    <span className="size-1 rounded-full bg-slate-300" />
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {location}
                    </span>
                  </>
                ) : null}
              </div>

              <h2 className="mt-4 text-xl font-bold leading-tight text-slate-950">
                {formatPostTitle(post)}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {getPostBody(post)}
              </p>

              {chips.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {chips.map((chip) => {
                    const ChipIcon = chip.icon;

                    return (
                      <span
                        key={`${chip.label}-${chip.className}`}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                          chip.className,
                        )}
                      >
                        <ChipIcon className="size-3.5" />
                        {chip.label}
                      </span>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Post actions"
            >
              <MoreVertical className="size-5" />
            </button>
          </div>
        </div>
        {images.length ? (
          <PostImageGallery
            images={images}
            currentImage={currentImage}
            activeImage={activeImage}
            onPrevious={showPreviousImage}
            onNext={showNextImage}
            onSelect={setActiveImage}
            position="right"
          />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm font-semibold text-slate-600">
        <div className="flex flex-wrap gap-5">
          <button
            type="button"
            disabled={!post.allows_comments}
            onClick={() => setCommentsOpen((current) => !current)}
            className={cn(
              "inline-flex items-center gap-2",
              post.allows_comments
                ? "transition hover:text-primary"
                : "cursor-not-allowed text-slate-400",
            )}
            title={
              post.allows_comments
                ? "Open comments"
                : "Comments are disabled for this post"
            }
          >
            <MessageCircle className="size-4" />
            Comments
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {post.comments_count || 0}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap gap-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "inline-flex items-center gap-2 transition hover:text-primary",
              post.is_saved && "text-primary",
              isSaving && "cursor-wait opacity-70",
            )}
          >
            <Bookmark
              className={cn("size-4", post.is_saved && "fill-current")}
            />
            Save
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {post.saves_count || 0}
            </span>
          </button>
        </div>
      </div>

      {commentsOpen && post.allows_comments ? (
        <PostCommentsPanel postId={post.id} />
      ) : null}
    </article>
  );
};

const PostCommentsPanel = ({ postId }) => {
  const { data, isLoading, isFetching, isError, refetch } =
    usePostCommentsQuery(postId);
  const [createPostComment, { isLoading: isCreating }] =
    useCreatePostCommentMutation();
  const { user: currentUser } = useSelector((state) => state.auth);
  const comments = getCollection(data);

  const handleCreate = async ({ body, image }) => {
    const request = buildCommentPayload({ body, image });
    await createPostComment({ postId, ...request }).unwrap();
  };

  return (
    <section className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
      <CommentForm
        placeholder="Write a comment"
        submitLabel="Comment"
        isLoading={isCreating}
        onSubmit={handleCreate}
      />

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <LoaderCircle className="size-4 animate-spin" />
            Loading comments
          </div>
        ) : null}

        {!isLoading && isError ? (
          <button
            type="button"
            onClick={refetch}
            className="text-sm font-bold text-primary"
          >
            Comments could not be loaded. Try again.
          </button>
        ) : null}

        {!isLoading && !isError && !comments.length ? (
          <p className="text-sm font-medium text-slate-500">No comments yet.</p>
        ) : null}

        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            currentUser={currentUser}
          />
        ))}

        {isFetching && !isLoading ? (
          <p className="text-xs font-semibold text-slate-400">
            Refreshing comments
          </p>
        ) : null}
      </div>
    </section>
  );
};

const CommentItem = ({
  comment,
  postId,
  currentUser,
  isReply = false,
  parentId,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [repliesOpen, setRepliesOpen] = React.useState(false);
  const [replyFormOpen, setReplyFormOpen] = React.useState(false);
  const [updatePostComment, { isLoading: isUpdating }] =
    useUpdatePostCommentMutation();
  const [deletePostComment, { isLoading: isDeleting }] =
    useDeletePostCommentMutation();
  const [createCommentReply, { isLoading: isCreatingReply }] =
    useCreateCommentReplyMutation();
  const owner = getOwner(comment);
  const images = getItemImages(comment);
  const canManage = isOwnedByCurrentUser(comment, currentUser);

  const handleEdit = async ({ body, image, removeImageIds }) => {
    const request = buildCommentPayload({ body, image, removeImageIds });
    await updatePostComment({
      postId,
      commentId: comment.id,
      parentCommentId: parentId,
      ...request,
    }).unwrap();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete this ${isReply ? "reply" : "comment"}?`)) {
      return;
    }

    try {
      await deletePostComment({
        postId,
        commentId: comment.id,
        parentCommentId: parentId,
      }).unwrap();
    } catch {
      toast.error(`Could not delete ${isReply ? "reply" : "comment"}.`);
    }
  };

  const handleReply = async ({ body, image }) => {
    const request = buildCommentPayload({ body, image });
    await createCommentReply({
      postId,
      commentId: parentId || comment.id,
      ...request,
    }).unwrap();
    setReplyFormOpen(false);
    setRepliesOpen(true);
  };

  return (
    <div className={cn("rounded-2xl bg-white p-3", isReply && "ml-8")}>
      <div className="flex gap-3">
        <Avatar owner={owner} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-slate-950">
                {owner.name || owner.username || "Pluto member"}
              </p>
              <p className="text-xs font-medium text-slate-400">
                {formatRelativeTime(comment.created_at)}
              </p>
            </div>

            {canManage ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsEditing((current) => !current)}
                  className="flex size-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Edit comment"
                >
                  <Edit3 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex size-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-60"
                  aria-label="Delete comment"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ) : null}
          </div>

          {isEditing ? (
            <div className="mt-3">
              <CommentForm
                initialBody={comment.body || ""}
                existingImages={images}
                placeholder="Update your comment"
                submitLabel="Save"
                isLoading={isUpdating}
                onCancel={() => setIsEditing(false)}
                onSubmit={handleEdit}
              />
            </div>
          ) : (
            <>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                {comment.body}
              </p>
              {images.length ? <CommentImages images={images} /> : null}
            </>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
            {!isReply ? (
              <button
                type="button"
                onClick={() => setReplyFormOpen((current) => !current)}
                className="inline-flex items-center gap-1.5 transition hover:text-primary"
              >
                <Reply className="size-3.5" />
                Reply
              </button>
            ) : null}
            {!isReply ? (
              <button
                type="button"
                onClick={() => setRepliesOpen((current) => !current)}
                className="transition hover:text-primary"
              >
                {repliesOpen ? "Hide replies" : "View replies"}
              </button>
            ) : null}
          </div>

          {replyFormOpen ? (
            <div className="mt-3">
              <CommentForm
                placeholder="Write a reply"
                submitLabel="Reply"
                isLoading={isCreatingReply}
                onCancel={() => setReplyFormOpen(false)}
                onSubmit={handleReply}
              />
            </div>
          ) : null}
        </div>
      </div>

      {repliesOpen && !isReply ? (
        <CommentReplies
          postId={postId}
          commentId={comment.id}
          currentUser={currentUser}
        />
      ) : null}
    </div>
  );
};

const CommentReplies = ({ postId, commentId, currentUser }) => {
  const { data, isLoading, isError, refetch } =
    useCommentRepliesQuery(commentId);
  const replies = getCollection(data);

  return (
    <div className="mt-3 space-y-1">
      {isLoading ? (
        <p className="ml-8 text-xs font-semibold text-slate-400">
          Loading replies
        </p>
      ) : null}

      {!isLoading && isError ? (
        <button
          type="button"
          onClick={refetch}
          className="ml-8 text-xs font-bold text-primary"
        >
          Replies could not be loaded. Try again.
        </button>
      ) : null}

      {!isLoading && !isError && !replies.length ? (
        <p className="ml-8 text-xs font-semibold text-slate-400">
          No replies yet.
        </p>
      ) : null}

      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          currentUser={currentUser}
          isReply
          parentId={commentId}
        />
      ))}
    </div>
  );
};

const CommentForm = ({
  initialBody = "",
  existingImages = [],
  placeholder,
  submitLabel,
  isLoading,
  onCancel,
  onSubmit,
}) => {
  const [body, setBody] = React.useState(initialBody);
  const [image, setImage] = React.useState(null);
  const [removeImageIds, setRemoveImageIds] = React.useState([]);
  const fileInputRef = React.useRef(null);
  const imagePreviewUrl = React.useMemo(
    () => (image ? URL.createObjectURL(image) : ""),
    [image],
  );
  const visibleExistingImages = existingImages.filter(
    (item) => !removeImageIds.includes(item.id),
  );

  React.useEffect(
    () => () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    },
    [imagePreviewUrl],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!body.trim()) {
      toast.error("Comment text is required.");
      return;
    }

    try {
      await onSubmit({ body, image, removeImageIds });
      setBody("");
      setImage(null);
      setRemoveImageIds([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Could not save comment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <FloatingTextarea
        label={placeholder}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
      />

      {visibleExistingImages.length || image ? (
        <div className="flex flex-wrap gap-2">
          {visibleExistingImages.map((item) => (
            <div
              key={item.id}
              className="relative size-20 overflow-hidden rounded-xl"
            >
              <img
                src={item.image_url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setRemoveImageIds((current) => [...current, item.id])
                }
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-slate-950/70 text-white"
                aria-label="Remove image"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}

          {image ? (
            <div className="relative size-20 overflow-hidden rounded-xl bg-slate-100">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">
                  <Camera className="size-5" />
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-slate-950/70 text-white"
                aria-label="Remove selected image"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-primary/30 hover:text-primary"
          >
            <ImagePlus className="size-4" />
            Image
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-9 rounded-full border-primary/15 bg-white px-4 text-xs text-slate-700"
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-9 rounded-full px-4 text-xs"
          >
            {isLoading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

const CommentImages = ({ images }) => (
  <div className="mt-3 flex flex-wrap gap-2">
    {images.map((image) => (
      <a
        key={image.id || image.image_url}
        href={image.image_url}
        target="_blank"
        rel="noreferrer"
        className="block size-24 overflow-hidden rounded-xl bg-slate-100"
      >
        <img
          src={image.image_url}
          alt=""
          className="h-full w-full object-cover transition hover:scale-105"
        />
      </a>
    ))}
  </div>
);

const LostAndFoundPost = ({ post }) => {
  const [activeImage, setActiveImage] = React.useState(0);
  const [isSightingOpen, setIsSightingOpen] = React.useState(false);
  const [hasReportedSighting, setHasReportedSighting] = React.useState(false);
  const config =
    postTypeConfig[post.post_type] || postTypeConfig.LOST_AND_FOUND;
  const TypeIcon = config.icon;
  const owner = post.owner || {};
  const images = getItemImages(post).sort(
    (first, second) => first.sort_order - second.sort_order,
  );
  const currentImage = images[activeImage];

  const showPreviousImage = () => {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const showNextImage = () => {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <>
      <article className="overflow-hidden rounded-[24px] border border-amber-100 bg-white shadow-[0_18px_54px_rgba(15,23,42,0.06)]">
        <div
          className={cn(
            "grid gap-0",
            images.length &&
              "lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)]",
          )}
        >
          {images.length ? (
            <PostImageGallery
              images={images}
              currentImage={currentImage}
              activeImage={activeImage}
              onPrevious={showPreviousImage}
              onNext={showNextImage}
              onSelect={setActiveImage}
              position="left"
            />
          ) : null}

          <div className="flex min-w-0 flex-col justify-between p-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <Avatar owner={owner} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/profile/${owner.username}`}
                        className="truncate text-sm font-bold text-slate-950"
                      >
                        {owner.name || owner.username || "Pluto member"}
                      </Link>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                      <span>{formatRelativeTime(post.created_at)}</span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1",
                          config.badgeClass,
                        )}
                      >
                        <TypeIcon className="size-3.5" />
                        {config.label}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-slate-100",
                        )}
                      >
                        <PawPrint className="size-3.5" />
                        {post.lost_found_type}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Post actions"
                >
                  <MoreVertical className="size-5" />
                </button>
              </div>

              <div className="min-h-32">
                <h2 className="text-2xl font-bold leading-tight text-slate-950">
                  {formatPostTitle(post)}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {getPostBody(post)}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoTile
                  icon={MapPin}
                  label="Last seen"
                  value={post.last_seen_location || "Not provided"}
                />
                <InfoTile
                  icon={Clock}
                  label="Seen time"
                  value={formatDateTime(post.last_seen_at) || "Not provided"}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-amber-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-amber-700">
                {post.contact}
              </p>
              <Button
                type="button"
                className={cn(
                  "rounded-full px-5",
                  hasReportedSighting && "bg-emerald-600 hover:bg-emerald-700",
                )}
                onClick={() => setIsSightingOpen(true)}
              >
                <Binoculars className="size-4" />
                {hasReportedSighting ? "Sighting sent" : "I have spotted this"}
              </Button>
            </div>
          </div>
        </div>
      </article>

      {isSightingOpen ? (
        <SightingReportDialog
          post={post}
          onClose={() => setIsSightingOpen(false)}
          onSubmit={() => {
            setHasReportedSighting(true);
            setIsSightingOpen(false);
          }}
        />
      ) : null}
    </>
  );
};

const InfoTile = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-3">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700">
      {React.createElement(icon, { className: "size-3.5" })}
      {label}
    </div>
    <p className="mt-2 break-words text-sm font-semibold leading-5 text-slate-900">
      {value}
    </p>
  </div>
);

const SightingReportDialog = ({ post, onClose, onSubmit }) => {
  const [formState, setFormState] = React.useState({
    location: "",
    seen_at: "",
    contact_name: "",
    contact_phone: "",
    note: "",
  });

  const handleFieldChange = (name, value) => {
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success("Sighting info captured.");
    onSubmit(formState);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.3)]">
        <div className="flex items-start justify-between gap-4 border-b border-amber-100 bg-amber-50/60 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Report a sighting
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Share where and when you saw {post.lost_found_name || "this pet"}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900"
            aria-label="Close sighting form"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
            <div className="flex items-center gap-3">
              <Search className="size-5 text-amber-700" />
              <div>
                <p className="font-bold text-slate-950">
                  {formatPostTitle(post)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Last seen: {post.last_seen_location || "Location unknown"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FloatingInput
              name="location"
              label="Where did you see them?"
              value={formState.location}
              onChange={(event) =>
                handleFieldChange("location", event.target.value)
              }
              placeholder="Road 12, Dhanmondi"
            />
            <FloatingInput
              name="seen_at"
              label="When did you see them?"
              type="datetime-local"
              value={formState.seen_at}
              onChange={(event) =>
                handleFieldChange("seen_at", event.target.value)
              }
            />
            <FloatingInput
              name="contact_name"
              label="Your name"
              value={formState.contact_name}
              onChange={(event) =>
                handleFieldChange("contact_name", event.target.value)
              }
              placeholder="Your name"
            />
            <FloatingInput
              name="contact_phone"
              label="Your contact"
              value={formState.contact_phone}
              onChange={(event) =>
                handleFieldChange("contact_phone", event.target.value)
              }
              placeholder="+880..."
            />
          </div>

          <FloatingTextarea
            name="note"
            label="Extra details"
            value={formState.note}
            onChange={(event) => handleFieldChange("note", event.target.value)}
            placeholder="Direction they were moving, condition, whether they were with someone..."
            rows={4}
          />

          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-primary/15 bg-white px-4 text-slate-700"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full px-5">
              <Send className="size-4" />
              Send sighting
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Avatar = ({ owner }) => {
  if (owner.avatar) {
    return (
      <img
        src={owner.avatar}
        alt={owner.name || owner.username || "Post owner"}
        className="size-12 shrink-0 rounded-full object-cover ring-2 ring-white"
      />
    );
  }

  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-base font-bold text-primary">
      {getInitials(owner.name || owner.username)}
    </span>
  );
};

const PostImageGallery = ({
  images,
  currentImage,
  activeImage,
  onPrevious,
  onNext,
  onSelect,
  position = "right",
}) => {
  if (!images.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative min-h-64 overflow-hidden border-slate-100 bg-slate-100",
        position === "left"
          ? "border-b lg:border-b-0 lg:border-r"
          : "w-full shrink-0 border-t lg:w-80 lg:border-l lg:border-t-0 xl:w-72",
      )}
    >
      <img
        src={currentImage.image_url}
        alt="Community post"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={onPrevious}
            className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={image.id || image.image_url}
                type="button"
                onClick={() => onSelect(index)}
                className={cn(
                  "h-12 flex-1 overflow-hidden rounded-xl border-2 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.14)] transition",
                  activeImage === index
                    ? "border-white ring-2 ring-primary"
                    : "border-white/80 opacity-80 hover:opacity-100",
                )}
                aria-label={`Show post image ${index + 1}`}
              >
                <img
                  src={image.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CommunityPage;
