'use client';

import { useState } from "react";
import Sidebar from "../components/chat-sidebar";
import ChatRoom from "../components/chat-room";

// Define the User type
type User = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
};

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Function to handle user selection
  const handleUserSelect = (user: User) => {
    console.log("Selected User:", user);
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen pt-20">
      {/* Pass handleUserSelect to Sidebar */}
      <Sidebar onUserSelect={handleUserSelect} />

      {/* Show ChatRoom if a user is selected; otherwise, show a placeholder */}
      {selectedUser ? (
        <ChatRoom user={selectedUser} /> 
      ) : (
        <div className="flex-grow bg-gray-200 flex justify-center items-center">
          <p className="text-gray-500 text-lg">Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
