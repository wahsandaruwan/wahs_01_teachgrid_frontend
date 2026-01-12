import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle
} from "lucide-react";
import Header from "../../components/Header";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [errorTeachers, setErrorTeachers] = useState("");
  const [presentToday, setPresentToday] = useState(42);
  const [onLeave, setOnLeave] = useState(3);
  const [pendingRequests, setPendingRequests] = useState(7);

  const leaveRequests = [
    { id: 1, name: "John Smith", initials: "JS", type: "Medical Leave", dates: "Jan 15 - Jan 17", priority: "high", submitted: "2 days ago" },
    { id: 2, name: "Emily Davis", initials: "ED", type: "Personal Leave", dates: "Jan 20", priority: "medium", submitted: "1 day ago" },
    { id: 3, name: "Michael Johnson", initials: "MJ", type: "Family Emergency", dates: "Jan 22 - Jan 24", priority: "high", submitted: "3 hours ago" }
  ];

  const teacherAvailability = [
    { name: "Alice Brown", subject: "Mathematics", status: "Available" },
    { name: "Bob Wilson", subject: "English", status: "On Leave" },
    { name: "Carol Taylor", subject: "Science", status: "Available" },
    { name: "David Lee", subject: "History", status: "Relief Duty" },
    { name: "Eva Martinez", subject: "Art", status: "Available" },
    { name: "Frank Davis", subject: "PE", status: "On Leave" }
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoadingTeachers(true);
        setErrorTeachers("");

        const res = await axios.get(`${API_BASE_URL}/api/admin-dashboard/stats/total-teachers`, {
          withCredentials: true
        });
        
        setTotalTeachers(res.data.totalTeachers);
      } catch (err) {
        console.error("Dashboard API Error:", err);
        
        if (err.response?.status === 404) {
          setErrorTeachers("API endpoint not found. Check backend routing.");
        } else if (err.response?.status === 401) {
          setErrorTeachers("Unauthorized. Please login again.");
        } else if (!err.response) {
          setErrorTeachers("Backend server not reachable. Check if server is running.");
        } else {
          setErrorTeachers(`Error: ${err.response?.data?.message || err.message}`);
        }
      } finally {
        setLoadingTeachers(false);
      }
    };

    if (API_BASE_URL) {
      fetchDashboardStats();
    } else {
      setErrorTeachers("API_BASE_URL not configured");
      setLoadingTeachers(false);
    }
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Header title="Admin Dashboard" />
      
      <section className="p-8 space-y-8">
        {/* Error Message */}
        {errorTeachers && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {errorTeachers}
          </div>
        )}

        {/* Admin Overview */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Admin Overview</h2>
          <p className="text-purple-100">Manage your school's teaching staff and operations.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Teachers Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Total Teachers</h3>
              <Users className="text-gray-400" size={24} />
            </div>
            {loadingTeachers ? (
              <p className="text-gray-400 text-xl">Loading...</p>
            ) : errorTeachers ? (
              <p className="text-red-600 text-sm">{errorTeachers}</p>
            ) : (
              <p className="text-4xl font-bold text-gray-900 mb-2">{totalTeachers}</p>
            )}
            <p className="text-sm text-gray-500">Active staff members</p>
          </div>

          {/* Present Today */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Present Today</h3>
              <UserCheck className="text-green-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{presentToday}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "93%" }}></div>
            </div>
            <p className="text-sm text-gray-500">93% attendance</p>
          </div>

          {/* On Leave */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">On Leave</h3>
              <UserX className="text-orange-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-orange-600 mb-2">{onLeave}</p>
            <p className="text-sm text-gray-500">Teachers absent today</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Pending Requests</h3>
              <Clock className="text-red-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-red-600 mb-2">{pendingRequests}</p>
            <p className="text-sm text-gray-500">Leave requests awaiting approval</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leave Requests */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={24} />
              <h3 className="text-xl font-bold">Pending Leave Requests</h3>
            </div>
            <p className="text-gray-500 mb-6">Review and approve teacher leave applications</p>
            
            <div className="space-y-4">
              {leaveRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                        {request.initials}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.name}</h4>
                        <p className="text-sm text-gray-600">{request.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-700">{request.dates}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              request.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {request.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Submitted {request.submitted}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              View All Leave Requests
            </button>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Teacher Availability */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={24} />
                <h3 className="text-xl font-bold">Teacher Availability</h3>
              </div>
              <p className="text-gray-500 mb-6">Current status overview</p>

              <div className="space-y-3">
                {teacherAvailability.map((teacher, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">{teacher.name}</p>
                      <p className="text-sm text-gray-500">{teacher.subject}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        teacher.status === 'Available'
                          ? 'bg-black text-white'
                          : teacher.status === 'On Leave'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Manage Assignments
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
              <p className="text-gray-500 mb-6">Common administrative tasks</p>

              <div className="space-y-3">
                <Link
                  to="/admin/signup"
                  className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Users size={18} />
                  <span className="font-medium">Add New Teacher/Admin</span>
                </Link>

                <Link
                  to="/admin/relief-assignment"
                  className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Users size={18} />
                  <span className="font-medium">Assign Relief Duty</span>
                </Link>

                <Link
                  to="/admin/reports"
                  className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Users size={18} />
                  <span className="font-medium">Generate Report</span>
                </Link>

                <Link
                  to="/admin/announcements"
                  className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Users size={18} />
                  <span className="font-medium">Create Announcement</span>
                </Link>
                 
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
