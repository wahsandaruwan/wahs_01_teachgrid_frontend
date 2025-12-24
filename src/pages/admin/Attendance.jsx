import Header from '../../components/Header'
import { useEffect, useState } from 'react'
import {
  Search,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

const SUBJECT_OPTIONS = [
  'Mathematics','English','Sinhala','Science','History','Buddhism','Tamil',
  'Christianity','ICT','Agriculture','Geography','Home Science','Commerce',
  'Civic Education','Music','Dance','Art'
]

const STATUS_OPTIONS = [
  { label: 'Present', value: 'present' },
  { label: 'Late', value: 'late' },
  { label: 'Leave', value: 'leave' }
]

const mockAssignments = [
  { id: 1, date: '2025-12-24', subject: 'Mathematics', absentTeacher: 'John Smith', status: 'present', checkIn: '08:30', checkOut: '16:00' },
  { id: 2, date: '2025-12-24', subject: 'English', absentTeacher: 'Emily Davis', status: 'late', checkIn: '09:15', checkOut: '16:00' },
  { id: 3, date: '2025-12-23', subject: 'Science', absentTeacher: 'Michael Johnson', status: 'leave', checkIn: '', checkOut: '' }
]

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="rounded-2xl bg-white p-5 shadow flex justify-between items-center">
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
    {icon}
  </div>
)

const Attendance = () => {
  const [assignments, setAssignments] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [editData, setEditData] = useState({
    
    subject: '',
    status: '',
    checkIn: '',
    checkOut: ''
  })

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
      const records = mockAssignments.filter(a => a.date === selectedDate)

  setAssignments(records)

}, [selectedDate])

 

  const handleEdit = (row) => {
    setEditingId(row.id)
    setEditData(row)
  }

  const handleSave = (id) => {
    setAssignments(prev =>
      prev.map(item => (item.id === id ? { ...item, ...editData } : item))
    )
    setEditingId(null)
  }

  const statusBadge = (status) => {
    const base = 'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold'
    if (status === 'present')
      return <span className={`${base} bg-green-100 text-green-700`}><CheckCircle size={12}/>Present</span>
    if (status === 'late')
      return <span className={`${base} bg-yellow-100 text-yellow-700`}><Clock size={12}/>Late</span>
    return <span className={`${base} bg-red-100 text-red-700`}><XCircle size={12}/>Leave</span>
  }

  const filtered = assignments.filter(a =>
    a.absentTeacher.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header title="Attendance Records" />

      <section className="min-h-screen bg-[#F7F8FC] p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Overall Rate" value="94%" subtitle="School average" icon={<CheckCircle className="text-green-500" />} />
          <StatCard title="Present Today" value="42" subtitle="Out of 45" icon={<CheckCircle className="text-green-500" />} />
          <StatCard title="On Leave" value="3" subtitle="Approved" icon={<XCircle className="text-red-500" />} />
          <StatCard title="Late Arrivals" value="2" subtitle="After 9:00 AM" icon={<Clock className="text-yellow-500" />} />
        </div>

        {/* Table Card */}
        <div className="rounded-2xl bg-white p-6 shadow">

          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-between mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search teachers..."
                className="w-full rounded-lg border bg-slate-50 pl-10 py-2 text-sm focus:outline-none focus:ring"
              />
            </div>

            <div className="flex gap-2">
               <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-white">
                <Calendar size={16} className="text-slate-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="outline-none bg-transparent"
                />
              </div>

              <button className="flex items-center gap-2 rounded-lg bg-black text-white px-3 py-2 text-sm">
                <Download size={16}/>Export
              </button>
            </div>
            </div>
          

          {/* Table */}
          <table className="w-full border-collapse">
            <thead className="text-xs text-slate-500 border-b">
              <tr>
                <th className="py-3 text-left">Teacher</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-3 font-medium">{row.absentTeacher}</td>

                  <td>
                    {editingId === row.id ? (
                      <select
                        className="border rounded p-1"
                        value={editData.subject}
                        onChange={e => setEditData({ ...editData, subject: e.target.value })}
                      >
                        {SUBJECT_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    ) : row.subject}
                  </td>

                  <td>{row.date}</td>

                  <td>
                    {editingId === row.id ? (
                      <select
                        className="border rounded p-1"
                        value={editData.status}
                        onChange={e => setEditData({ ...editData, status: e.target.value })}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    ) : statusBadge(row.status)}
                  </td>

                  <td>
                    {editingId === row.id ? (
                      <input type="time" className="border rounded p-1"
                        value={editData.checkIn}
                        onChange={e => setEditData({ ...editData, checkIn: e.target.value })}
                      />
                    ) : row.checkIn || '-'}
                  </td>

                  <td>
                    {editingId === row.id ? (
                      <input type="time" className="border rounded p-1"
                        value={editData.checkOut}
                        onChange={e => setEditData({ ...editData, checkOut: e.target.value })}
                      />
                    ) : row.checkOut || '-'}
                  </td>

                  <td className="space-x-2">
                    {editingId === row.id ? (
                      <>
                        <button onClick={() => handleSave(row.id)} className="text-green-600">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-red-600">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => handleEdit(row)} className="text-blue-600">Edit</button>
                    )}
                  </td>
                </tr>
              ))}

                {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-sm text-slate-500">
                    No attendance records found for this date.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>
      </section>
    </>
  )
}

export default Attendance
