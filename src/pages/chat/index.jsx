import React from "react";
import ChatComposer from "@/components/chat/chat-composer";
import ChatConversationList from "@/components/chat/chat-conversation-list";
import ChatDetailsPanel from "@/components/chat/chat-details-panel";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessageList from "@/components/chat/chat-message-list";
import {
  useChatMessageListQuery,
  useConversationListQuery,
} from "@/features/chat/chatApiSlice";
import { getTokens } from "@/hooks/useToken";

const MESSAGE_PAGE_SIZE = 20;

const extractList = (response) => {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.messages)) return data.messages;

  return [];
};

const getMeta = (response) => response?.meta || response?.data?.meta || {};

const stripApiPath = (url) => url.replace(/\/api(?:\/v\d+)?\/?$/i, "");

const getSocketBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_APP_BACKEND_SOCKET_URL;

  if (!baseUrl) return "";

  const absoluteUrl = /^wss?:\/\//i.test(baseUrl)
    ? baseUrl
    : /^https?:\/\//i.test(baseUrl)
      ? baseUrl
      : `${window.location.origin}${baseUrl.startsWith("/") ? "" : "/"}${baseUrl}`;

  return stripApiPath(absoluteUrl).replace(/^http/i, "ws");
};

const buildChatSocketUrl = (conversationId) => {
  const baseUrl = getSocketBaseUrl();

  if (!baseUrl || !conversationId) return "";

  const { accessToken } = getTokens();
  const url = new URL(
    `${baseUrl.replace(/\/$/, "")}/ws/chat/${conversationId}/`,
  );

  if (accessToken) url.searchParams.set("token", accessToken);

  return url.toString();
};

const formatTime = (value) => {
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

const normalizeConversation = (conversation) => {
  const user = conversation?.user || {};
  const lastMessage = conversation?.last_message || {};

  return {
    id: conversation.id,
    personName: user.name || user.username || "Participant",
    username: user.username || "",
    avatar: user.avatar || "",
    location: user.location || "Location unavailable",
    petName: "Conversation",
    petType: "Pet",
    status: conversation.status || "ongoing",
    conversationType: conversation.is_blocked
      ? "blocked"
      : conversation.status || "ongoing",
    meetup: "Schedule unavailable",
    lastTime: formatTime(lastMessage.created_at || conversation.updated_at),
    unread: conversation.unread_count || 0,
    lastMessage: lastMessage.body || "No messages yet",
    checklist: ["Placeholder"],
    sharedImages: [],
    sharedFiles: [],
    raw: conversation,
  };
};

const normalizeMessage = (message) => {
  const isMine = Boolean(
    message?.is_mine ||
      message?.isMine ||
      message?.sender === "me" ||
      message?.sender_type === "me",
  );
  const body =
    message?.body ||
    message?.text ||
    message?.content ||
    message?.message ||
    "";
  const imageUrl = message?.image_url || message?.image || "";
  const createdAt = message?.created_at || message?.timestamp || "";

  return {
    id:
      message?.id ||
      message?.message_id ||
      message?.uuid ||
      message?.client_id ||
      message?.clientId ||
      `${createdAt}-${isMine ? "me" : "them"}-${body || imageUrl}`,
    clientId: message?.client_id || message?.clientId || null,
    is_mine: isMine,
    sender: isMine ? "me" : "them",
    body,
    messageType: message?.message_type || (imageUrl ? "image" : "text"),
    imageUrl,
    fileName: message?.file_name || "",
    fileType: message?.file_type || "",
    createdAt,
    time: formatTime(createdAt),
  };
};

const extractSocketMessages = (payload) => {
  const data = payload?.data ?? payload;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.messages)) return data.messages;
  if (data?.message && typeof data.message === "object") return [data.message];
  if (data?.body || data?.image_url || data?.image) return [data];

  return [];
};

const mergeMessages = (...messageGroups) => {
  const merged = [];

  messageGroups.flat().forEach((message) => {
    if (!message?.body && !message?.imageUrl) return;

    const existingIndex = merged.findIndex(
      (item) =>
        item.id === message.id ||
        (message.clientId && item.clientId === message.clientId),
    );

    if (existingIndex >= 0) {
      const existingMessage = merged[existingIndex];
      const shouldKeepMineState =
        existingMessage.is_mine &&
        existingMessage.clientId &&
        existingMessage.clientId === message.clientId &&
        !message.is_mine;

      merged[existingIndex] = {
        ...existingMessage,
        ...message,
        ...(shouldKeepMineState ? { is_mine: true, sender: "me" } : {}),
      };
    } else {
      merged.push(message);
    }
  });

  return merged.sort(sortMessagesByCreatedAt);
};

const sortMessagesByCreatedAt = (first, second) => {
  const firstDate = new Date(first.createdAt).getTime();
  const secondDate = new Date(second.createdAt).getTime();

  if (Number.isNaN(firstDate) || Number.isNaN(secondDate)) return 0;

  return firstDate - secondDate;
};

const useChatSocket = ({ conversationId, enabled }) => {
  const socketRef = React.useRef(null);
  const reconnectTimerRef = React.useRef(null);
  const reconnectAttemptRef = React.useRef(0);
  const socketUrl = React.useMemo(
    () => buildChatSocketUrl(conversationId),
    [conversationId],
  );
  const [messageState, setMessageState] = React.useState({
    conversationId,
    items: [],
  });
  const [connectionState, setConnectionState] = React.useState("idle");

  React.useEffect(() => {
    if (!enabled || !socketUrl) return undefined;

    let closedByEffect = false;

    const connect = () => {
      const socket = new WebSocket(socketUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptRef.current = 0;
        setConnectionState("open");
        socket.send(
          JSON.stringify({
            type: "join_chat",
            event: "join_chat",
            conversation_id: conversationId,
          }),
        );
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const incomingMessages = extractSocketMessages(payload)
            .map(normalizeMessage)
            .filter((message) => message.body || message.imageUrl);

          if (!incomingMessages.length) return;

          setMessageState((current) => ({
            conversationId,
            items: mergeMessages(
              current.conversationId === conversationId ? current.items : [],
              incomingMessages,
            ),
          }));
        } catch (error) {
          console.error("Could not parse chat socket message:", error);
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
  }, [conversationId, enabled, socketUrl]);

  const sendMessage = React.useCallback(
    ({ text }) => {
      const socket = socketRef.current;

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error("Chat socket is not connected.");
      }

      const body = text.trim();
      const clientId = crypto.randomUUID();
      const optimisticMessage = normalizeMessage({
        client_id: clientId,
        is_mine: true,
        body,
        message_type: "text",
        created_at: new Date().toISOString(),
      });

      setMessageState((current) => ({
        conversationId,
        items: mergeMessages(
          current.conversationId === conversationId ? current.items : [],
          optimisticMessage,
        ),
      }));

      socket.send(
        JSON.stringify({
          type: "message",
          event: "message",
          conversation_id: conversationId,
          client_id: clientId,
          message_type: "text",
          body,
          message: body,
          text: body,
        }),
      );
    },
    [conversationId],
  );

  return {
    messages:
      messageState.conversationId === conversationId ? messageState.items : [],
    connectionState:
      enabled && !socketUrl ? "unavailable" : enabled ? connectionState : "idle",
    sendMessage,
  };
};

const ChatPage = () => {
  const [activeConversationId, setActiveConversationId] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeConversationTab, setActiveConversationTab] =
    React.useState("ongoing");
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = React.useState(false);
  const [draftMessage, setDraftMessage] = React.useState("");
  const [messagePage, setMessagePage] = React.useState(1);

  const conversationListQuery = useConversationListQuery({
    status: activeConversationTab,
    page: 1,
    pageSize: 20,
  });
  const conversations = React.useMemo(
    () => extractList(conversationListQuery.data).map(normalizeConversation),
    [conversationListQuery.data],
  );
  const conversationMeta = getMeta(conversationListQuery.data);
  const tabCounts = {
    ongoing:
      activeConversationTab === "ongoing" ? conversationMeta.total_items || 0 : 0,
    request:
      activeConversationTab === "request" ? conversationMeta.total_items || 0 : 0,
    blocked:
      activeConversationTab === "blocked" ? conversationMeta.total_items || 0 : 0,
  };

  const filteredConversations = conversations.filter((conversation) => {
    const searchContent = [
      conversation.personName,
      conversation.username,
      conversation.location,
      conversation.lastMessage,
    ]
      .join(" ")
      .toLowerCase();

    return searchContent.includes(searchTerm.trim().toLowerCase());
  });

  const activeConversation =
    conversations.find(
      (conversation) => conversation.id === activeConversationId,
    ) || null;
  const messageListQuery = useChatMessageListQuery(
    {
      conversationId: activeConversationId,
      page: messagePage,
      pageSize: MESSAGE_PAGE_SIZE,
    },
    { skip: !activeConversationId },
  );
  const messageMeta = getMeta(messageListQuery.data);
  const apiMessages = React.useMemo(
    () =>
      extractList(messageListQuery.data)
        .map(normalizeMessage)
        .filter((message) => message.body || message.imageUrl)
        .sort(sortMessagesByCreatedAt),
    [messageListQuery.data],
  );
  const chatSocket = useChatSocket({
    conversationId: activeConversationId,
    enabled: Boolean(activeConversationId),
  });
  const activeMessages = React.useMemo(
    () => mergeMessages(apiMessages, chatSocket.messages),
    [apiMessages, chatSocket.messages],
  );
  const hasMoreMessages =
    Boolean(activeConversationId) &&
    (messageMeta.total_pages || 1) > messagePage;

  const sendMessage = () => {
    const body = draftMessage.trim();

    if (!body || !activeConversation) return;

    try {
      chatSocket.sendMessage({ text: body });
      setDraftMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleConversationTabChange = (tab) => {
    setActiveConversationTab(tab);
    setActiveConversationId("");
    setMessagePage(1);
    setDraftMessage("");
    setIsDetailsPanelOpen(false);
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setMessagePage(1);
    setDraftMessage("");
    setIsDetailsPanelOpen(false);
  };

  return (
    <div className="">
      <section className="mx-auto flex h-[calc(100vh-6.5rem)] min-h-[38rem] overflow-hidden">
        <div className="relative grid min-h-0 w-full grid-rows-[20rem_minmax(0,1fr)] lg:flex">
          <ChatConversationList
            conversations={filteredConversations}
            activeConversationId={activeConversationId}
            activeTab={activeConversationTab}
            tabCounts={tabCounts}
            searchTerm={searchTerm}
            onTabChange={handleConversationTabChange}
            onSearchChange={setSearchTerm}
            onSelectConversation={handleSelectConversation}
          />

          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            {activeConversation ? (
              <>
                <ChatHeader
                  conversation={activeConversation}
                  isDetailsOpen={isDetailsPanelOpen}
                  onToggleDetails={() =>
                    setIsDetailsPanelOpen((currentValue) => !currentValue)
                  }
                />
                <ChatMessageList
                  messages={activeMessages}
                  hasMore={hasMoreMessages}
                  isLoadingMore={messageListQuery.isFetching}
                  onLoadMore={() => setMessagePage((page) => page + 1)}
                />
                <ChatComposer
                  value={draftMessage}
                  onChange={setDraftMessage}
                  onSend={sendMessage}
                />
              </>
            ) : (
              <EmptyChatState
                isLoading={conversationListQuery.isLoading}
                activeTab={activeConversationTab}
              />
            )}
          </main>

          {isDetailsPanelOpen && activeConversation && (
            <ChatDetailsPanel
              conversation={activeConversation}
              messages={activeMessages}
              onClose={() => setIsDetailsPanelOpen(false)}
            />
          )}
        </div>
      </section>
    </div>
  );
};

const EmptyChatState = ({ isLoading, activeTab }) => (
  <div className="flex min-h-0 flex-1 items-center justify-center bg-[#fffaf5] px-6 text-center">
    <div className="max-w-sm">
      <p className="text-base font-semibold text-slate-900">
        {isLoading ? "Loading conversations..." : "Select a conversation"}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {isLoading
          ? "The conversation list is being fetched."
          : `No ${activeTab} conversation is open yet. Choose an item from the list to fetch its messages.`}
      </p>
    </div>
  </div>
);

export default ChatPage;
