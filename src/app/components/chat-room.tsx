'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Message = {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
};

type ChatRoomProps = {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
};

const ChatRoom: React.FC<ChatRoomProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/chats/get-chat/${user.id}/messages`);
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post('/api/chats/send-message', {
        chatId: user.id,
        recipientId: user.id,
        content: newMessage,
      });

      setMessages((prev) => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
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
    <div className="flex flex-col flex-grow bg-white p-4 sm:h-full sm:ml-1/4">
      <div className="flex-grow overflow-y-auto mb-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user.id ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-sm px-4 py-2 rounded-lg text-sm ${
                message.senderId === user.id
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow border rounded-lg px-4 py-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
