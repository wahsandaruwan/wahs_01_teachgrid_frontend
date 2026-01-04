import { useState, useMemo, useCallback } from "react";
import Header from "../../components/Header";

const attendanceData = [
  { date: "2025-10-15", status: "Present", checkIn: "07:20 AM", checkOut: "01:35 PM" },
  { date: "2025-10-14", status: "Present", checkIn: "07:25 AM", checkOut: "01:35 PM" },
  { date: "2025-10-13", status: "Leave", checkIn: "-", checkOut: "-" },
  { date: "2025-10-12", status: "Present", checkIn: "07:15 AM", checkOut: "01:40 PM" },
  { date: "2025-10-11", status: "Late", checkIn: "08:45 AM", checkOut: "01:35 PM" },
  { date: "2025-10-10", status: "Present", checkIn: "07:20 AM", checkOut: "01:35 PM" }
];

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Present: "bg-green-100 text-green-700",
    Leave: "bg-red-100 text-red-700",
    Late: "bg-orange-100 text-orange-700"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

const Attendance = () => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("2025-10");
  const [isExporting, setIsExporting] = useState(false);

  const filteredData = useMemo(() => {
    return attendanceData.filter(
      (row) => row.date.includes(search) && row.date.startsWith(date)
    );
  }, [search, date]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    await new Promise((res) => setTimeout(res, 1500));
    setIsExporting(false);
    alert("Attendance report exported!");
  }, []);

  const stats = useMemo(() => {
    const present = attendanceData.filter(d => d.status === "Present").length;
    return {
      rate: `${Math.round((present / attendanceData.length) * 100)}%`,
      presentDays: present,
      leaveDays: attendanceData.length - present
    };
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* HEADER AT VERY TOP */}
      <Header title="Attendance Records" />

      {/* PAGE CONTENT */}
      <div className="p-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Attendance Rate" value={stats.rate} subtitle="This Month" icon="📊" />
          <StatCard title="Present Days" value={stats.presentDays} subtitle="Working Days" icon="✅" />
          <StatCard title="Leave Days" value={stats.leaveDays} subtitle="Total Leaves" icon="❌" />
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Search by date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {filteredData.length ? (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Check In</th>
                  <th className="p-3 text-left">Check Out</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.date} className="border-t">
                    <td className="p-3">{row.date}</td>
                    <td className="p-3">{row.checkIn}</td>
                    <td className="p-3">{row.checkOut}</td>
                    <td className="p-3">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-center text-gray-500">No records found</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Attendance;
