import React, { useState } from 'react';

// Simple Top Bar with Only Text
const TopBar = () => {
  return (
    <header className="flex justify-between items-center bg-white p-5 rounded-xl shadow mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">Relief Duty Overview</h2>
    </header>
  );
};

const stats = [
  { label: "My Relief Duties", value: 12, sub: "Completed this year" },
  { label: "Upcoming", value: 2, sub: "To be complete" },
  { label: "This Month", value: 5, sub: "Duties completed" },
];

const reportStats = [
  { label: "Total Hours", value: "42 hrs" },
  { label: "Most Taken Subject", value: "Mathematics" },
  { label: "Most Active Grade", value: "Grade 8" },
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
    className={`px-2 py-1 rounded text-xs ${
      status === "Completed"
        ? "bg-green-100 text-green-600"
        : "bg-blue-100 text-blue-600"
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
    <div className="p-6 mt-2">
      <TopBar />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((item) => (
          <div
            key={item.label}
            className="p-6 rounded-xl shadow-md bg-white transition transform hover:scale-105 hover:shadow-lg"
          >
            <div className="text-gray-700 font-semibold">{item.label}</div>
            <div className="text-2xl font-bold mt-2">{item.value}</div>
            <div className="text-sm text-gray-400 mt-1">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Report Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="font-semibold text-lg mb-4 text-gray-800">
          Relief Duty Summary Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportStats.map((r) => (
            <div
              key={r.label}
              className="p-4 rounded-lg border bg-gray-50 text-center transition transform hover:scale-105 hover:shadow-md"
            >
              <p className="text-gray-600 text-sm">{r.label}</p>
              <p className="text-xl font-bold text-gray-800 mt-1">{r.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 text-sm">
          Export Report
        </button>
      </div>

      {/* Duty Table */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="font-semibold text-lg mb-4">My Relief Duty Schedule</h2>
        <p className="text-gray-500 mb-4">
          Today your assigned substitute teaching duties
        </p>

        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Subject</th>
              <th className="px-4 py-2 text-left">Class</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-pre">{row.dateTime}</td>
                <td className="px-4 py-2">{row.subject}</td>
                <td className="px-4 py-2">{row.class}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(idx, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
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
  );
};

export default ReliefDuty;
