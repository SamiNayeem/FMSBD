// AdminList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminList = ({ onSelect }: { onSelect: (adminId: number) => void }) => {
  interface Admin {
    id: number;
    name: string;
    imageUrl: string;
  }

  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("/api/get-admins");
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="flex flex-col border-r-2">
      {admins.map((admin) => (
        <div
          key={admin.id}
          className="flex items-center p-4 cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(admin.id)}
        >
          <img
            src={admin.imageUrl}
            alt="Admin Avatar"
            className="h-12 w-12 rounded-full"
          />
          <div className="ml-4">
            <p className="font-semibold">{admin.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminList;
