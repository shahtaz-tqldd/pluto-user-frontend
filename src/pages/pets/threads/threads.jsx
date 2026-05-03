import React from "react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Lock,
  LoaderCircle,
  MessageCircle,
  PawPrint,
  Send,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  useCreatePetRequestMutation,
  useUpdatePetRequestMutation,
  useUserRequestListQuery,
  useUserRequestStatusQuery,
} from "@/features/pets/petApiSlice";

const extractPayload = (response) => response?.data ?? response ?? null;

const extractRequestList = (response) => {
  const payload = extractPayload(response);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.requests)) return payload.requests;

  return [];
};

const getStatus = (request) =>
  (request?.status || request?.request_status || "idle").toString().toLowerCase();

const getRequestId = (request) => request?.id || request?.request_id || request?.uuid;

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

const CurrentThread = ({ pet, petId }) => {
  const { user } = useSelector((state) => state.auth);
  const isOwner = Boolean(pet?.is_mine);
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
  const [draft, setDraft] = React.useState("");
  const [intention, setIntention] = React.useState("");
  const [userMessages, setUserMessages] = React.useState(() => []);
  const currentRequest = extractPayload(requestStatusQuery.data);
  const requestStatus = getStatus(currentRequest);
  const requests = React.useMemo(
    () => extractRequestList(requestListQuery.data),
    [requestListQuery.data],
  );
  const acceptedRequests = React.useMemo(
    () => requests.filter((request) => getStatus(request) === "accepted"),
    [requests],
  );
  const threadUnlocked = isOwner
    ? acceptedRequests.length > 0
    : requestStatus === "accepted";
  const systemMessage = threadUnlocked
    ? {
        id: "system-accepted",
        author: isOwner
          ? getRequesterName(acceptedRequests[0])
          : pet?.rescuer_name || "Post owner",
        body: isOwner
          ? "This request has been accepted. Messaging can continue here."
          : "Your adoption request has been accepted. Share your home details and preferred visit time.",
        align: "left",
      }
    : null;
  const messages = systemMessage ? [systemMessage, ...userMessages] : [];

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

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (!draft.trim() || !threadUnlocked) return;

    setUserMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        author: user?.name || user?.username || "You",
        body: draft.trim(),
        align: "right",
      },
    ]);
    setDraft("");
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
            <p className="text-sm text-slate-500">
              {pet.rescuer_name || "Post owner"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <RequestPanel
          isOwner={isOwner}
          requests={requests}
          status={requestStatus}
          intention={intention}
          onIntentionChange={setIntention}
          isLoading={
            isOwner ? requestListQuery.isLoading : requestStatusQuery.isLoading
          }
          isError={isOwner ? requestListQuery.isError : false}
          isMutating={isCreatingRequest || isUpdatingRequest}
          onRequest={handleCreateRequest}
          onUpdateRequest={handleUpdateRequest}
        />

        <div className="flex h-[520px] flex-col rounded-[24px] border border-primary/10 bg-[#fbfdfb]">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {!threadUnlocked ? (
              <LockedThread />
            ) : (
              messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 border-t border-primary/10 p-3"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={!threadUnlocked}
              placeholder={
                threadUnlocked
                  ? "Write a message"
                  : "Chat unlocks after acceptance"
              }
              className="min-w-0 flex-1 rounded-full border border-primary/10 bg-white px-4 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary/40 disabled:bg-slate-100"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full"
              disabled={!threadUnlocked || !draft.trim()}
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
};

const LockedThread = () => (
  <div className="flex h-full flex-col items-center justify-center px-6 text-center text-slate-500">
    <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
      <Lock className="size-5" />
    </div>
    <p className="text-sm font-semibold text-slate-800">Thread locked</p>
    <p className="mt-2 text-sm leading-6">
      The conversation opens after the adoption request is accepted.
    </p>
  </div>
);

const ChatBubble = ({ message }) => (
  <div
    className={cn(
      "flex",
      message.align === "right" ? "justify-end" : "justify-start",
    )}
  >
    <div
      className={cn(
        "max-w-[82%] rounded-[22px] px-4 py-3 text-sm shadow-sm",
        message.align === "right"
          ? "bg-primary text-white"
          : "border border-primary/10 bg-white text-slate-700",
      )}
    >
      <p className="text-xs font-semibold opacity-70">{message.author}</p>
      <p className="mt-1 leading-6">{message.body}</p>
    </div>
  </div>
);

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

  if (status === "accepted") {
    return (
      <div className="rounded-[24px] border border-[#bfe8d0] bg-[#f0fff6] p-4 text-[#0d7a4c]">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="size-4" />
          Request accepted
        </div>
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

  if (status === "rejected" || status === "declined") {
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
                    <span className="truncate">{getRequesterName(request)}</span>
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
  if (status === "accepted") {
    return (
      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#f0fff6] px-2.5 py-1 text-xs font-semibold text-[#0d7a4c]">
        <CheckCircle2 className="size-3.5" />
        Accepted
      </span>
    );
  }

  if (status === "rejected" || status === "declined") {
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
