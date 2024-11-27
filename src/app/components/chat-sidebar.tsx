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
  unreadCount?: number;
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

        const { data } = await axios.get<User[]>('/api/chats/get-users-with-unread-messages');
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
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
    <div
      className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto max-h-screen
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Chat Users</h2>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={`${user.id}-${index}`} // Ensure a unique key even if `id` is duplicated
            className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150 relative"
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
                {user.firstName ? user.firstName[0] : 'N'}
              </div>
            )}

            {/* User Info */}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">
                {user.firstName || 'Unknown'} {user.lastName || ''}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role || 'User'}</p>
            </div>

            {/* Unread Message Count */}
            {user.unreadCount && user.unreadCount > 0 && (
              <span className="absolute right-2 top-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {user.unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
