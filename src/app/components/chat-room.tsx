'use client';

import React, { useEffect, useState } from "react";

type Message = {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  senderAvatar?: string;
};

type ChatRoomProps = {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  };
};

const ChatRoom: React.FC<ChatRoomProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch messages on component load
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chats/get-chat/${user.id}/messages`);
        const data = await response.json();

        if (response.ok) {
          setMessages(data.messages || []);
        } else {
          console.error("Error fetching messages:", data.message || data.error);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user.id]);

  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/chats/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: user.id, // Chat ID is based on the selected user's ID
          recipientId: user.id, // Ensure recipientId is passed
          content: newMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error sending message:", errorData.error);
        return;
      }

      const message = await response.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow bg-gray-200 flex justify-center items-center">
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-gray-50 p-4 h-full">
      {/* Chat Header */}
      <div className="flex items-center mb-4">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="User Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <h2 className="text-lg font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto mb-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user.id ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar */}
            {/* {message.senderId !== user.id && (
              <img
                src={message.senderAvatar || "/default_user.png"}
                alt="Sender Avatar"
                className="h-8 w-8 rounded-full object-cover mr-2 self-end"
              />
            )} */}
            {/* Message Bubble */}
            <div
              className={`max-w-sm p-3 rounded-lg shadow ${
                message.senderId === user.id
                  ? "bg-gray-200 text-gray-800"
                  : "bg-blue-500 text-white self-end"
                  //bg-gray-200 text-gray-800
              }`}
            >
              <p>{message.content}</p>
            </div>
            {/* Avatar for sender */}
            {message.senderId === user.id && (
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Your Avatar"
                className="h-8 w-8 rounded-full object-cover ml-2 self-end"
              />
            )}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex items-center border-t pt-3">
        <input
          type="text"
          className="flex-grow border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
