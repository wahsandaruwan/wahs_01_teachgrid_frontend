import React from "react";
import { TrendingUp, CheckCircle, Users, FileText } from "lucide-react";  
import { useNavigate } from "react-router-dom";

export default function Cardviews() {
  const navigate = useNavigate (); {/*Hook to programmatically navigate*/}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* Attendance */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">Attendance Rate</p>
          <TrendingUp size={20} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold mt-3">20%</h2>

        <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
          <div className="h-full bg-black rounded-full w-[20%]"></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">This month</p>
      </div>

      {/* Approved Leaves */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">Approved Leaves</p>
          <CheckCircle size={20} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold mt-3">3/5</h2> 
        <p className="text-sm text-gray-500 mt-1">This academic year</p>
      </div>

      {/* Relief Duties */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">Relief Duties</p>
          <Users size={20} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold mt-3">12</h2>
        <p className="text-sm text-gray-500 mt-1">Completed this year</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">Quick Actions</p>
          <FileText size={20} className="text-gray-500" />
        </div>

    {/*apply leave button*/}
        <button 
        onClick={() => navigate("/leave")}
        className="w-full mt-4 border border-gray-300 rounded-lg p-2 hover:bg-gray-100">
          Apply Leave
        </button>

    {/*view attendance button*/}
        <button 
        onClick={() => navigate("/attendance")} 
        className="w-full mt-3 border border-gray-300 rounded-lg p-2 hover:bg-gray-100">
          View Attendance
        </button>
      </div>

    </div>
  );
}
