import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flag,
  HandHeart,
  ImagePlus,
  Lock,
  LoaderCircle,
  MessageCircle,
  PawPrint,
  Send,
  ShieldBan,
  Trash2,
  UserRound,
  UsersRound,
  Wifi,
  WifiOff,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { getTokens } from "@/hooks/useToken";
import {
  useCreatePetRequestMutation,
  useUpdatePetRequestMutation,
  useUserRequestListQuery,
  useUserRequestStatusQuery,
} from "@/features/pets/petApiSlice";
import {
  useChatMessageListQuery,
  usePetChatListQuery,
} from "@/features/chat/chatApiSlice";

const extractPayload = (response) => response?.data ?? response ?? null;

const extractRequestList = (response) => {
  const payload = extractPayload(response);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.requests)) return payload.requests;

  return [];
};

const extractConversationList = (response) => {
  const payload = extractPayload(response);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.conversations)) return payload.conversations;

  return [];
};

const getStatus = (request) =>
  (request?.status || request?.request_status || "idle")
    .toString()
    .toLowerCase();

const isAcceptedStatus = (status) =>
  ["accepted", "active", "open"].includes(status);

const isRejectedStatus = (status) =>
  ["rejected", "declined", "denied"].includes(status);

const isCancelledStatus = (status) =>
  ["cancelled", "canceled", "cancel"].includes(status);

const isAdoptedStatus = (status) => ["adopted", "completed"].includes(status);

const getRequestId = (request) =>
  request?.id || request?.request_id || request?.uuid;

const getConversationId = (conversation) =>
  conversation?.id || conversation?.conversation_id || conversation?.uuid;

const getConversationStatus = (conversation) =>
  getStatus(conversation?.request || conversation);

const getRequesterName = (request) =>
  request?.adopter?.name ||
  request?.adopter?.username ||
  request?.requester?.name ||
  request?.requester?.username ||
  request?.user?.name ||
  request?.user?.username ||
  request?.adopter_name ||
  request?.user_name ||
  "Adopter";

const getRequestIntention = (request) =>
  request?.intention || request?.adoption_intention || request?.message || "";

const getUserId = (user) => user?.id || user?.user_id || user?.uuid || null;

const stripApiPath = (url) => url.replace(/\/api(?:\/v\d+)?\/?$/i, "");

const getSocketBaseUrl = () => {
  const baseUrl =
    import.meta.env.VITE_APP_BACKEND_SOCKET_URL ||
    import.meta.env.VITE_APP_SOCKET_URL ||
    import.meta.env.VITE_APP_BACKEND_BASE ||
    import.meta.env.VITE_APP_BASE_URL;

  if (!baseUrl) return window.location.origin.replace(/^http/i, "ws");

  const absoluteUrl = /^wss?:\/\//i.test(baseUrl)
    ? baseUrl
    : /^https?:\/\//i.test(baseUrl)
      ? baseUrl
      : `${window.location.origin}${baseUrl.startsWith("/") ? "" : "/"}${baseUrl}`;

  return stripApiPath(absoluteUrl).replace(/^http/i, "ws");
};

