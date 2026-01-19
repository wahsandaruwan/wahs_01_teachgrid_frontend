import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react";
import LeaveHistory from "./LeaveHistory";
import LeaveApplyForm from "./LeaveApplyForm";
import toast from "react-hot-toast";
import Header from "../../../components/Header";

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [statsData, setStatsData] = useState({
    available: 0,
    used: 0,
    pending: 0,
    thisMonth: 0,
  });

  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  if (!backendUrl) return "Unable to find backend URL";

  const token = localStorage.getItem("token");

  // Fetch leave data
  const fetchLeaveData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/leave/list`, {
        headers: { token },
      });

      if (response.data.success) {
        const leaves = response.data.leaves;

        setLeaveHistory(leaves);

        // Stats calculation
        const approved = leaves.filter((l) => l.status === "Approved");
        const pending = leaves.filter((l) => l.status === "Pending");
        const usedCount = approved.reduce((acc, curr) => acc + curr.totalDays, 0);

        // Example: thisMonth calculation
        const currentMonth = new Date().getMonth();
        const thisMonthCount = approved.reduce((acc, curr) => {
          const start = new Date(curr.startDate);
          const end = new Date(curr.endDate);
          if (start.getMonth() === currentMonth || end.getMonth() === currentMonth) {
            return acc + curr.totalDays;
          }
          return acc;
        }, 0);

        setStatsData({
          available: 41 - usedCount,
          used: usedCount,
          pending: pending.length,
          thisMonth: thisMonthCount,
        });
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to fetch leave data");
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  // Handle leave submission
  const handleLeaveSubmit = async (formData) => {
    setIsSubmitting(true);

    const data = new FormData();
    data.append("leaveType", formData.leaveType);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("reason", formData.reason);

    formData.documents.forEach((file) => {
      data.append("documents", file);
    });

    try {
      const response = await axios.post(`${backendUrl}/api/leave/apply`, data, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Leave Request Submitted Successfully!", {
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
          },
          iconTheme: {
            primary: "#2563eb",
            secondary: "#fff",
          },
        });
        fetchLeaveData();
        setActiveTab("history");
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    {
      title: "Available Leave",
      value: statsData.available,
      subtitle: "Days remaining",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Used Leave",
      value: statsData.used,
      subtitle: "Days taken this year",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pending",
      value: statsData.pending,
      subtitle: "Awaiting approval",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "This Month",
      value: statsData.thisMonth,
      subtitle: "Days taken",
      icon: FileText,
      color: "purple",
    },
  ];

  const colorClasses = {
    blue: { border: "border-blue-200", bg: "bg-blue-100", text: "text-blue-600" },
    green: { border: "border-blue-200", bg: "bg-green-100", text: "text-green-600" },
    yellow: { border: "border-blue-200", bg: "bg-yellow-100", text: "text-yellow-600" },
    purple: { border: "border-blue-200", bg: "bg-purple-100", text: "text-purple-600" },
  };

  return (
    <>
      <Header title="Leave Management" />
      <div className="flex-1 p-6 md:p-8 bg-gray-50 overflow-y-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colors = colorClasses[stat.color];
            return (
              <div
                key={stat.title}
                className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border ${colors.border}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">{stat.title}</h3>
                  <div
                    className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("apply")}
            className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === "apply"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-600 hover:text-gray-900 hover:shadow-md"
            }`}
          >
            Apply for Leave
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === "history"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-600 hover:text-gray-900 hover:shadow-md"
            }`}
          >
            My Leave History
          </button>
        </div>

        {/* Content */}
        {activeTab === "apply" ? (
          <LeaveApplyForm
            onSubmit={handleLeaveSubmit}
            onCancel={() => setActiveTab("history")}
            isSubmitting={isSubmitting}
          />
        ) : (
          <LeaveHistory leaveHistory={leaveHistory} />
        )}
      </div>
    </>
  );
};

export default LeaveManagement;