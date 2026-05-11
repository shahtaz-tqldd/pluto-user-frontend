import React from "react";
import ChatComposer from "@/components/chat/chat-composer";
import ChatConversationList from "@/components/chat/chat-conversation-list";
import ChatDetailsPanel from "@/components/chat/chat-details-panel";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessageList from "@/components/chat/chat-message-list";

const conversations = [
  {
    id: "maya-biscuit",
    personName: "Maya Rahman",
    petName: "Biscuit",
    petType: "Dog",
    petAge: "2 years",
    status: "Home visit pending",
    location: "Banani, Dhaka",
    meetup: "Tomorrow, 4:30 PM",
    lastTime: "2m",
    unread: 2,
    lastMessage: "Can I meet Biscuit tomorrow afternoon?",
    petImage:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    checklist: ["Share home photos", "Confirm pickup time", "Bring ID copy"],
  },
  {
    id: "arif-milo",
    personName: "Arif Chowdhury",
    petName: "Milo",
    petType: "Cat",
    petAge: "8 months",
    status: "Application review",
    location: "Dhanmondi, Dhaka",
    meetup: "Friday, 6:00 PM",
    lastTime: "18m",
    unread: 0,
    lastMessage: "I have experience caring for rescued kittens.",
    petImage:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
    checklist: ["Review application", "Ask about other pets", "Schedule call"],
  },
  {
    id: "sadia-luna",
    personName: "Sadia Islam",
    petName: "Luna",
    petType: "Rabbit",
    petAge: "1 year",
    status: "Ready for adoption",
    location: "Uttara, Dhaka",
    meetup: "Saturday, 11:00 AM",
    lastTime: "1h",
    unread: 1,
    lastMessage: "Is Luna comfortable around children?",
    petImage:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=80",
    checklist: ["Explain diet", "Share enclosure guide", "Confirm transport"],
  },
  {
    id: "nabil-simba",
    personName: "Nabil Hasan",
    petName: "Simba",
    petType: "Cat",
    petAge: "3 years",
    status: "Follow-up",
    location: "Mirpur, Dhaka",
    meetup: "Completed yesterday",
    lastTime: "Tue",
    unread: 0,
    lastMessage: "Simba settled in well last night.",
    petImage:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80",
    checklist: ["Check first week", "Send vaccine card", "Close adoption"],
  },
];

const initialMessages = {
  "maya-biscuit": [
    {
      id: "m1",
      sender: "them",
      body: "Hi, I saw Biscuit's profile and wanted to ask if he is still available.",
      time: "10:18 AM",
    },
    {
      id: "m2",
      sender: "me",
      body: "Yes, Biscuit is still looking for a home. He is friendly, vaccinated, and very calm indoors.",
      time: "10:21 AM",
    },
    {
      id: "m3",
      sender: "them",
      body: "That sounds perfect. I live in Banani and can visit tomorrow afternoon if that works.",
      time: "10:27 AM",
    },
    {
      id: "m4",
      sender: "me",
      body: "Tomorrow works. Please bring a photo ID, and I will share the foster address after confirming the time.",
      time: "10:31 AM",
    },
    {
      id: "m5",
      sender: "them",
      body: "Can I meet Biscuit tomorrow afternoon?",
      time: "10:34 AM",
    },
  ],
  "arif-milo": [
    {
      id: "a1",
      sender: "them",
      body: "Hello, I submitted the adoption form for Milo.",
      time: "9:05 AM",
    },
    {
      id: "a2",
      sender: "me",
      body: "Thanks, Arif. I am reviewing it now. Do you currently have other pets at home?",
      time: "9:12 AM",
    },
    {
      id: "a3",
      sender: "them",
      body: "No pets right now, but I have experience caring for rescued kittens.",
      time: "9:20 AM",
    },
  ],
  "sadia-luna": [
    {
      id: "s1",
      sender: "them",
      body: "Is Luna comfortable around children?",
      time: "8:44 AM",
    },
    {
      id: "s2",
      sender: "me",
      body: "She is gentle, but she prefers quiet handling. I can share a care guide before the visit.",
      time: "8:50 AM",
    },
  ],
  "nabil-simba": [
    {
      id: "n1",
      sender: "them",
      body: "Simba settled in well last night. He explored the whole living room.",
      time: "Tue",
    },
    {
      id: "n2",
      sender: "me",
      body: "That is good to hear. Keep his food the same for the first week so the transition stays smooth.",
      time: "Tue",
    },
  ],
};

const ChatPage = () => {
  const [activeConversationId, setActiveConversationId] = React.useState(
    conversations[0].id,
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [draftMessage, setDraftMessage] = React.useState("");
  const [messagesByConversation, setMessagesByConversation] =
    React.useState(initialMessages);

  const filteredConversations = conversations.filter((conversation) => {
    const searchContent = [
      conversation.personName,
      conversation.petName,
      conversation.petType,
      conversation.location,
    ]
      .join(" ")
      .toLowerCase();

    return searchContent.includes(searchTerm.trim().toLowerCase());
  });

  const activeConversation =
    conversations.find(
      (conversation) => conversation.id === activeConversationId,
    ) || conversations[0];
  const activeMessages = messagesByConversation[activeConversation.id] || [];

  const sendMessage = () => {
    const body = draftMessage.trim();

    if (!body) return;

    const time = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());

    setMessagesByConversation((currentMessages) => ({
      ...currentMessages,
      [activeConversation.id]: [
        ...(currentMessages[activeConversation.id] || []),
        {
          id: `${activeConversation.id}-${Date.now()}`,
          sender: "me",
          body,
          time,
        },
      ],
    }));
    setDraftMessage("");
  };

  return (
    <div className="py-4">
      <section className="mx-auto flex h-[calc(100vh-6.5rem)] min-h-[38rem] overflow-hidden rounded-[28px] border border-primary/10 bg-white shadow-[0_18px_70px_rgba(2,24,19,0.07)]">
        <div className="grid min-h-0 w-full grid-rows-[20rem_minmax(0,1fr)] lg:flex">
          <ChatConversationList
            conversations={filteredConversations}
            activeConversationId={activeConversation.id}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectConversation={setActiveConversationId}
          />

          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <ChatHeader conversation={activeConversation} />
            <ChatMessageList messages={activeMessages} />
            <ChatComposer
              value={draftMessage}
              onChange={setDraftMessage}
              onSend={sendMessage}
            />
          </main>

          <ChatDetailsPanel conversation={activeConversation} />
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
