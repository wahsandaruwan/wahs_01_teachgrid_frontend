import React, { useState, useEffect, useMemo } from "react";
import Header from "../../components/Header";
import { fetchMyReliefDuties, updateDutyStatus } from "../../services/reliefAssignmentService";

const getPeriodTime = (period) => {
  const schedule = {
    1: "07:50 AM - 08:30 AM",
    2: "08:30 AM - 09:10 AM",
    3: "09:10 AM - 09:50 AM",
    4: "09:50 AM - 10:30 AM",
    5: "10:50 AM - 11:30 AM",
    6: "11:30 AM - 12:10 PM",
    7: "12:10 PM - 12:50 PM",
    8: "12:50 PM - 01:30 PM",
  };
  return schedule[period] || `Period ${period}`;
};

const StatusBadge = ({ status }) => {
  const isCompleted = status?.toLowerCase() === "completed";
  
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${
        isCompleted
          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
          : "bg-blue-100 text-blue-800 border-blue-200"
      }`}
    >
      {isCompleted ? "Completed" : "Upcoming"}
    </span>
  );
};

const ReliefDuty = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDuties = async () => {
      try {
        const data = await fetchMyReliefDuties();
        setRows(data);
      } catch (error) {
        console.error("Failed to load relief duties", error);
      } finally {
        setLoading(false);
      }
    };
    loadDuties();
  }, []);

  const handleStatusChange = async (assignmentId, newStatus) => {
    const previousRows = [...rows];
    setRows(rows.map(r => 
      (r._id === assignmentId || r.id === assignmentId) ? { ...r, status: newStatus } : r
    ));

    try {
      await updateDutyStatus(assignmentId, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      setRows(previousRows); 
      alert("Failed to update status. Please try again.");
    }
  };

  const dashboardStats = useMemo(() => {
    if (!rows.length) return { total: 0, upcoming: 0, month: 0 };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let upcomingCount = 0;
    let monthCount = 0;

    rows.forEach(row => {
      if (row.status !== 'completed') upcomingCount++;

      const rowDate = row.attendance?.date ? new Date(row.attendance.date) : null;
      if (row.status === 'completed' && rowDate && rowDate.getMonth() === currentMonth && rowDate.getFullYear() === currentYear) {
        monthCount++;
      }
    });

    return {
      total: rows.filter(r => r.status === 'completed').length,
      upcoming: upcomingCount,
      month: monthCount,
    };
  }, [rows]);

  const statsCards = [
    { label: "My Relief Duties", value: dashboardStats.total, sub: "Completed this year", icon: "📚" },
    { label: "Upcoming", value: dashboardStats.upcoming, sub: "To be completed", icon: "⏰" },
    { label: "This Month", value: dashboardStats.month, sub: "Duties completed", icon: "📅" }
  ];

  return (
    <>
      <Header title="Relief Management" />
      <div className="p-6 bg-gray-50 min-h-screen">
        
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statsCards.map((item) => (
            <div key={item.label} className="p-5 bg-white rounded-xl shadow border flex gap-3">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Duty Schedule Table */}
        <div className="bg-white rounded-xl shadow p-6 border">
          <h2 className="font-bold text-lg mb-4">📅 My Relief Duty Schedule</h2>

          {loading ? (
             <p className="text-center text-gray-500 py-8">Loading schedule...</p>
          ) : rows.length === 0 ? (
             <p className="text-center text-gray-500 py-8">No relief duties assigned yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Class</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row) => {
                    const rowId = row._id || row.id;
                    const dateStr = row.attendance?.date 
                      ? new Date(row.attendance.date).toLocaleDateString() 
                      : "N/A";
                    
                    return (
                      <tr key={rowId} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900 font-medium">{dateStr}</td>
                        <td className="p-3 text-sm text-gray-600">{getPeriodTime(row.period)}</td>
                        <td className="p-3 text-sm text-gray-600">{row.subject}</td>
                        <td className="p-3 text-sm text-gray-600 font-semibold">{row.grade}</td>
                        <td className="p-3">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="p-3">
                          <select
                            value={row.status === "completed" ? "completed" : "assigned"}
                            onChange={(e) => handleStatusChange(rowId, e.target.value)}
                            className="border rounded px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                          >
                            <option value="assigned">Upcoming</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReliefDuty;