import React, { useState } from "react";
import Header from "../../components/Header";

/* -------------------- Static Data -------------------- */
const stats = [
  { label: "My Relief Duties", value: 12, sub: "Completed this year", icon: "📚" },
  { label: "Upcoming", value: 2, sub: "To be complete", icon: "⏰" },
  { label: "This Month", value: 5, sub: "Duties completed", icon: "📅" }
];

const reportStats = [
  { label: "Total Hours", value: "42 hrs", icon: "⏱️" },
  { label: "Most Taken Subject", value: "Mathematics", icon: "📖" },
  { label: "Most Active Grade", value: "Grade 8", icon: "👥" }
];

const initialRows = [
  {
    dateTime: "09:00 AM - 10:00 AM",
    subject: "Mathematics",
    className: "Grade 8A",
    status: "Upcoming"
  },
  {
    dateTime: "02:00 PM - 03:00 PM",
    subject: "Mathematics",
    className: "Grade 9B",
    status: "Completed"
  },
  {
    dateTime: "11:00 AM - 12:00 PM",
    subject: "Mathematics",
    className: "Grade 7C",
    status: "Upcoming"
  }
];

/* -------------------- Status Badge -------------------- */
const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium border ${
      status === "Completed"
        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
        : "bg-blue-100 text-blue-800 border-blue-200"
    }`}
  >
    {status}
  </span>
);

/* -------------------- Main Component -------------------- */
const ReliefDuty = () => {
  const [rows, setRows] = useState(initialRows);

  const handleStatusChange = (index, value) => {
    const updated = [...rows];
    updated[index].status = value;
    setRows(updated);
  };

  return (
    <>
      {/* ✅ Header ALWAYS at top */}
      <Header title="Leave Management" />

      {/* ✅ Page content starts here */}
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="p-5 bg-white rounded-xl shadow border flex gap-3"
            >
              <div className="text-2xl">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {item.label}
                </p>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 border">
          <h2 className="font-bold text-lg mb-4">📊 Relief Duty Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportStats.map((r) => (
              <div key={r.label} className="p-4 border rounded-lg flex gap-3">
                <div className="text-xl">{r.icon}</div>
                <div>
                  <p className="text-xs text-gray-600">{r.label}</p>
                  <p className="font-bold text-lg">{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-6 border">
          <h2 className="font-bold text-lg mb-4">
            📅 My Relief Duty Schedule
          </h2>

          <table className="w-full border">
            <thead className="bg-gray-100 text-xs">
              <tr>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{row.dateTime}</td>
                  <td className="p-3">{row.subject}</td>
                  <td className="p-3">{row.className}</td>
                  <td className="p-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="p-3">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        handleStatusChange(i, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReliefDuty;
