import { useState } from "react";
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react";
import LeaveHistory from "./LeaveHistory";
import LeaveApplyForm from "./LeaveApplyForm";

const LeaveManagement = ({
  availableLeave = 15,
  usedLeave = 10,
  pendingLeave = 1,
  thisMonthLeave = 2,
  leaveHistory = [
    {
      id: 1,
      type: "Annual Leave",
      dates: "2024-01-15 - 2024-01-17",
      days: 3,
      reason: "Personal vacation",
      status: "Approved",
      submitted: "2024-01-01",
    },
    {
      id: 2,
      type: "Medical Leave",
      dates: "2024-01-22",
      days: 1,
      reason: "Medical appointment",
      status: "Pending",
      submitted: "2024-01-15",
    },
  ],
}) => {
  const [activeTab, setActiveTab] = useState("history");

  const handleLeaveSubmit = (formData) => {
    console.log("Leave submitted:", formData);
    // Handle submission logic here
    setActiveTab("history");
  };

  const stats = [
    {
      title: "Available Leave",
      value: availableLeave,
      subtitle: "Days remaining this year",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Used Leave",
      value: usedLeave,
      subtitle: "Days taken this year",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pending",
      value: pendingLeave,
      subtitle: "Awaiting approval",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "This Month",
      value: thisMonthLeave,
      subtitle: "Days taken",
      icon: FileText,
      color: "purple",
    },
  ];

  const colorClasses = {
    blue: {
      border: "border-blue-100",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    green: {
      border: "border-green-100",
      bg: "bg-green-100",
      text: "text-green-600",
    },
    yellow: {
      border: "border-yellow-100",
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    purple: {
      border: "border-purple-100",
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br p-6">
      <h1 className="text-2xl mb-6">Leave Management</h1>

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
                <h3 className="text-sm font-medium text-gray-700">
                  {stat.title}
                </h3>
                <div
                  className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
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
        />
      ) : (
        <LeaveHistory leaveHistory={leaveHistory} />
      )}
    </main>
  );
};

export default LeaveManagement;
