import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Users, UserCheck, UserX, Clock, TrendingUp, Bell, MapPin } from "lucide-react";
import Header from "../../components/Header";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalTeachers, setTotalTeachers] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    late: 0,
    leave: 0,
    unmarked: 0
  });
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const [pendingReliefCount, setPendingReliefCount] = useState(0);
  const [teacherAvailability, setTeacherAvailability] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!API_BASE_URL) {
        setError("API_BASE_URL not configured");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [summaryRes, availabilityRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin-dashboard/stats/today-summary`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/admin-dashboard/availability/today`, { withCredentials: true })
        ]);

        const summaryData = summaryRes.data;

        setTotalTeachers(summaryData.totalTeachers);
        setAttendanceSummary(summaryData.attendanceSummary || { present: 0, late: 0, leave: 0, unmarked: 0 });
        setPendingLeaveCount(summaryData.pendingLeaveCount || 0);
        setPendingReliefCount(summaryData.pendingReliefCount || 0);
        setTeacherAvailability(availabilityRes.data.teachers || []);
      } catch (err) {
        console.error("Dashboard API Error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-700";
      case "late": return "bg-yellow-100 text-yellow-700";
      case "leave": return "bg-orange-100 text-orange-700";
      case "unmarked": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present": return UserCheck;
      case "late": return Clock;
      case "leave": return UserX;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Header title="Admin Dashboard" />

      <section className="p-8 space-y-8">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Admin Overview</h2>
          <p className="text-purple-100">Manage your school's teaching staff and operations.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Teachers */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Total Teachers</h3>
              <Users className="text-gray-400" size={24} />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">{loading ? "..." : totalTeachers}</p>
            <p className="text-sm text-gray-500">Active staff members</p>
          </div>

          {/* Present Today */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Present Today</h3>
              <UserCheck className="text-green-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{attendanceSummary.present}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${totalTeachers ? (attendanceSummary.present / totalTeachers) * 100 : 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {totalTeachers ? `${Math.round((attendanceSummary.present / totalTeachers) * 100)}% attendance` : "0% attendance"}
            </p>
          </div>

          {/* On Leave */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">On Leave</h3>
              <UserX className="text-orange-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-orange-600 mb-2">{attendanceSummary.leave}</p>
            <p className="text-sm text-gray-500">Teachers absent today</p>
          </div>

          {/* Pending Leave */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Pending Leave</h3>
              <Clock className="text-red-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-red-600 mb-2">{loading ? "..." : pendingLeaveCount}</p>
            <p className="text-sm text-gray-500">Leave requests awaiting approval</p>
          </div>

          {/* Pending Relief */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Pending Relief</h3>
              <Users className="text-emerald-500" size={24} />
            </div>
            <p className="text-4xl font-bold text-emerald-600 mb-2">{loading ? "..." : pendingReliefCount}</p>
            <p className="text-sm text-gray-500">Relief duties awaiting assignment</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/signup"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Users size={16} /> Add Teacher
          </Link>

          <Link
            to="/admin/relief-assignment"
            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Users size={16} /> Relief Assign
          </Link>

          <Link
            to="/admin/reports"
            className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 px-4 py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
          >
            <TrendingUp size={16} /> View Reports
          </Link>

          <Link
            to="/admin/announcements"
            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 px-4 py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Bell size={16} /> Announcements
          </Link>
        </div>

        {/* Teacher Availability Today */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-200 rounded-xl shadow-sm">
              <MapPin className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Teacher Availability Today</h3>
              <p className="text-sm text-slate-500">Real-time attendance status</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
              <span className="ml-2 text-sm text-slate-500">Loading...</span>
            </div>
          ) : teacherAvailability.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h4 className="text-lg font-semibold text-slate-600 mb-1">No attendance records</h4>
              <p className="text-sm text-slate-400">No teachers have marked attendance today.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {teacherAvailability.map((teacher, index) => {
                const StatusIcon = getStatusIcon(teacher.status);
                return (
                  <div 
                    key={index} 
                    className="group bg-gradient-to-br from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 rounded-xl p-3 border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 h-20 flex flex-col justify-center"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <div className={`p-1.5 rounded-lg ${getStatusBadge(teacher.status)} flex-shrink-0`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 group-hover:text-slate-900 text-sm leading-tight truncate">
                          {teacher.teacherName}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mt-0.5 ${getStatusBadge(teacher.status)}`}>
                          {teacher.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
