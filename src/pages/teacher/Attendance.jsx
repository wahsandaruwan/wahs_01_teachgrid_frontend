import { useState, useMemo, useCallback } from 'react';

const attendanceData = [
  { date: '2025-10-15', status: 'Present', checkIn: '07:20 AM', checkOut: '01:35 PM' },
  { date: '2025-10-14', status: 'Present', checkIn: '07:25 AM', checkOut: '01:35 PM' },
  { date: '2025-10-13', status: 'Leave',   checkIn: '-',        checkOut: '-' },
  { date: '2025-10-12', status: 'Present', checkIn: '07:15 AM', checkOut: '01:40 PM' },
  { date: '2025-10-11', status: 'Late',    checkIn: '08:45 AM', checkOut: '01:35 PM' },
  { date: '2025-10-10', status: 'Present', checkIn: '07:20 AM', checkOut: '01:35 PM' }
];

const StatCard = ({ title, value, subtitle, icon: Icon, bgColor = 'bg-gradient-to-r from-gray-50 to-gray-100' }) => (
  <div className={`${bgColor} rounded-xl p-6 shadow-md flex-1 min-w-[240px] border border-gray-200 hover:shadow-lg transition-all duration-300`}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center shadow-sm">
        {Icon}
      </div>
      <div>
        <div className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-slate-400 text-xs">{subtitle}</div>
      </div>
    </div>
  </div>
);

// Rest of the components remain unchanged...
const StatusBadge = ({ status }) => {
  const badges = {
    Present: {
      text: 'Present',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: '✓'
    },
    Leave: {
      text: 'Leave',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '✗'
    },
    Late: {
      text: 'Late',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: '⚠'
    }
  };

  const badge = badges[status] || badges.Present;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${badge.color}`}>
      <span className="mr-1 font-bold text-base">{badge.icon}</span>
      {badge.text}
    </span>
  );
};

// The Attendance component remains exactly the same until the StatCard usage...
const Attendance = () => {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('2025-10');
  const [isExporting, setIsExporting] = useState(false);

  const filteredData = useMemo(() => {
    return attendanceData.filter((row) => {
      const matchesSearch = row.date.includes(search);
      const matchesMonth = row.date.startsWith(date);
      return matchesSearch && matchesMonth;
    });
  }, [search, date]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsExporting(false);
    alert('Attendance report exported successfully!');
  }, []);

  const stats = useMemo(() => {
    const present = attendanceData.filter((d) => d.status === 'Present').length;
    const totalDays = attendanceData.length;
    const attendanceRate = totalDays ? Math.round((present / totalDays) * 100) : 0;

    return {
      rate: `${attendanceRate}%`,
      presentDays: present.toString(),
      leaveDays: (totalDays - present).toString()
    };
  }, []);

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">No attendance records found</h3>
      <p className="text-gray-500 mb-4 text-sm">Try adjusting your search or date filter</p>
      <button
        onClick={() => {
          setSearch('');
          setDate('2025-10');
        }}
        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-1">
              Attendance Records
            </h1>
            <p className="text-slate-600 text-base">Track your attendance history and generate reports</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Live Data</span>
          </div>
        </div>

        {/* Stat cards - Colors removed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Attendance Rate"
            value={stats.rate}
            subtitle="This Month"
            icon={
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Present Days"
            value={stats.presentDays}
            subtitle="Out of 23 working days"
            icon={
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Leave Days"
            value={stats.leaveDays}
            subtitle="Approved leaves"
            icon={
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-2zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-2zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-2z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

        {/* Rest of the component remains exactly the same */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
          {/* Top controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">My Attendance History</h2>
              <p className="text-slate-500 text-sm">View detailed attendance records and download monthly reports</p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Month filter */}
              <div className="flex bg-slate-100/80 rounded-lg p-1.5">
                <input
                  type="month"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent px-3 py-1.5 border-none focus:outline-none text-base font-semibold"
                />
              </div>
              {/* Export button */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="group relative px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm"
              >
                {isExporting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 group-hover:translate-x-[-1px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by date (e.g. 2025-10-15)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm pl-10 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 shadow-sm transition-all duration-300"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm">
            {filteredData.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Check In</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Check Out</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr
                      key={row.date}
                      className={`${
                        index % 2 === 0
                          ? 'bg-white/70 hover:bg-blue-50/50'
                          : 'bg-slate-50/70 hover:bg-blue-50/30'
                      } border-b border-slate-100 transition-all duration-200 cursor-pointer group`}
                    >
                      <td className="px-6 py-3 font-semibold text-slate-900 group-hover:text-blue-700 text-sm">{row.date}</td>
                      <td className="px-6 py-3 text-slate-700 font-medium text-sm">{row.checkIn}</td>
                      <td className="px-6 py-3 text-slate-700 font-medium text-sm">{row.checkOut}</td>
                      <td className="px-6 py-3"><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Attendance;
