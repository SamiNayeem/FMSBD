'use client';
import { useState } from "react";
import Sidebar from "../components/chat-sidebar";
import ChatRoom from "../components/chat-room";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onUserSelect={handleUserSelect} />
      {selectedUser ? (
        <ChatRoom user={selectedUser} />
      ) : (
        <div className="flex-grow bg-gray-200 flex justify-center items-center">
          <p>Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
