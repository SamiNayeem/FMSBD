'use client';

import React, { useEffect, useState } from "react";

type SidebarProps = {
  onUserSelect: (user: User) => void;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/get-users");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col py-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 px-4">Chat Users</h2>
      <div
        className="flex-grow overflow-y-auto px-4 space-y-2
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-600
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150"
            onClick={() => onUserSelect(user)}
          >
            {/* Avatar */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                {user.firstName[0]}
              </div>
            )}

            {/* User Info */}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
