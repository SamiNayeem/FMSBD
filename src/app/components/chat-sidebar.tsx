const users = [
    { id: 1, name: "Henry Boyd", role: "Admin", avatar: "H" },
    { id: 2, name: "Marta Curtis", role: "Volunteer", avatar: "M" },
    { id: 3, name: "Philip Tucker", role: "Admin", avatar: "P" },
    { id: 4, name: "Christine Reid", role: "Volunteer", avatar: "C" },
    { id: 5, name: "Jerry Guzman", role: "Volunteer", avatar: "J" },
  ];
  
  interface SidebarProps {
    onUserSelect: (user: { id: number; name: string; role: string; avatar: string }) => void;
  }

  const Sidebar = ({ onUserSelect }: SidebarProps) => {
    return (
      <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
        <div className="flex flex-row items-center justify-center h-12 w-full">
          <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="ml-2 font-bold text-2xl">QuickChat</div>
        </div>
  
        <div className="flex flex-col mt-8">
          <div className="text-xs font-bold">Active Conversations</div>
          <div className="flex flex-col space-y-2 mt-4">
            {users.map((user) => (
              <button
                key={user.id}
                className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                onClick={() => onUserSelect(user)}
              >
                <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                  {user.avatar}
                </div>
                <div className="ml-2 text-sm font-semibold">{user.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;
  