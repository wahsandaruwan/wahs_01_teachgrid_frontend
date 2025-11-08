import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Calendar, ClipboardList, Users, Bell, Settings, LogOut } from "lucide-react";

export default function TeachNavigationBar() {
  const [activeItem, setActiveItem] = useState(""); {/*Track which button is active*/}

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between h-screen">

      {/*profile*/}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold">
            SP
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Sama Perera</h3> {/*tempory added this part*/}
            <h2 className="text-sm text-gray-500">perera@gmail.com</h2>
          </div>
        </div>

        {/*role label */}
        <span className="inline-block bg-gray-100 text-black text-xs font-medium px-2 py-1 rounded-full mb-10">
          Teacher
        </span>

        {/*line break*/}
        <div className="border-t border-gray-300 mb-6"></div>

        {/* Sidebar Menu */}
        <nav className="space-y-4">

          {/* Dashboard */}
          <Link 
            to="/" 
            onClick={() => setActiveItem("Dashboard")}
            className={`flex items-center gap-4 p-2 w-full text-left rounded-md focus:outline-none ${
              activeItem === "Dashboard"
                ? "bg-black text-white"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Home size={20} /> Dashboard
          </Link>

          {/* Attendance Records */}
          <Link 
            to="/attendance" 
            onClick={() => setActiveItem("Attendance Records")}
            className={`flex items-center gap-3 p-2 w-full text-left rounded-md focus:outline-none ${
              activeItem === "Attendance Records"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Calendar size={20} /> Attendance Records
          </Link>

          {/* Leave Management */}
          <Link 
            to="/leave" 
            onClick={() => setActiveItem("Leave Management")}
            className={`flex items-center gap-3 p-2 w-full text-left rounded-md focus:outline-none ${
              activeItem === "Leave Management"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ClipboardList size={20} /> Leave Management
          </Link>

          {/* Relief Duty */}
          <Link 
            to="/relief" 
            onClick={() => setActiveItem("Relief Duty")}
            className={`flex items-center gap-3 p-2 w-full text-left rounded-md focus:outline-none ${
              activeItem === "Relief Duty"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Users size={20} /> Relief Duty
          </Link>

          {/* Announcement */}
          <Link 
            to="/announcement" 
            onClick={() => setActiveItem("Announcement")}
            className={`flex items-center gap-3 p-2 w-full text-left rounded-md focus:outline-none ${
              activeItem === "Announcement"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Bell size={20} /> Announcement
          </Link>

        </nav>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <Link 
          to="/settings" 
          onClick={() => setActiveItem("Settings")}
          className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-200 rounded-md w-full text-left"
        >
          <Settings size={18} /> Settings
        </Link>

        {/*Logout*/}
        <Link 
          to="/logout" 
          onClick={() => setActiveItem("Logout")}
          className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-100 rounded-md w-full text-left"
        >
          <LogOut size={18} /> Sign Out
        </Link>
      </div>

    </aside>
  );
}
