import React, { useState } from "react";
import {
  Home,
  Calendar,
  ClipboardList,
  Users,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

export default function NavigationBar() {
  const [activeItem, setActiveItem] = useState("Attendance Records"); // default active

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between h-screen">
      {/* Profile */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold">
            RD
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Ravindu Deshan</h3>
            <h2 className="text-sm text-gray-500">deshanravindu256@gmail.com</h2>
          </div>
        </div>

        {/* Role label */}
        <span className="inline-block bg-gray-100 text-black text-xs font-medium px-2 py-1 rounded-full mb-10">
          Teacher
        </span>

        <div className="border-t border-gray-300 mb-6"></div>

        {/* Sidebar Menu */}
        <nav className="space-y-4">
          {[
            { name: "Dashboard", icon: <Home size={20} /> },
            { name: "Attendance Records", icon: <Calendar size={20} /> },
            { name: "Leave Management", icon: <ClipboardList size={20} /> },
            { name: "Relief Duty", icon: <Users size={20} /> },
            { name: "Announcement", icon: <Bell size={20} /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center gap-3 p-2 w-full text-left rounded-md focus:outline-none ${
                activeItem === item.name
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings and Logout */}
      <div className="space-y-3">
        <button className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-200 rounded-md w-full text-left">
          <Settings size={18} /> Settings
        </button>

        <button className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-100 rounded-md w-full text-left">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
