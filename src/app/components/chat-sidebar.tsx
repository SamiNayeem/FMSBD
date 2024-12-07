'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type SidebarProps = {
  onUserSelect: (user: User) => void;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  unreadCount?: number; // Unread message count
};

const Sidebar: React.FC<SidebarProps> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get('/api/chats/get-users-with-unread-messages');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = async (user: User) => {
    onUserSelect(user);
    // Reset the unread count for the selected user
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, unreadCount: 0 } // Reset unread count for selected user
          : u
      )
    );
    // Re-fetch users to ensure counters stay in sync
    await fetchUsers();
  };

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto max-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Chat Users</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150 relative"
            onClick={() => handleUserClick(user)}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                {user.firstName}
              </div>
            )}

            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            
            {(user.unreadCount ?? 0) > 0 && (
              <span className="absolute right-2 top-2 bg-red-500 text-white text-xs font-bold rounded-full h-1 w-1 flex items-center justify-center">
                {/* {user.unreadCount} */}
              </span>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
