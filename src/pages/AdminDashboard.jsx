import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      <div className="bg-gray-200 text-black px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-gray-900 px-4 py-1 rounded-md font-semibold hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </div>

     
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, Admin 👨‍💼
        </h2>
        <p className="text-gray-600 mb-8">
          Manage teachers, view reports, and configure system settings.
        </p>

      </div>
    </div>
  );
};

export default AdminDashboard;