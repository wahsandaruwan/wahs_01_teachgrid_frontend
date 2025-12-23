import React, { useState } from 'react';

const TopBar = () => {
  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl shadow-lg mb-6 hover:shadow-xl transition-all duration-200 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800">Relief Duty Overview</h2>
    </header>
  );
};

const stats = [
  { label: "My Relief Duties", value: 12, sub: "Completed this year", icon: "📚", color: "from-gray-50 to-gray-100" },
  { label: "Upcoming", value: 2, sub: "To be complete", icon: "⏰", color: "from-gray-50 to-gray-100" },
  { label: "This Month", value: 5, sub: "Duties completed", icon: "📅", color: "from-gray-50 to-gray-100" },
];

const reportStats = [
  { label: "Total Hours", value: "42 hrs", icon: "⏱️", color: "from-gray-50 to-gray-100" },
  { label: "Most Taken Subject", value: "Mathematics", icon: "📖", color: "from-gray-50 to-gray-100" },
  { label: "Most Active Grade", value: "Grade 8", icon: "👥", color: "from-gray-50 to-gray-100" },
];

const initialRows = [
  {
    dateTime: "09:00 AM - 10:00 AM",
    subject: "Mathematics",
    class: "Grade 8A",
    status: "Upcoming"
  },
  {
    dateTime: "02:00 PM - 03:00 PM",
    subject: "Mathematics",
    class: "Grade 9B",
    status: "Completed"
  },
  {
    dateTime: "11:00 AM - 12:00 PM",
    subject: "Mathematics",
    class: "Grade 7C",
    status: "Upcoming"
  }
];

const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm hover:scale-105 transition-all duration-150 ${
      status === "Completed"
        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
        : "bg-blue-100 text-blue-800 border border-blue-200"
    }`}
  >
    {status}
  </span>
);

const ReliefDuty = () => {
  const [rows, setRows] = useState(initialRows);

  const handleStatusChange = (index, newStatus) => {
    const updatedRows = [...rows];
    updatedRows[index].status = newStatus;
    setRows(updatedRows);
  };

  return (
    <div className="p-4 mt-2 bg-gradient-to-br from-gray-50 to-slate-50">
      <TopBar />

      {/* Stats with Neutral Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className={`p-5 rounded-xl shadow-lg bg-gradient-to-br ${item.color} hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 flex items-start gap-3`}
          >
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md border border-gray-200`}>
              <span className="text-xl">{item.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-700 font-semibold text-sm truncate">{item.label}</div>
              <div className="text-2xl font-black text-gray-900 mt-1">{item.value}</div>
              <div className="text-gray-500 text-xs mt-1 font-medium">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Summary with Neutral Colors */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
        <h2 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
          📊 Relief Duty Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportStats.map((r) => (
            <div
              key={r.label}
              className={`p-4 rounded-xl border bg-gradient-to-br ${r.color} shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 flex items-center gap-3`}
            >
              <div className={`w-10 h-10 ${r.color} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 border border-gray-200`}>
                <span className="text-lg">{r.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs font-medium truncate">{r.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{r.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-900/90 font-medium text-sm transition-all duration-200 flex items-center gap-2 border border-gray-700">
          📤 Export Report
        </button>
      </div>

      {/* Duty Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            📅 My Relief Duty Schedule
          </h2>
          <span className="text-xs text-gray-500 font-medium">Today's substitute teaching duties</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                <th className="px-4 py-2.5 text-left font-semibold text-xs">🕒 Time</th>
                <th className="px-4 py-2.5 text-left font-semibold text-xs">📚 Subject</th>
                <th className="px-4 py-2.5 text-left font-semibold text-xs">👥 Class</th>
                <th className="px-4 py-2.5 text-left font-semibold text-xs">📍 Status</th>
                <th className="px-4 py-2.5 text-left font-semibold text-xs">⚙️ Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-150"
                >
                  <td className="px-4 py-3 font-medium text-sm text-gray-800 whitespace-pre">
                    {row.dateTime}
                  </td>

                  {/* Subject WITHOUT rounded colored background */}
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {row.subject}
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    {row.class}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      onChange={(e) => handleStatusChange(idx, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium bg-white hover:border-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-100 transition-all duration-150 shadow-sm"
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
    </div>
  );
};

export default ReliefDuty;