const buildThreadSocketUrl = ({ petId, conversationId, requestId }) => {
  const baseUrl = getSocketBaseUrl();

  if (!baseUrl || (!conversationId && !petId)) return "";

  const { accessToken } = getTokens();
  const configuredPath =
    (conversationId
      ? import.meta.env.VITE_APP_CONVERSATION_SOCKET_PATH
      : import.meta.env.VITE_APP_PET_THREAD_SOCKET_PATH) ||
    import.meta.env.VITE_APP_SOCKET_PATH;
  const defaultPath = conversationId
    ? `/ws/messages/conversations/{conversationId}/`
    : `/ws/pets/threads/{petId}/`;
  const path = (configuredPath || defaultPath)
    .replace("{conversationId}", conversationId)
    .replace("{petId}", petId);
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${normalizedBase}${normalizedPath}`);

  if (conversationId) url.searchParams.set("conversation_id", conversationId);
  if (requestId) url.searchParams.set("request_id", requestId);
  if (accessToken) url.searchParams.set("token", accessToken);

  return url.toString();
};

const normalizeMessage = (message, context = {}) => {
  const { currentUserId, ownSenderIds = [], ownNames = [] } = context;
  const sender =
    message?.sender ||
    message?.author ||
    message?.user ||
    message?.created_by ||
    null;
  const senderId =
    message?.sender_id ||
    message?.author_id ||
    message?.user_id ||
    (typeof sender === "string" ? sender : null) ||
    getUserId(sender);
  const author =
    sender?.name ||
    sender?.username ||
    message?.sender_name ||
    message?.author_name ||
    message?.user_name ||
    "Participant";
  const body =
    message?.body ||
    message?.text ||
    message?.content ||
    message?.message ||
    "";
  const image =
    message?.image ||
    message?.image_url ||
    message?.attachment ||
    message?.attachment_url ||
    null;
  const avatar =
    sender?.profile_picture ||
    sender?.avatar ||
    message?.sender_avatar ||
    message?.author_avatar ||
    message?.user_avatar ||
    "";
  const senderMatchesUser =
    senderId && currentUserId && `${senderId}` === `${currentUserId}`;
  const senderMatchesKnownOwnId = ownSenderIds.some(
    (id) => id && senderId && `${id}` === `${senderId}`,
  );
  const senderMatchesKnownOwnName = ownNames.some(
    (name) => name && author && `${name}` === `${author}`,
  );
  const isMine =
    Boolean(message?.is_mine || message?.isMine) ||
    senderMatchesUser ||
    senderMatchesKnownOwnId ||
    senderMatchesKnownOwnName;

  return {
    id:
      message?.id ||
      message?.message_id ||
      message?.uuid ||
      message?.client_id ||
      crypto.randomUUID(),
    clientId: message?.client_id || message?.clientId || null,
    author,
    body,
    image,
    avatar,
    createdAt: message?.created_at || message?.timestamp || null,
    align: isMine ? "right" : "left",
    pending: Boolean(message?.pending),
  };
};

const isDisplayableMessage = (message) =>
  Boolean(message?.body || message?.image || message?.pending);

const normalizeIncomingMessages = (payload, context) => {
  const data = payload?.data ?? payload;
  const messages =
    (Array.isArray(data) && data) ||
    (Array.isArray(data?.messages) && data.messages) ||
    (Array.isArray(data?.results) && data.results) ||
    null;
  const message =
    data?.message && typeof data.message === "object" ? data.message : data;

  if (messages) {
    return messages
      .map((item) => normalizeMessage(item, context))
      .filter(isDisplayableMessage);
  }

  if (!message || typeof message !== "object") return [];

  const normalizedMessage = normalizeMessage(message, context);

  return isDisplayableMessage(normalizedMessage) ? [normalizedMessage] : [];
};

const mergeMessages = (...messageGroups) => {
  const merged = [];

  messageGroups.flat().forEach((message) => {
    if (!message) return;

    const index = merged.findIndex(
      (item) =>
        item.id === message.id ||
        (message.clientId && item.clientId === message.clientId),
    );

    if (index >= 0) {
      merged[index] = { ...merged[index], ...message };
    } else {
      merged.push(message);
    }
  });

  return merged;
};

const readImageAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const useThreadSocket = ({
  petId,
  conversationId,
  requestId,
  enabled,
  currentUser,
  initialMessages,
  messageContext,
}) => {
  const socketRef = React.useRef(null);
  const reconnectTimerRef = React.useRef(null);
  const reconnectAttemptRef = React.useRef(0);
  const currentUserId = getUserId(currentUser);
  const threadKey =
    conversationId || `${petId || "pet"}:${requestId || "request"}`;
  const [messageState, setMessageState] = React.useState({
    threadKey,
    items: [],
  });
  const [connectionState, setConnectionState] = React.useState("idle");
  const socketUrl = React.useMemo(
    () => buildThreadSocketUrl({ petId, conversationId, requestId }),
    [conversationId, petId, requestId],
  );

  React.useEffect(() => {
    if (!enabled || !socketUrl) {
      return undefined;
    }

    let closedByEffect = false;

    const connect = () => {
      setConnectionState("connecting");
      const socket = new WebSocket(socketUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptRef.current = 0;
        setConnectionState("open");
        socket.send(
          JSON.stringify({
            type: "join_thread",
            ...(conversationId ? { conversation_id: conversationId } : {}),
            pet_id: petId,
            ...(requestId ? { request_id: requestId } : {}),
          }),
        );
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const incoming = normalizeIncomingMessages(payload, {
            ...messageContext,
            currentUserId,
          });

          if (!incoming.length) return;

          setMessageState((current) => {
            const currentItems =
              current.threadKey === threadKey ? current.items : [];
            const next = [...currentItems];

            incoming.forEach((message) => {
              const index = next.findIndex(
                (item) =>
                  item.id === message.id ||
                  (message.clientId && item.clientId === message.clientId),
              );

              if (index >= 0) {
                next[index] = { ...next[index], ...message, pending: false };
              } else {
                next.push(message);
              }
            });

            return { threadKey, items: next };
          });
        } catch (error) {
          console.error("Could not parse thread socket message:", error);
        }
      };

      socket.onerror = () => {
        setConnectionState("error");
      };

      socket.onclose = () => {
        if (closedByEffect) return;

        setConnectionState("closed");
        const attempt = reconnectAttemptRef.current + 1;
        reconnectAttemptRef.current = attempt;
        const delay = Math.min(1000 * attempt, 5000);

        reconnectTimerRef.current = window.setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      closedByEffect = true;
      window.clearTimeout(reconnectTimerRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [
    conversationId,
    currentUserId,
    enabled,
    messageContext,
    petId,
    requestId,
    socketUrl,
    threadKey,
  ]);

  const sendMessage = React.useCallback(
    async ({ text, imageFile }) => {
      const socket = socketRef.current;

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error("Thread socket is not connected.");
      }

      const trimmedText = text.trim();
      const image = imageFile ? await readImageAsDataUrl(imageFile) : null;
      const clientId = crypto.randomUUID();
      const message = {
        id: clientId,
        clientId,
        author: currentUser?.name || currentUser?.username || "You",
        body: trimmedText,
        image,
        align: "right",
        pending: true,
      };

      setMessageState((current) => ({
        threadKey,
        items: [
          ...(current.threadKey === threadKey ? current.items : []),
          message,
        ],
      }));
      socket.send(
        JSON.stringify({
          type: "message",
          event: "message",
          ...(conversationId ? { conversation_id: conversationId } : {}),
          pet_id: petId,
          ...(requestId ? { request_id: requestId } : {}),
          client_id: clientId,
          message_type: image ? "image" : "text",
          body: trimmedText,
          message: trimmedText,
          text: trimmedText,
          image,
          file_name: imageFile?.name || null,
          file_type: imageFile?.type || null,
        }),
      );
    },
    [conversationId, currentUser, petId, requestId, threadKey],
  );

  const sendConversationEvent = React.useCallback(
    (payload) => {
      const socket = socketRef.current;

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error("Thread socket is not connected.");
      }

      socket.send(
        JSON.stringify({
          ...payload,
          ...(conversationId ? { conversation_id: conversationId } : {}),
          pet_id: petId,
          ...(requestId ? { request_id: requestId } : {}),
        }),
      );
    },
    [conversationId, petId, requestId],
  );

  return {
    messages: mergeMessages(
      initialMessages || [],
      messageState.threadKey === threadKey ? messageState.items : [],
    ),
    connectionState:
      enabled && !socketUrl
        ? "unavailable"
        : enabled
          ? connectionState
          : "idle",
    sendMessage,
    sendConversationEvent,
  };
};

const CurrentThread = ({ pet, petId }) => {
  const { user } = useSelector((state) => state.auth);
  const isOwner = Boolean(pet?.is_mine);
  const currentUserId = getUserId(user);
  const petChatListQuery = usePetChatListQuery(petId, {
    skip: !petId,
  });
  const requestListQuery = useUserRequestListQuery(petId, {
    skip: !petId || !isOwner,
  });
  const requestStatusQuery = useUserRequestStatusQuery(petId, {
    skip: !petId || isOwner,
  });
  const [createPetRequest, { isLoading: isCreatingRequest }] =
    useCreatePetRequestMutation();
  const [updatePetRequest, { isLoading: isUpdatingRequest }] =
    useUpdatePetRequestMutation();
  const messageListRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const [draft, setDraft] = React.useState("");
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState("");
  const [isSendingMessage, setIsSendingMessage] = React.useState(false);
  const [intention, setIntention] = React.useState("");
  const [selectedConversationId, setSelectedConversationId] =
    React.useState("");
  const [ownerTab, setOwnerTab] = React.useState("open");
  const [lockedConversationIds, setLockedConversationIds] = React.useState({});
  const [moderationMode, setModerationMode] = React.useState("");
  const [moderationReason, setModerationReason] = React.useState("");
  const currentRequest = extractPayload(requestStatusQuery.data);
  const requestStatus = getStatus(currentRequest);
  const conversations = React.useMemo(
    () => extractConversationList(petChatListQuery.data),
    [petChatListQuery.data],
  );
  const openConversations = React.useMemo(
    () =>
      conversations.filter((conversation) =>
        isAcceptedStatus(getConversationStatus(conversation)),
      ),
    [conversations],
  );
  const cancelledConversations = React.useMemo(
    () =>
      conversations.filter((conversation) =>
        isCancelledStatus(getConversationStatus(conversation)),
      ),
    [conversations],
  );
  const activeConversation = React.useMemo(
    () =>
      openConversations.find(
        (conversation) =>
          `${getConversationId(conversation)}` === `${selectedConversationId}`,
      ) ||
      openConversations[0] ||
      null,
    [openConversations, selectedConversationId],
  );
  const activeConversationId = getConversationId(activeConversation);
  const conversationLocked = Boolean(lockedConversationIds[activeConversationId]);
  const messageListQuery = useChatMessageListQuery(activeConversationId, {
    skip: !activeConversationId,
  });
  const messageContext = React.useMemo(() => {
    const adopterId =
      activeConversation?.adopter || activeConversation?.request?.adopter;
    const rescuerName =
      activeConversation?.rescuer_name ||
      activeConversation?.pet?.rescuer?.name ||
      pet?.rescuer_name;
    const currentUserName = user?.name || user?.username;

    return {
      currentUserId,
      ownSenderIds: isOwner ? [currentUserId] : [currentUserId, adopterId],
      ownNames: isOwner
        ? [currentUserName, rescuerName]
        : [currentUserName, activeConversation?.adopter_name],
    };
  }, [
    activeConversation,
    currentUserId,
    isOwner,
    pet.rescuer_name,
    user?.name,
    user?.username,
  ]);
  const initialMessages = React.useMemo(
    () => normalizeIncomingMessages(messageListQuery.data, messageContext),
    [messageContext, messageListQuery.data],
  );
  const requests = React.useMemo(
    () => extractRequestList(requestListQuery.data),
    [requestListQuery.data],
  );
  const acceptedRequests = React.useMemo(
    () => requests.filter((request) => isAcceptedStatus(getStatus(request))),
    [requests],
  );
  const pendingRequests = React.useMemo(
    () =>
      requests.filter((request) => {
        const status = getStatus(request);
        return (
          !isAcceptedStatus(status) &&
          !isRejectedStatus(status) &&
          !isCancelledStatus(status) &&
          !isAdoptedStatus(status)
        );
      }),
    [requests],
  );
  const rejectedRequests = React.useMemo(
    () => requests.filter((request) => isRejectedStatus(getStatus(request))),
    [requests],
  );
  const cancelledRequests = React.useMemo(
    () => requests.filter((request) => isCancelledStatus(getStatus(request))),
    [requests],
  );
  const threadUnlocked = Boolean(activeConversationId);
  const activeRequest =
    activeConversation?.request ||
    (isOwner ? acceptedRequests[0] : currentRequest);
  const activeRequestId = getRequestId(activeRequest);
  const {
    messages: threadMessages,
    connectionState,
    sendMessage,
    sendConversationEvent,
  } = useThreadSocket({
    petId,
    conversationId: activeConversationId,
    requestId: activeRequestId,
    enabled: threadUnlocked,
    currentUser: user,
    initialMessages,
    messageContext,
  });
  const messages = threadMessages;
  const canSendMessage =
    threadUnlocked &&
    connectionState === "open" &&
    !conversationLocked &&
    !isSendingMessage &&
    Boolean(draft.trim() || imageFile);

  React.useEffect(() => {
    if (!messageListRef.current) return;

    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages.length]);

  React.useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview],
  );

  const handleCreateRequest = async () => {
    const trimmedIntention = intention.trim();

    if (!trimmedIntention) {
      toast.error("Write your adoption intention before requesting.");
      return;
    }

    try {
      const response = await createPetRequest({
        petId,
        payload: { intention: trimmedIntention },
      }).unwrap();
      toast.success(response?.message || "Adoption request sent.");
      setIntention("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send adoption request.");
    }
  };

  const handleUpdateRequest = async (request, status) => {
    const requestId = getRequestId(request);

    if (!requestId) {
      toast.error("Request id was not found.");
      return;
    }

    try {
      const response = await updatePetRequest({
        requestId,
        petId,
        payload: { status },
      }).unwrap();
      toast.success(response?.message || "Adoption request updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update request.");
    }
  };

  const handleActiveRequestUpdate = async (status, successMessage) => {
    if (!activeRequestId) {
      toast.error("Request id was not found.");
      return;
    }

    try {
      const response = await updatePetRequest({
        requestId: activeRequestId,
        petId,
        payload: { status },
      }).unwrap();
      toast.success(response?.message || successMessage);
      if (["ADOPTED", "DENIED", "CANCELLED"].includes(status)) {
        setLockedConversationIds((current) => ({
          ...current,
          [activeConversationId]: true,
        }));
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update this request.");
    }
  };

  const handleModerationSubmit = () => {
    const reason = moderationReason.trim();

    if (!moderationMode) return;
    if (!reason) {
      toast.error("Write a reason before continuing.");
      return;
    }

    try {
      sendConversationEvent({
        type: moderationMode === "block" ? "block_conversation" : "report_conversation",
        event: moderationMode === "block" ? "block_conversation" : "report_conversation",
        reason,
      });
      toast.success(
        moderationMode === "block"
          ? "Conversation blocked."
          : "Conversation reported.",
      );
      if (moderationMode === "block") {
        setLockedConversationIds((current) => ({
          ...current,
          [activeConversationId]: true,
        }));
      }
      setModerationMode("");
      setModerationReason("");
    } catch (error) {
      toast.error(error?.message || "Could not update this conversation.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Select an image file.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId || "");
    setDraft("");
    clearSelectedImage();
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!canSendMessage) return;

    try {
      setIsSendingMessage(true);
      await sendMessage({ text: draft, imageFile });
      setDraft("");
      clearSelectedImage();
    } catch (error) {
      toast.error(error?.message || "Failed to send message.");
    } finally {
      setIsSendingMessage(false);
    }
  };
  return (
    <aside className="sticky top-5 overflow-hidden rounded-[28px] border border-primary/10 bg-white shadow-[0_18px_48px_rgba(2,24,19,0.08)] lg:col-span-2">
      <div className="border-b border-primary/10 bg-[#f8faf8] p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-white">
            <MessageCircle className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Adoption thread
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{pet.rescuer_name || "Post owner"}</span>
              {threadUnlocked ? <SocketStatus state={connectionState} /> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {isOwner ? (
          <OwnerThreadTabs
            activeTab={ownerTab}
            onTabChange={setOwnerTab}
            conversations={openConversations}
            cancelledConversations={cancelledConversations}
            selectedConversationId={activeConversationId}
            pendingRequests={pendingRequests}
            rejectedRequests={rejectedRequests}
            cancelledRequests={cancelledRequests}
            isLoading={requestListQuery.isLoading || petChatListQuery.isLoading}
            isError={requestListQuery.isError || petChatListQuery.isError}
            isMutating={isUpdatingRequest}
            onSelectConversation={handleSelectConversation}
            onUpdateRequest={handleUpdateRequest}
          />
        ) : (
          <RequestPanel
            isOwner={false}
            requests={requests}
            status={requestStatus}
            intention={intention}
            onIntentionChange={setIntention}
            isLoading={requestStatusQuery.isLoading}
            isError={false}
            isMutating={isCreatingRequest || isUpdatingRequest}
            onRequest={handleCreateRequest}
            onUpdateRequest={handleUpdateRequest}
            onCancelRequest={() =>
              handleActiveRequestUpdate(
                "CANCELLED",
                "Adoption request cancelled.",
              )
            }
          />
        )}

        {threadUnlocked ? (
          <ThreadActionPanel
            isOwner={isOwner}
            isMutating={isUpdatingRequest}
            conversationLocked={conversationLocked}
            moderationMode={moderationMode}
            moderationReason={moderationReason}
            onModerationModeChange={setModerationMode}
            onModerationReasonChange={setModerationReason}
            onModerationSubmit={handleModerationSubmit}
            onPermitAdoption={() =>
              handleActiveRequestUpdate("ADOPTED", "Adoption permitted.")
            }
            onDenyAdoption={() =>
              handleActiveRequestUpdate("DENIED", "Adoption denied.")
            }
            onCancelRequest={() =>
              handleActiveRequestUpdate(
                "CANCELLED",
                "Adoption request cancelled.",
              )
            }
          />
        ) : null}

        <div className="flex h-[520px] flex-col rounded-[24px] border border-primary/10 bg-[#fbfdfb]">
          <div
            ref={messageListRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
          >
            {!threadUnlocked ? (
              <LockedThread
                message={
                  petChatListQuery.isLoading
                    ? "Loading conversations..."
                    : "The conversation opens after the adoption request is accepted."
                }
              />
            ) : messageListQuery.isLoading ? (
              <ThreadLoading />
            ) : (
              messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  opponentAvatar={getConversationAvatar(activeConversation)}
                  opponentUsername={getConversationUsername(
                    activeConversation,
                    isOwner,
                  )}
                />
              ))
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="space-y-3 border-t border-primary/10 p-3"
          >
            {imagePreview ? (
              <div className="flex items-center gap-3 rounded-[18px] border border-primary/10 bg-white p-2">
                <img
                  src={imagePreview}
                  alt="Selected attachment"
                  className="size-14 rounded-[14px] object-cover"
                />
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                  {imageFile?.name}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-slate-500 hover:text-red-700"
                  onClick={clearSelectedImage}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ) : null}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={!threadUnlocked || conversationLocked}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 rounded-full"
                disabled={!threadUnlocked || conversationLocked}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="size-4" />
              </Button>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={!threadUnlocked || conversationLocked || isSendingMessage}
                placeholder={
                  threadUnlocked
                    ? conversationLocked
                      ? "Conversation is closed"
                      : connectionState === "open"
                      ? "Write a message"
                      : "Connecting to chat..."
                    : "Chat unlocks after acceptance"
                }
                className="min-w-0 flex-1 rounded-full border border-primary/10 bg-white px-4 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary/40 disabled:bg-slate-100"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0 rounded-full"
                disabled={!canSendMessage}
              >
                {isSendingMessage ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </aside>
  );
};

const getConversationName = (conversation) =>
  conversation?.adopter_name ||
  conversation?.request?.adopter_name ||
  conversation?.rescuer_name ||
  conversation?.pet?.rescuer?.name ||
  "Participant";

const getConversationAvatar = (conversation) =>
  conversation?.request?.adopter_avatar ||
  conversation?.adopter_avatar ||
  conversation?.pet?.rescuer?.profile_picture ||
  "";

const getConversationUsername = (conversation, isOwner) => {
  if (!conversation) return "";

  if (isOwner) {
    return (
      conversation?.adopter_username ||
      conversation?.request?.adopter_username ||
      conversation?.request?.adopter?.username ||
      conversation?.adopter?.username ||
      ""
    );
  }

  return (
    conversation?.rescuer_username ||
    conversation?.pet?.rescuer?.username ||
    conversation?.request?.pet_summary?.rescuer?.username ||
    ""
  );
};

const getLastMessagePreview = (conversation) => {
  const lastMessage = conversation?.last_message;

  if (!lastMessage) return "No messages yet";
  if (lastMessage.body) return lastMessage.body;
  if (lastMessage.image_url) return "Sent an image";

  return "New message";
};

const formatMessageTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getInitials = (value) =>
  (value || "Participant")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const ownerThreadTabs = [
  { id: "open", label: "Open chats" },
  { id: "requests", label: "Requests" },
  { id: "rejected", label: "Rejected" },
  { id: "cancelled", label: "Cancelled" },
];

const OwnerThreadTabs = ({
  activeTab,
  onTabChange,
  conversations,
  cancelledConversations,
  selectedConversationId,
  pendingRequests,
  rejectedRequests,
  cancelledRequests,
  isLoading,
  isError,
  isMutating,
  onSelectConversation,
  onUpdateRequest,
}) => (
  <div className="space-y-3 rounded-[24px] border border-primary/10 bg-[#f8faf8] p-3">
    <div className="grid grid-cols-2 gap-2 rounded-[18px] bg-white p-1 sm:grid-cols-4">
      {ownerThreadTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "rounded-[14px] px-3 py-2 text-xs font-bold transition",
            activeTab === tab.id
              ? "bg-primary text-white shadow-sm"
              : "text-slate-500 hover:bg-primary/5 hover:text-slate-800",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {activeTab === "open" ? (
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        isLoading={isLoading}
        isError={isError}
        onSelect={onSelectConversation}
        title="Accepted conversations"
        emptyMessage="No accepted conversations yet"
      />
    ) : null}

    {activeTab === "requests" ? (
      <RequestListSection
        requests={pendingRequests}
        isLoading={isLoading}
        isError={isError}
        isMutating={isMutating}
        emptyMessage="No pending requests"
        onUpdateRequest={onUpdateRequest}
      />
    ) : null}

    {activeTab === "rejected" ? (
      <RequestListSection
        requests={rejectedRequests}
        isLoading={isLoading}
        isError={isError}
        isMutating={isMutating}
        emptyMessage="No rejected requests"
        onUpdateRequest={onUpdateRequest}
        readOnly
      />
    ) : null}

    {activeTab === "cancelled" ? (
      <>
        <ConversationList
          conversations={cancelledConversations}
          selectedConversationId=""
          isLoading={isLoading}
          isError={isError}
          onSelect={() => {}}
          title="Cancelled conversations"
          emptyMessage="No cancelled conversations"
          readOnly
        />
        {cancelledRequests.length ? (
          <RequestListSection
            requests={cancelledRequests}
            isLoading={false}
            isError={false}
            isMutating={isMutating}
            emptyMessage="No cancelled requests"
            onUpdateRequest={onUpdateRequest}
            readOnly
          />
        ) : null}
      </>
    ) : null}
  </div>
);

const ThreadActionPanel = ({
  isOwner,
  isMutating,
  conversationLocked,
  moderationMode,
  moderationReason,
  onModerationModeChange,
  onModerationReasonChange,
  onModerationSubmit,
  onPermitAdoption,
  onDenyAdoption,
  onCancelRequest,
}) => (
  <div className="space-y-3 rounded-[24px] border border-primary/10 bg-white p-3">
    <div className="grid gap-2 sm:grid-cols-2">
      {isOwner ? (
        <>
          <Button
            type="button"
            className="rounded-full"
            disabled={isMutating || conversationLocked}
            onClick={onPermitAdoption}
          >
            <HandHeart className="size-4" />
            Permit adoption
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-red-100 text-red-700 hover:bg-red-50 hover:text-red-800"
            disabled={isMutating || conversationLocked}
            onClick={onDenyAdoption}
          >
            <XCircle className="size-4" />
            Deny adoption
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-red-100 text-red-700 hover:bg-red-50 hover:text-red-800"
          disabled={isMutating || conversationLocked}
          onClick={onCancelRequest}
        >
          <XCircle className="size-4" />
          Cancel request
        </Button>
      )}

      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        disabled={conversationLocked}
        onClick={() => onModerationModeChange("block")}
      >
        <ShieldBan className="size-4" />
        Block conversation
      </Button>
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        onClick={() => onModerationModeChange("report")}
      >
        <Flag className="size-4" />
        Report conversation
      </Button>
    </div>

    {moderationMode ? (
      <div className="space-y-2 rounded-[18px] border border-primary/10 bg-[#f8faf8] p-3">
        <textarea
          value={moderationReason}
          onChange={(event) => onModerationReasonChange(event.target.value)}
          rows={3}
          placeholder={
            moderationMode === "block"
              ? "Reason for blocking this conversation"
              : "Reason for reporting this conversation"
          }
          className="w-full resize-none rounded-[16px] border border-primary/10 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary/40"
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              onModerationModeChange("");
              onModerationReasonChange("");
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-full"
            onClick={onModerationSubmit}
            disabled={!moderationReason.trim()}
          >
            Submit
          </Button>
        </div>
      </div>
    ) : null}
  </div>
);

const ConversationList = ({
  conversations,
  selectedConversationId,
  isLoading,
  isError,
  onSelect,
  title = "Conversations",
  emptyMessage = "No active conversations yet",
  readOnly = false,
}) => {
  if (isLoading) {
    return (
      <PanelShell className="border-primary/10 bg-[#f8faf8] text-slate-600">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <LoaderCircle className="size-4 animate-spin" />
          Loading conversations
        </div>
      </PanelShell>
    );
  }

  if (isError) {
    return (
      <PanelShell className="border-red-100 bg-red-50 text-red-700">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <XCircle className="size-4" />
          Could not load conversations
        </div>
      </PanelShell>
    );
  }

  if (!conversations.length) {
    return (
      <PanelShell className="border-primary/10 bg-[#f8faf8] text-slate-600">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <MessageCircle className="size-4 text-primary" />
          {emptyMessage}
        </div>
      </PanelShell>
    );
  }

  return (
    <div className="space-y-3 rounded-[24px] border border-primary/10 bg-[#f8faf8] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <MessageCircle className="size-4 text-primary" />
          {title}
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
          {conversations.length}
        </span>
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {conversations.map((conversation) => {
          const conversationId = getConversationId(conversation);
          const selected = `${conversationId}` === `${selectedConversationId}`;
          const avatar = getConversationAvatar(conversation);
          const lastMessage = conversation?.last_message;

          return (
            <button
              key={conversationId}
              type="button"
              onClick={() => {
                if (!readOnly) onSelect(conversationId);
              }}
              disabled={readOnly}
              className={cn(
                "flex w-full items-start gap-3 rounded-[18px] border bg-white p-3 text-left transition",
                selected
                  ? "border-primary/40 shadow-sm"
                  : "border-primary/10",
                readOnly
                  ? "cursor-default opacity-80"
                  : "hover:border-primary/30",
              )}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  className="size-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="size-4" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {getConversationName(conversation)}
                  </p>
                  <span className="shrink-0 text-[11px] text-slate-400">
                    {formatMessageTime(
                      lastMessage?.created_at || conversation?.updated_at,
                    )}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {getLastMessagePreview(conversation)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ThreadLoading = () => (
  <div className="flex h-full items-center justify-center gap-2 text-sm font-semibold text-slate-500">
    <LoaderCircle className="size-4 animate-spin" />
    Loading messages
  </div>
);

const LockedThread = ({ message }) => (
  <div className="flex h-full flex-col items-center justify-center px-6 text-center text-slate-500">
    <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
      <Lock className="size-5" />
    </div>
    <p className="text-sm font-semibold text-slate-800">Thread locked</p>
    <p className="mt-2 text-sm leading-6">
      {message || "The conversation opens after the adoption request is accepted."}
    </p>
  </div>
);

const ChatBubble = ({ message, opponentAvatar, opponentUsername }) => {
  const isMine = message.align === "right";
  const [showTimestamp, setShowTimestamp] = React.useState(false);
  const timestamp = message.pending
    ? "Sending..."
    : formatMessageTime(message.createdAt);
  const avatar = message.avatar || opponentAvatar;
  const profileTile = (
    <>
      {avatar ? (
        <img
          src={avatar}
          alt=""
          className="size-9 rounded-full object-cover ring-2 ring-white"
        />
      ) : (
        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-2 ring-white">
          {getInitials(message.author)}
        </div>
      )}
    </>
  );

  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[86%] items-end gap-2",
          isMine ? "flex-row-reverse" : "flex-row",
        )}
      >
        {!isMine ? (
          <div className="w-9 shrink-0">
            {opponentUsername ? (
              <Link
                to={`/profile/${opponentUsername}/`}
                className="block rounded-full outline-none transition hover:opacity-85 focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={`Open ${message.author}'s profile`}
              >
                {profileTile}
              </Link>
            ) : (
              profileTile
            )}
          </div>
        ) : null}

        <div className={cn("min-w-0", isMine ? "items-end" : "items-start")}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowTimestamp((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setShowTimestamp((current) => !current);
              }
            }}
            className={cn(
              "w-fit max-w-full cursor-pointer rounded-2xl px-4 py-2.5 text-sm outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98]",
              isMine
                ? "rounded-br-sm bg-primary text-white"
                : "rounded-bl-sm border border-primary/10 bg-white text-slate-700",
            )}
          >
            {message.image ? (
              <img
                src={message.image}
                alt="Message attachment"
                className="max-h-60 rounded-xl object-cover"
              />
            ) : null}
            {message.body ? (
              <p className={cn("whitespace-pre-wrap break-words leading-5 w-fit", message.image ? "mt-2" : "")}>
                {message.body}
              </p>
            ) : null}
          </div>
          <div
            className={cn(
              "grid transition-all duration-200 ease-out",
              showTimestamp && timestamp
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <p
              className={cn(
                "mt-1 min-h-0 overflow-hidden text-[10px] text-slate-400 transition-transform duration-200",
                showTimestamp && timestamp ? "translate-y-0" : "-translate-y-1",
                isMine ? "text-right" : "text-left",
              )}
            >
              {timestamp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocketStatus = ({ state }) => {
  const connected = state === "open";
  const label = connected
    ? "Connected"
    : state === "connecting"
      ? "Connecting"
      : "Offline";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        connected
          ? "bg-[#f0fff6] text-[#0d7a4c]"
          : "bg-slate-100 text-slate-500",
      )}
    >
      {connected ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
      {label}
    </span>
  );
};

const RequestListSection = ({
  requests,
  isLoading,
  isError,
  isMutating,
  emptyMessage,
  onUpdateRequest,
  readOnly = false,
}) => {
  if (isLoading) {
    return (
      <PanelShell className="border-primary/10 bg-white text-slate-600">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <LoaderCircle className="size-4 animate-spin" />
          Loading requests
        </div>
      </PanelShell>
    );
  }

  if (isError) {
    return (
      <PanelShell className="border-red-100 bg-red-50 text-red-700">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <XCircle className="size-4" />
          Could not load requests
        </div>
      </PanelShell>
    );
  }

  if (!requests.length) {
    return (
      <PanelShell className="border-primary/10 bg-white text-slate-600">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <UsersRound className="size-4 text-primary" />
          {emptyMessage}
        </div>
      </PanelShell>
    );
  }

  return (
    <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
      {requests.map((request, index) => (
        <RequestCard
          key={getRequestId(request) || index}
          request={request}
          isMutating={isMutating}
          onUpdateRequest={onUpdateRequest}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

const RequestCard = ({ request, isMutating, onUpdateRequest, readOnly }) => {
  const status = getStatus(request);
  const requestIntention = getRequestIntention(request);
  const accepted = isAcceptedStatus(status);
  const rejected = isRejectedStatus(status);
  const cancelled = isCancelledStatus(status);

  return (
    <div className="rounded-[20px] border border-primary/10 bg-white p-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <UserRound className="size-4 shrink-0 text-primary" />
          <span className="truncate">{getRequesterName(request)}</span>
        </div>
        <StatusBadge status={status} />
        {requestIntention ? (
          <p className="mt-3 rounded-[16px] bg-[#f8faf8] px-3 py-2 text-sm leading-6 text-slate-600">
            {requestIntention}
          </p>
        ) : null}
      </div>

      {!readOnly && !accepted && !rejected && !cancelled ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            type="button"
            className="rounded-full"
            disabled={isMutating}
            onClick={() => onUpdateRequest(request, "ACCEPTED")}
          >
            <CheckCircle2 className="size-4" />
            Accept
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-red-100 text-red-700 hover:bg-red-50 hover:text-red-800"
            disabled={isMutating}
            onClick={() => onUpdateRequest(request, "REJECTED")}
          >
            <XCircle className="size-4" />
            Decline
          </Button>
        </div>
      ) : null}
    </div>
  );
};

const RequestPanel = ({
  isOwner,
  requests,
  status,
  intention,
  onIntentionChange,
  isLoading,
  isError,
  isMutating,
  onRequest,
  onUpdateRequest,
  onCancelRequest,
}) => {
  if (isOwner) {
    return (
      <OwnerRequestPanel
        requests={requests}
        isLoading={isLoading}
        isError={isError}
        isMutating={isMutating}
        onUpdateRequest={onUpdateRequest}
      />
    );
  }

  if (isLoading) {
    return (
      <PanelShell className="border-primary/10 bg-[#f8faf8] text-slate-600">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <LoaderCircle className="size-4 animate-spin" />
          Checking request status
        </div>
      </PanelShell>
    );
  }

  if (isAcceptedStatus(status)) {
    return (
      <div className="space-y-3 rounded-[24px] border border-[#bfe8d0] bg-[#f0fff6] p-4 text-[#0d7a4c]">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="size-4" />
          Request accepted
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-red-100 bg-white text-red-700 hover:bg-red-50 hover:text-red-800"
          disabled={isMutating}
          onClick={onCancelRequest}
        >
          <XCircle className="size-4" />
          Cancel request
        </Button>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="rounded-[24px] border border-[#f4d7a7] bg-[#fff9ed] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#996515]">
          <Clock3 className="size-4" />
          Adoption request pending
        </div>
      </div>
    );
  }

  if (isCancelledStatus(status)) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-slate-600">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <XCircle className="size-4" />
          Request cancelled
        </div>
      </div>
    );
  }

  if (isAdoptedStatus(status)) {
    return (
      <div className="rounded-[24px] border border-[#bfe8d0] bg-[#f0fff6] p-4 text-[#0d7a4c]">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <HandHeart className="size-4" />
          Pet adopted
        </div>
      </div>
    );
  }

  if (isRejectedStatus(status)) {
    return (
      <div className="rounded-[24px] border border-red-100 bg-red-50 p-4 text-red-700">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <XCircle className="size-4" />
          Adoption request declined
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-[24px] border border-primary/10 bg-[#f8faf8] p-4">
      <p className="text-sm leading-6 text-slate-600">
        Send an adoption request before starting a direct conversation with the
        post owner.
      </p>
      <textarea
        value={intention}
        onChange={(event) => onIntentionChange(event.target.value)}
        rows={4}
        placeholder="Tell the owner why you want to adopt this pet"
        className="min-h-24 w-full resize-none rounded-[18px] border border-primary/10 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-primary/40"
      />
      <Button
        type="button"
        className="w-full rounded-full"
        onClick={onRequest}
        disabled={isMutating || !intention.trim()}
      >
        {isMutating ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <PawPrint className="size-4" />
        )}
        Request adoption
      </Button>
    </div>
  );
};

const OwnerRequestPanel = ({
  requests,
  isLoading,
  isError,
  isMutating,
  onUpdateRequest,
}) => {
  if (isLoading) {
    return (
      <PanelShell className="border-primary/10 bg-[#f8faf8] text-slate-600">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <LoaderCircle className="size-4 animate-spin" />
          Loading adoption requests
        </div>
      </PanelShell>
    );
  }

  if (isError) {
    return (
      <PanelShell className="border-red-100 bg-red-50 text-red-700">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <XCircle className="size-4" />
          Could not load adoption requests
        </div>
      </PanelShell>
    );
  }

  if (!requests.length) {
    return (
      <PanelShell className="border-primary/10 bg-[#f8faf8] text-slate-600">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <UsersRound className="size-4 text-primary" />
          No adoption requests yet
        </div>
      </PanelShell>
    );
  }

  return (
    <div className="space-y-3 rounded-[24px] border border-primary/10 bg-[#f8faf8] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <UsersRound className="size-4 text-primary" />
        Adoption requests
      </div>

      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {requests.map((request, index) => {
          const status = getStatus(request);
          const requestIntention = getRequestIntention(request);
          const accepted = status === "accepted";
          const rejected = status === "rejected" || status === "declined";

          return (
            <div
              key={getRequestId(request) || index}
              className="rounded-[20px] border border-primary/10 bg-white p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <UserRound className="size-4 shrink-0 text-primary" />
                    <span className="truncate">
                      {getRequesterName(request)}
                    </span>
                  </div>
                  <StatusBadge status={status} />
                  {requestIntention ? (
                    <p className="mt-3 rounded-[16px] bg-[#f8faf8] px-3 py-2 text-sm leading-6 text-slate-600">
                      {requestIntention}
                    </p>
                  ) : null}
                </div>
              </div>

              {!accepted && !rejected ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    className="rounded-full"
                    disabled={isMutating}
                    onClick={() => onUpdateRequest(request, "ACCEPTED")}
                  >
                    <CheckCircle2 className="size-4" />
                    Accept
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-red-100 text-red-700 hover:bg-red-50 hover:text-red-800"
                    disabled={isMutating}
                    onClick={() => onUpdateRequest(request, "REJECTED")}
                  >
                    <XCircle className="size-4" />
                    Decline
                  </Button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (isAcceptedStatus(status)) {
    return (
      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#f0fff6] px-2.5 py-1 text-xs font-semibold text-[#0d7a4c]">
        <CheckCircle2 className="size-3.5" />
        Accepted
      </span>
    );
  }

  if (isCancelledStatus(status)) {
    return (
      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
        <XCircle className="size-3.5" />
        Cancelled
      </span>
    );
  }

  if (isAdoptedStatus(status)) {
    return (
      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#f0fff6] px-2.5 py-1 text-xs font-semibold text-[#0d7a4c]">
        <HandHeart className="size-3.5" />
        Adopted
      </span>
    );
  }

  if (isRejectedStatus(status)) {
    return (
      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        <XCircle className="size-3.5" />
        Declined
      </span>
    );
  }

  return (
    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#fff9ed] px-2.5 py-1 text-xs font-semibold text-[#996515]">
      <CalendarDays className="size-3.5" />
      Pending
    </span>
  );
};

const PanelShell = ({ className, children }) => (
  <div className={cn("rounded-[24px] border p-4", className)}>{children}</div>
);

export default CurrentThread;
