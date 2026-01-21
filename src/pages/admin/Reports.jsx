import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  fetchAttendanceReports,
  fetchLeaveReports,
  fetchReliefReports,
} from "../../services/reportsService";
import {
  Download,
  FileSpreadsheet,
  Activity,
  Users,
  Calendar,
  UserCheck,
  Search,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [attendanceData, setAttendanceData] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [reliefData, setReliefData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const isInitialLoad = useRef(true);
  const isTabChanging = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [att, leave, relief] = await Promise.all([
          fetchAttendanceReports(filterDate),
          fetchLeaveReports(filterDate),
          fetchReliefReports(filterDate),
        ]);
        setAttendanceData(att);
        setLeaveData(leave);
        setReliefData(relief);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
        isTabChanging.current = false;
      }
    };

    loadData();
  }, [filterDate, activeTab]);

  const handleTabChange = (tab) => {
    isTabChanging.current = true;
    setActiveTab(tab);
    setSearchTerm("");
    setFilterDate("");
  };

  // Filtering Logic
  const filteredAttendance =
    attendanceData?.attendanceList
      ?.filter((item) =>
        item.teacher.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        if (b.date !== a.date) return b.date.localeCompare(a.date);
        const statusOrder = { Present: 1, Late: 2, Leave: 3, Absent: 4 };
        return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      }) || [];

  const filteredLeave =
    leaveData?.recent?.filter((item) => {
      const nameMatch = item.teacher
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isApproved =
        item.status && item.status.toLowerCase() === "approved";

      return nameMatch && isApproved;
    }) || [];

  // Logic to update Pie Chart based on filtered Approved leave only
  const approvedDistribution = filteredLeave.reduce((acc, curr) => {
    const existing = acc.find((item) => item.name === curr.type);
    if (existing) {
      existing.value += 1;
    } else {
      const colorMap = {
        "Emergency Leave": "#f59e0b",
        "Medical Leave": "#ec4899",
        "Personal Leave": "#8b5cf6",
        "Official Leave": "#3b82f6",
      };
      acc.push({
        name: curr.type,
        value: 1,
        color: colorMap[curr.type] || "#cbd5e1",
      });
    }
    return acc;
  }, []);

  const filteredRelief =
    (Array.isArray(reliefData) ? reliefData : [])?.filter(
      (item) =>
        item.absent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.relief?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const getActiveData = () => {
    if (activeTab === "attendance") return filteredAttendance;
    if (activeTab === "leave") return filteredLeave;
    if (activeTab === "relief") {
      return filteredRelief.filter(
        (item) =>
          item.relief &&
          item.relief.trim() !== "" &&
          item.relief !== "-" &&
          item.relief.toLowerCase() !== "unassigned",
      );
    }
    return [];
  };

  // Export Logic
  const confirmDownload = (format) => {
    const dateLabel = filterDate ? `for date: ${filterDate}` : "for all dates";
    const confirmed = window.confirm(
      `You have selected ${dateLabel}. Do you want to download the ${format} report?`,
    );
    if (confirmed) {
      if (format === "CSV") exportCSV();
      else exportPDF();
    }
  };

  const exportCSV = () => {
    const dataToExport = getActiveData();
    if (dataToExport.length === 0) return alert("No data to export");
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers =
      activeTab === "attendance"
        ? ["Date", "Teacher Name", "Status"]
        : activeTab === "leave"
          ? ["Teacher Name", "Type", "Date", "Status"]
          : ["Date", "Absent Teacher", "Relief Teacher", "Subject", "Class"];
    csvContent += headers.join(",") + "\r\n";
    dataToExport.forEach((item) => {
      const row =
        activeTab === "attendance"
          ? [item.date, item.teacher, item.status]
          : activeTab === "leave"
            ? [item.teacher, item.type, item.date, item.status]
            : [item.date, item.absent, item.relief, item.subject, item.class];
      csvContent += row.map((f) => `"${f}"`).join(",") + "\r\n";
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Report_${activeTab}.csv`);
    link.click();
  };

  const exportPDF = () => {
    const dataToExport = getActiveData();
    if (dataToExport.length === 0) {
      alert("No assigned records found to export.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const today = new Date().toISOString().split("T")[0];

    // Header styling
    doc.setFillColor(26, 54, 126);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("H/Meegasara Maha Vidyalaya", 15, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("TeachGrid Official Staff Management System", 15, 30);

    // Title Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    let reportTitle =
      activeTab === "attendance"
        ? "Attendance Report"
        : activeTab === "leave"
          ? "Staff Leave Report"
          : "Assigned Relief Report";
    doc.text(reportTitle, 15, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Period: ${filterDate || "All Records"}`, 15, 62);
    doc.text(`Generated: ${today}`, 15, 68);

    const tableHeaders =
      activeTab === "attendance"
        ? ["Date", "Teacher Name", "Status"]
        : activeTab === "leave"
          ? ["Teacher Name", "Type", "Date", "Status"]
          : ["Date", "Absent Teacher", "Relief Teacher", "Subject & Class"];

    const tableBody =
      activeTab === "attendance"
        ? dataToExport.map((i) => [i.date, i.teacher, i.status])
        : activeTab === "leave"
          ? dataToExport.map((i) => [i.teacher, i.type, i.date, i.status])
          : dataToExport.map((i) => [
              i.date,
              i.absent,
              i.relief,
              `${i.subject} (${i.class})`,
            ]);

    autoTable(doc, {
      startY: 80,
      head: [tableHeaders],
      body: tableBody,
      theme: "striped",
      headStyles: { fillColor: [26, 54, 126] },
      margin: { bottom: 45 },
      didDrawPage: () => {
        const pW = doc.internal.pageSize.getWidth();
        const pH = doc.internal.pageSize.getHeight();

        const str = "Page " + doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(str, pW / 2, pH - 10, { align: "center" });
      },
    });

    const finalY = pageHeight - 35;
    doc.setFontSize(10);
    doc.setTextColor(0);

    // Teacher Signature
    doc.setFont("helvetica", "normal");
    doc.text("..................................................", 15, finalY);
    doc.setFont("helvetica", "bold");
    doc.text("Teacher's Signature", 15, finalY + 5);

    // Principal Signature
    const sigText = "Principal's Signature";
    const dotsLine = "..................................................";
    const dWidth = doc.getTextWidth(dotsLine);
    const tWidth = doc.getTextWidth(sigText);

    doc.setFont("helvetica", "normal");
    doc.text(dotsLine, pageWidth - dWidth - 15, finalY);
    doc.setFont("helvetica", "bold");
    doc.text(sigText, pageWidth - tWidth - 15, finalY + 5);

    doc.save(`${activeTab}_Report_${today}.pdf`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Reports & Analytics" />

      <div
        className={`flex-1 p-6 transition-opacity duration-300 ${
          loading ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex space-x-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            {["attendance", "leave", "relief"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-black text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => confirmDownload("CSV")}
              className="flex items-center gap-2 rounded-lg bg-black text-white px-3 py-2 text-sm hover:bg-gray-800"
            >
              <FileSpreadsheet size={16} /> Export CSV
            </button>
            <button
              onClick={() => confirmDownload("PDF")}
              className="flex items-center gap-2 rounded-lg bg-gray-700 text-white px-3 py-2 text-sm hover:bg-gray-600"
            >
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>

        {activeTab === "attendance" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Avg Attendance"
              value={attendanceData?.summary?.averageAttendance}
              icon={<Activity />}
              color="text-blue-600"
            />
            <StatCard
              title="Total Present"
              value={attendanceData?.summary?.totalPresent}
              icon={<UserCheck />}
              color="text-green-600"
            />
            <StatCard
              title="Total Late"
              value={attendanceData?.summary?.totalLate}
              icon={<Users />}
              color="text-yellow-600"
            />
            <StatCard
              title="Total Absent"
              value={attendanceData?.summary?.totalAbsent}
              icon={<Calendar />}
              color="text-red-600"
            />
          </div>
        )}

        {activeTab === "leave" ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h4 className="text-xs font-bold mb-6 uppercase text-gray-400 tracking-wider">
                  Leave Distribution
                </h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={approvedDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        dataKey="value"
                      >
                        {approvedDistribution.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h3 className="font-bold text-gray-800 text-lg">
                    Leave Details
                  </h3>
                  <div className="flex gap-2">
                    <SearchInput value={searchTerm} onChange={setSearchTerm} />
                    <DateInput value={filterDate} onChange={setFilterDate} />
                  </div>
                </div>
                <Table data={getActiveData()} type="leave" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="font-bold text-gray-800 capitalize text-lg">
                {activeTab} Details
              </h3>
              <div className="flex gap-2">
                <SearchInput value={searchTerm} onChange={setSearchTerm} />
                <DateInput value={filterDate} onChange={setFilterDate} />
              </div>
            </div>
            <Table data={getActiveData()} type={activeTab} />
          </div>
        )}
      </div>
    </div>
  );
};

// Sub Components
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 ">
    <div className={`flex justify-between mb-2 ${color}`}>
      {icon}{" "}
      <span className="text-black font-bold text-xs uppercase">{title}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
  </div>
);

const SearchInput = ({ value, onChange }) => (
  <div className="relative">
    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
    <input
      type="text"
      placeholder="Search..."
      className="pl-9 py-2 border border-gray-200 rounded-lg text-sm outline-none w-48 focus:ring-1 focus:ring-black"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const DateInput = ({ value, onChange }) => (
  <input
    type="date"
    className="border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:ring-1 focus:ring-black text-gray-600"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

const Table = ({ data, type }) => {
  const columns = {
    attendance: ["Date", "Teacher Name", "Status"],
    leave: ["Teacher", "Type", "Date", "Status"],
    relief: ["Date", "Absent Teacher", "Relief Teacher", "Subject", "Class"],
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-cyan-100 dark:bg-cyan-200 text-gray-400 text-[11px] uppercase font-bold tracking-widest border-b border-gray-300">
          <tr>
            {columns[type].map((c) => (
              <th key={c} className="px-6 py-5">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 text-sm">
                {type === "attendance" && (
                  <>
                    <td className="px-6 py-4 text-gray-500">{row.date}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {row.teacher}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </>
                )}
                {type === "leave" && (
                  <>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {row.teacher}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{row.type}</td>
                    <td className="px-6 py-4 text-gray-500">{row.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </>
                )}
                {type === "relief" && (
                  <>
                    <td className="px-6 py-4 text-gray-500">{row.date}</td>
                    <td className="px-6 py-4 text-gray-800">{row.absent}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {row.relief}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{row.subject}</td>
                    <td className="px-6 py-4 text-gray-800">{row.class}</td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-10 text-center text-gray-400 italic"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Present: "bg-green-100 text-green-700",
    Approved: "bg-green-100 text-green-700",
    Late: "bg-blue-100 text-blue-700",
    Leave: "bg-yellow-100 text-yellow-700",
    Absent: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default Reports;
