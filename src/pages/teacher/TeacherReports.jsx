import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchTeacherPersonalReports } from "../../services/reportsService";
import {
  Search,
  UserCheck,
  Clock,
  Activity,
  Download,
  FileDown,
} from "lucide-react";
import { useUser } from "../../contexts/UserContext";

const TeacherReports = () => {
  const { user } = useUser();
  

  const [activeTab, setActiveTab] = useState("attendance");
  

  const [reportData, setReportData] = useState({
    attendance: [],
    leaves: [],
    relief: [],
  });
  
  const [loading, setLoading] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); 

  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchTeacherPersonalReports("");
        if (res && res.success) {
        
          const filteredAttendance = (res.data.attendance || []).filter(
            (item) => item.status?.toLowerCase() === "present" || item.status?.toLowerCase() === "late"
          );

          // Filter relief to show only 'completed' tasks
          const filteredRelief = (res.data.relief || []).filter(
            (item) => item.status?.toLowerCase() === "completed"
          );

          setReportData({
            attendance: filteredAttendance,
            leaves: res.data.leaves || [],
            relief: filteredRelief,
          });
        }
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Function to convert 24-hour time format to 12-hour AM/PM format
  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === "--") return "--";
    if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) return timeStr;

    try {
      const [hours, minutes] = timeStr.split(':');
      let h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${minutes} ${ampm}`;
    } catch {
      
      return timeStr; 
    }
  };


  const formatDate = (item) => {
    const dateVal = item.date || item.startDate || item.createdAt || item.updatedAt;
    return dateVal ? dateVal.split("T")[0] : "N/A";
  };

 
  const calculateDuration = (start, end) => {
    if(!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };


  const totalApprovedLeaveDays = reportData.leaves
    .filter(item => item.status?.toLowerCase() === "approved")
    .reduce((acc, curr) => acc + calculateDuration(curr.startDate, curr.endDate), 0);

  const presentCount = reportData.attendance.filter(item => item.status?.toLowerCase() === "present").length;
  const lateCount = reportData.attendance.filter(item => item.status?.toLowerCase() === "late").length;
  const totalAttendance = reportData.attendance.length;

  
  const getFilteredData = () => {
    let list = reportData[activeTab] || [];
    if (searchTerm) {
      list = list.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return [...list].sort((a, b) => {
      const dateA = new Date(a.date || a.startDate || a.createdAt);
      const dateB = new Date(b.date || b.startDate || b.createdAt);
      return dateB - dateA;
    });
  };

  // Function to generate and download the PDF report
  const exportPDF = () => {
    try {
      let data = getFilteredData();
      if (activeTab === "leaves") {
        data = data.filter((item) => item.status.toLowerCase() === "approved");
      }
      if (data.length === 0) return alert("No reports found to export.");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Draw PDF Header section
      doc.setFillColor(26, 54, 138); 
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18).setFont("helvetica", "bold").text("H/Meegasara Maha Vidyalaya", 14, 18);
      doc.setFontSize(10).setFont("helvetica", "normal").text("Official Academic Record - TeachGrid System", 14, 28);

      // Report 
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(14).setFont("helvetica", "bold").text(`${activeTab.toUpperCase()} REPORT`, 14, 55);
      doc.setFontSize(10).setFont("helvetica", "normal").text("Teacher Name  :", 14, 63);
      doc.setFont("helvetica", "bold").text(`${user?.name || "N/A"}`, 45, 63);
      
      const now = new Date();
      doc.setFont("helvetica", "normal").text("Generated On   :", 14, 68);
      doc.setFont("helvetica", "bold").text(now.toLocaleDateString(), 45, 68);

      let tableStartY = 85;

      // Summary statistics row for PDF
      if (activeTab === "attendance" || activeTab === "leaves") {
        doc.setFillColor(245, 247, 250);
        doc.rect(14, 72, pageWidth - 28, 10, "F");
        doc.setFontSize(10).setFont("helvetica", "bold").setTextColor(26, 54, 138);
        const summaryText = activeTab === "attendance" 
          ? `Present: ${presentCount} | Late: ${lateCount} | Total Days: ${totalAttendance}`
          : `SUMMARY: TOTAL APPROVED LEAVE DAYS = ${totalApprovedLeaveDays}`;
        doc.text(summaryText, 18, 78);
        tableStartY = 88;
      }

      
      const headers =
        activeTab === "relief"
          ? [["DATE", "GRADE", "SUBJECT", "PERIOD", "STATUS"]]
          : activeTab === "attendance"
          ? [["DATE", "DESCRIPTION", "TIMING", "STATUS"]]
          : [["DATE", "LEAVE TYPE", "DURATION", "STATUS"]];

      
      const body = data.map((item) => {
        const rowDate = formatDate(item);
        if (activeTab === "relief") {
          return [rowDate, `Grade ${item.grade}`, item.subject, item.period, item.status.toUpperCase()];
        } else if (activeTab === "attendance") {
          return [rowDate, "Attendance Entry", `${formatTime(item.checkIn)} - ${formatTime(item.checkOut)}`, item.status.toUpperCase()];
        } else {
          return [rowDate, item.leaveType, `${calculateDuration(item.startDate, item.endDate)} Day(s)`, item.status.toUpperCase()];
        }
      });

      
      autoTable(doc, {
        startY: tableStartY,
        head: headers,
        body: body,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3, halign: "center", lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [26, 54, 138], textColor: [255, 255, 255] },
        margin: { bottom: 60 },
        didDrawPage: (data) => {
          doc.setFontSize(8).setTextColor(150);
          doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" });
        },
      });

      // Signature area at bottom of report
      const sigY = pageHeight - 40;
      doc.text("..........................................", 14, sigY);
      doc.text("Teacher's Signature", 14, sigY + 7);
      doc.text("..........................................", pageWidth - 70, sigY);
      doc.text("Principal's Signature", pageWidth - 70, sigY + 7);

      doc.save(`Report_${activeTab}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
    }
  };

  // Function to generate and download a CSV file
  const exportCSV = () => {
    let data = getFilteredData();
    let csvContent = "data:text/csv;charset=utf-8,Date,Detail,Timing,Status\r\n";
    data.forEach((item) => {
      csvContent += `${formatDate(item)},${activeTab},${item.checkIn || "--"},${item.status}\r\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Report_${activeTab}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#1e293b]">
      <Header title="Reports Center" />
      <div className="p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ATTENDANCE</h3>
                <div className="flex gap-4 items-end">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Present</p>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-100 mb-1"></div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">{lateCount}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Late</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg"><UserCheck size={20} className="text-emerald-500" /></div>
            </div>
            <p className="text-xs text-slate-400 italic">Total Working Days: {totalAttendance}</p>
          </div>

          <StatCard title="LEAVES" value={totalApprovedLeaveDays} label="Total Approved Days" icon={<Clock size={20} className="text-orange-500" />} />
          <StatCard title="RELIEF" value={reportData.relief.length} label="Completed Reliefs" icon={<Activity size={20} className="text-blue-500" />} />
        </div>

        {/* Main Data Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="p-6 border-b border-[#f1f5f9] flex flex-col xl:flex-row justify-between gap-4">
            
            {/* Tab Navigation Controls */}
            <div className="flex bg-white border border-[#e2e8f0] p-1 rounded-lg">
              {["attendance", "leaves", "relief"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab ? "bg-[#1e293b] text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Search Input and Export Buttons Group */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-[#e2e8f0] text-sm md:w-64 outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-white border border-[#e2e8f0] rounded-lg p-1">
                <button onClick={exportPDF} className="flex items-center bg-black gap-2 px-4 py-1.5 rounded-md text-sm font-bold text-white border-r">
                  <FileDown size={16} className="text-red-500" /> PDF
                </button>
                <button onClick={exportCSV} className="flex items-center bg-gray-700 gap-2 px-4 py-1.5 rounded-md text-sm font-bold text-white">
                  <Download size={16} className="text-emerald-400" /> CSV
                </button>
              </div>
            </div>
          </div>

          {/* Records Display Table */}
          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-left border-b text-[11px] uppercase italic">
                  <th className="px-6 py-4">Date</th>
                  {activeTab === "attendance" && (
                    <>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Timing</th>
                    </>
                  )}
                  {activeTab === "leaves" && (
                    <>
                      <th className="px-6 py-4">Leave Type</th>
                      <th className="px-6 py-4">Duration</th>
                    </>
                  )}
                  {activeTab === "relief" && (
                    <>
                      <th className="px-6 py-4">Grade & Subject</th>
                      <th className="px-6 py-4">Period</th>
                    </>
                  )}
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="py-20 text-center font-bold text-slate-400 animate-pulse">SYNCING...</td></tr>
                ) : (
                  getFilteredData().map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-all text-sm font-semibold text-slate-600">
                      <td className="px-6 py-4">{formatDate(item)}</td>
                      {activeTab === "attendance" && (
                        <>
                          <td className="px-6 py-4">Attendance Entry</td>
                          {/* Display converted 12-hour time in table rows */}
                          <td className="px-6 py-4">{formatTime(item.checkIn)} - {formatTime(item.checkOut)}</td>
                        </>
                      )}
                      {activeTab === "leaves" && (
                        <>
                          <td className="px-6 py-4">{item.leaveType}</td>
                          <td className="px-6 py-4">{calculateDuration(item.startDate, item.endDate)} Day(s)</td>
                        </>
                      )}
                      {activeTab === "relief" && (
                        <>
                          <td className="px-6 py-4">Grade {item.grade} - {item.subject}</td>
                          <td className="px-6 py-4">Period {item.period}</td>
                        </>
                      )}
                      <td className="px-6 py-4 text-center"><StatusBadge status={item.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


const StatCard = ({ title, value, label, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-900 leading-none">{value}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg border border-[#f1f5f9]">{icon}</div>
    </div>
    <p className="text-xs text-slate-400 font-medium italic">{label}</p>
  </div>
);


const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  const styles =
    s === "present" || s === "approved" || s === "completed"
      ? "bg-green-50 text-green-700 border-green-100"
      : s === "pending" || s === "late"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-red-50 text-red-700 border-red-100";
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${styles} shadow-sm`}>
      {status}
    </span>
  );
};

export default TeacherReports;