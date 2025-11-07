import React from "react";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      
      <div className=" text-black px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </div>

      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, Teacher 👩‍🏫
        </h2>
        <p className="text-gray-600 mb-10 max-w-xl mx-auto">
          Manage your classes, attendance, lesson plans, and relief assignments efficiently from one place.
        </p>

      </div>
    </div>
  );
};
export default TeacherDashboard;