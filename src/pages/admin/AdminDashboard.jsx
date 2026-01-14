import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Users, UserCheck, UserX, Clock, TrendingUp, Bell } from "lucide-react";
import Header from "../../components/Header";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, leave: 0, unmarked: 0 });
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const [pendingReliefCount, setPendingReliefCount] = useState(0);
  const [teacherAvailability, setTeacherAvailability] = useState([]);

  const quickActions = [
    { title: "Add Teacher", path: "/admin/signup", bg: "bg-blue-50", hover: "hover:bg-blue-100", border: "border-blue-200", text: "text-blue-700", icon: Users },
    { title: "Relief Assign", path: "/admin/relief-assignment", bg: "bg-emerald-50", hover: "hover:bg-emerald-100", border: "border-emerald-200", text: "text-emerald-700", icon: Users },
    { title: "View Reports", path: "/admin/reports", bg: "bg-purple-50", hover: "hover:bg-purple-100", border: "border-purple-200", text: "text-purple-700", icon: TrendingUp },
    { title: "Announcements", path: "/admin/announcements", bg: "bg-orange-50", hover: "hover:bg-orange-100", border: "border-orange-200", text: "text-orange-700", icon: Bell }
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!API_BASE_URL) return setError("API_BASE_URL not configured");

      try {
        setLoading(true);
        const [summaryRes, availabilityRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin-dashboard/stats/today-summary`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/admin-dashboard/availability/today`, { withCredentials: true })
        ]);

        const summaryData = summaryRes.data;
        setTotalTeachers(summaryData.totalTeachers || 0);
        setAttendanceSummary(summaryData.attendanceSummary || { present: 0, leave: 0, unmarked: 0 });
        setPendingLeaveCount(summaryData.pendingLeaveCount || 0);
        setPendingReliefCount(summaryData.pendingReliefCount || 0);
        setTeacherAvailability(availabilityRes.data.teachers || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const getStatusIcon = (status) => ({ present: UserCheck, late: Clock, leave: UserX, unmarked: Clock }[status] || Clock);

  const statusStyle = {
    present: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", dot: "bg-green-500" },
    late: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", dot: "bg-yellow-500" },
    leave: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700", dot: "bg-orange-500" },
    unmarked: { bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-600", dot: "bg-gray-400" }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Header title="Admin Dashboard" />

      <section className="p-8 space-y-8">
        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">{error}</div>}

        {/* ADMIN OVERVIEW */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Admin Overview</h2>
          <p className="text-purple-100">Manage your school's teaching staff and operations.</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { title: "Total Teachers", value: totalTeachers, color: "text-gray-900" },
            { title: "Present Today", value: attendanceSummary.present, color: "text-green-600", sub: "(Present + Late)" },
            { title: "On Leave", value: attendanceSummary.leave, color: "text-orange-600" },
            { title: "Pending Leave", value: pendingLeaveCount, color: "text-red-600" },
            { title: "Pending Relief", value: pendingReliefCount, color: "text-indigo-600" }
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-indigo-200 hover:shadow-md transition">
              <h3 className="text-gray-600 font-medium mb-2">{card.title}</h3>
              <p className={`text-4xl font-bold ${card.color}`}>{loading ? "..." : card.value}</p>
              {card.sub && <p className="text-xs text-gray-500 mt-1">{card.sub}</p>}
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.path} className={`${action.bg} ${action.hover} ${action.border} ${action.text} px-4 py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-medium`}>
              <action.icon size={16} /> {action.title}
            </Link>
          ))}
        </div>

        {/* TEACHER AVAILABILITY */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6">Teacher Availability Today</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teacherAvailability.map((teacher, i) => {
              const Icon = getStatusIcon(teacher.status);
              const style = statusStyle[teacher.status];
              return (
                <div key={i} className={`rounded-xl p-4 border ${style.bg} ${style.border} hover:shadow-md transition-all`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                    <span className="font-semibold text-sm">{teacher.teacherName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${style.text}`} />
                    <span className={`text-xs font-bold uppercase ${style.text}`}>{teacher.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
