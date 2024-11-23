'use client';
import { useState } from "react";

interface ChatRoomProps {
  user: string;
}

const ChatRoom = ({ user }: ChatRoomProps) => {
  const [messages, setMessages] = useState([
    { sender: "Admin", content: "Hello! How can I assist you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "User", content: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex-grow bg-gray-100 p-6 mt-20">
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col space-y-4 h-full overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.sender === "User" ? "bg-indigo-100 ml-auto" : "bg-white"
              }`}
            >
              <div className="text-sm">{msg.content}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
          <input
            type="text"
            className="flex-grow border rounded-xl focus:outline-none pl-4 h-10"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            className="ml-4 bg-indigo-500 text-white px-4 py-1 rounded-xl"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
