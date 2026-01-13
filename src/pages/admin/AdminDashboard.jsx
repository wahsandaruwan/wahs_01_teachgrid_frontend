import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Bell,
  MapPin,
} from "lucide-react";
import Header from "../../components/Header";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const [pendingReliefCount, setPendingReliefCount] = useState(0);
  const [teacherAvailability, setTeacherAvailability] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [summaryRes, availabilityRes] = await Promise.all([
          axios.get(
            `${API_BASE_URL}/api/admin-dashboard/stats/today-summary`,
            { withCredentials: true }
          ),
          axios.get(
            `${API_BASE_URL}/api/admin-dashboard/availability/today`,
            { withCredentials: true }
          ),
        ]);

        const summaryData = summaryRes.data || {};
        setTotalTeachers(summaryData.totalTeachers || 0);
        setAttendanceSummary(summaryData.attendanceSummary || {});
        setPendingLeaveCount(summaryData.pendingLeaveCount || 0);
        setPendingReliefCount(summaryData.pendingReliefCount || 0);
        setTeacherAvailability(availabilityRes.data?.teachers || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const getStatusBadge = (status) =>
    ({
      present: "bg-green-100 text-green-700",
      late: "bg-yellow-100 text-yellow-700",
      leave: "bg-orange-100 text-orange-700",
      unmarked: "bg-gray-100 text-gray-600",
    }[status] || "bg-gray-100 text-gray-600");

  const getStatusIcon = (status) =>
    ({
      present: UserCheck,
      late: Clock,
      leave: UserX,
      unmarked: Clock,
    }[status] || Clock);

  const quickActionStyles = {
    blue:
      "bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700",
    emerald:
      "bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700",
    purple:
      "bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700",
    orange:
      "bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700",
  };

  const quickActions = [
    { title: "Add Teacher", path: "/admin/signup", color: "blue", icon: Users },
    {
      title: "Relief Assign",
      path: "/admin/relief-assignment",
      color: "emerald",
      icon: Users,
    },
    {
      title: "View Reports",
      path: "/admin/reports",
      color: "purple",
      icon: TrendingUp,
    },
    {
      title: "Announcements",
      path: "/admin/announcements",
      color: "orange",
      icon: Bell,
    },
  ];

  const presentCount = attendanceSummary.present || 0;
  const leaveCount = attendanceSummary.leave || 0;
  const presentPercent = totalTeachers
    ? Math.round((presentCount / totalTeachers) * 100)
    : 0;
  const presentProgress = totalTeachers
    ? (presentCount / totalTeachers) * 100
    : 0;

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Header title="Admin Dashboard" />

      <section className="p-8 space-y-8">
        {error && (
          <div className="p-4 text-red-700 bg-red-50 rounded-lg">{error}</div>
        )}

        {/* ===== Admin Overview Section ===== */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Admin Overview</h2>
          <p className="text-purple-100">
            Manage your school's teaching staff and operations.
          </p>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              title: "Total Teachers",
              value: totalTeachers,
              icon: Users,
              color: "text-gray-900",
              label: "Active staff members",
            },
            {
              title: "Present Today",
              value: presentCount,
              icon: UserCheck,
              color: "text-green-600",
              label: `${presentPercent}% attendance`,
              progress: presentProgress,
            },
            {
              title: "On Leave",
              value: leaveCount,
              icon: UserX,
              color: "text-orange-600",
              label: "Teachers absent today",
            },
            {
              title: "Pending Leave",
              value: pendingLeaveCount,
              icon: Clock,
              color: "text-red-600",
              label: "Leave requests awaiting approval",
            },
            {
              title: "Pending Reliefs",
              value: pendingReliefCount,
              icon: Users,
              color: "text-emerald-600",
              label: "Relief duties awaiting assignment",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl px-8 py-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-medium">{card.title}</h3>
                <card.icon className="text-gray-300" size={24} />
              </div>

              <p className={`text-4xl font-bold ${card.color} mb-2`}>
                {loading ? "..." : card.value}
              </p>

              {card.progress !== undefined && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{card.label}</p>
                </>
              )}

              {card.progress === undefined && (
                <p className="text-sm text-gray-500">{card.label}</p>
              )}
            </div>
          ))}
        </div>

        {/* ===== Quick Actions ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.path}
              className={`${quickActionStyles[action.color]} px-4 py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-medium`}
            >
              <action.icon size={16} /> {action.title}
            </Link>
          ))}
        </div>

        {/* ===== Teacher Availability ===== */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-200 rounded-xl shadow-sm">
              <MapPin className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Teacher Availability Today
              </h3>
              <p className="text-sm text-slate-500">
                Real-time attendance status
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
              <span className="ml-2 text-sm text-slate-500">Loading...</span>
            </div>
          ) : teacherAvailability.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No attendance records
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {teacherAvailability.map((teacher, idx) => {
                const status = teacher.status || "unmarked";
                const StatusIcon = getStatusIcon(status);

                return (
                  <div
                    key={idx}
                    className="group bg-gradient-to-br from-white to-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col justify-center h-20"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <div
                        className={`p-1.5 rounded-lg ${getStatusBadge(
                          status
                        )} flex-shrink-0`}
                      >
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 text-sm truncate">
                          {teacher.teacherName}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mt-0.5 ${getStatusBadge(
                            status
                          )}`}
                        >
                          {status.toUpperCase()}
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
