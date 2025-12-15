import { useState } from 'react'

// Sample Attendance Data
const attendanceData = [
  { date: '2025-10-15', status: 'Present', checkIn: '7:20 AM', checkOut: '1.35 PM' },
  { date: '2025-10-14', status: 'Present', checkIn: '7:25 AM', checkOut: '1.35 PM' },
  { date: '2025-10-13', status: 'Leave', checkIn: '-', checkOut: '-' },
  { date: '2025-10-12', status: 'Present', checkIn: '7:15 AM', checkOut: '1.40 PM' }
]


// TopBar Component
const TopBar = () => {
  return (
    <header className="w-full bg-white shadow-md px-8 py-5 mb-8">
      <h1 className="text-xl font-semibold text-gray-800">Attendance Records Overview</h1>
    </header>
  )
}

// StatCard Component 
const StatCard = ({ title, value, subtitle }) => {
  return (
    <div
      className="relative bg-white rounded-xl p-7 shadow-md flex-1 min-w-[250px]
                 transition-all duration-300 cursor-pointer
                 hover:shadow-2xl hover:scale-[1.03]"
    >
      <div className="text-[#aaadc1] text-base mb-2">{title}</div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-[#949fc5] text-sm">{subtitle}</div>
    </div>
  )
}

// Main Attendance Component-
const Attendance = () => {
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('2025-10-24')

  const filteredData = attendanceData.filter((row) =>
    row.date.includes(search)
  )

  return (
    <main className="flex-1 p-10">

      {/* Top Bar */}
      <TopBar />

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-6 mb-9">
        <StatCard title="This Month" value="96%" subtitle="Attendance Rate" />
        <StatCard title="Present Days" value="22" subtitle="Out of 23 working days" />
        <StatCard title="Leave Days" value="1" subtitle="Approved leave" />
      </div>

      {/* Attendance Table Section */}
      <div className="bg-white rounded-xl shadow-md p-8">

        <div className="flex flex-col gap-4 items-start justify-between md:flex-row md:items-center mb-6">
          <div>
            <strong>My Attendance Record</strong>
            <div className="text-[#909cb5] text-sm">
              View your personal attendance history and download reports
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 border border-[#eee] rounded transition"
            />
            <button className="bg-[#263066] text-white border-none px-4 py-2 rounded cursor-pointer">
              Export
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search dates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 px-2 py-2 rounded border border-[#ddd] w-full max-w-xs"
        />

        {/* Table */}
        <table className="w-full mt-1 border-collapse">
          <thead>
            <tr className="bg-[#f2f4fc] text-left">
              <th className="px-2 py-2">Date</th>
              <th className="px-2 py-2">Check In</th>
              <th className="px-2 py-2">Check Out</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr
                key={row.date}
                className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'}
              >
                <td className="px-2 py-2">{row.date}</td>
                <td className="px-2 py-2">{row.checkIn}</td>
                <td className="px-2 py-2">{row.checkOut}</td>
                <td className="px-2 py-2">
                  {row.status === 'Present' ? (
                    <span className="text-green-700 font-semibold">✓ Present</span>
                  ) : (
                    <span className="text-[#cb2a3e] font-semibold">✗ Leave</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </main>
  )
}

export default Attendance
