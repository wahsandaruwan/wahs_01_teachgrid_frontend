import { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header'
import {
  assignReliefTeacher,
  fetchAvailableReliefTeachers,
  fetchReliefAssignmentSummary,
  fetchReliefAssignments
} from '../../services/reliefAssignmentService'

const defaultSummary = {
  totalAssignments: 0,
  assigned: 0,
  unassigned: 0,
  availableTeachers: 0
}

const formatSummary = ({ summary, assignments, teachers }) => {
  const assignmentList = assignments ?? []
  const teacherList = teachers ?? []

  const assignedCount = assignmentList.filter((item) => item.status === 'assigned').length
  const unassignedCount = assignmentList.length - assignedCount
  const availableCount = teacherList.filter((teacher) => teacher.status === 'available').length

  return {
    totalAssignments: summary?.totalAssignments ?? assignmentList.length,
    assigned: summary?.assigned ?? assignedCount,
    unassigned: summary?.unassigned ?? unassignedCount,
    availableTeachers: summary?.availableTeachers ?? availableCount
  }
}

const summaryCards = [
  {
    key: 'totalAssignments',
    label: 'Total Assignments',
    helper: 'This week',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c.132 0 .263-.003.393-.01a4 4 0 100-3.98A4.001 4.001 0 0012 8zm0 0v4l2.5 2.5m4.5-2.5a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  },
  {
    key: 'assigned',
    label: 'Assigned',
    helper: 'Relief teachers assigned',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  },
  {
    key: 'unassigned',
    label: 'Unassigned',
    helper: 'Need relief teachers',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    key: 'availableTeachers',
    label: 'Available Teachers',
    helper: 'Ready for assignment',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    )
  }
]

const tabs = [
  { id: 'assignments', label: 'Relief Assignments' },
  { id: 'calendar', label: 'Calendar View' },
  { id: 'available', label: 'Available Teachers' }
]

const AdminReliefAssignment = () => {
  const [activeTab, setActiveTab] = useState('assignments')
  const [assignments, setAssignments] = useState([])
  const [summary, setSummary] = useState(defaultSummary)
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigningId, setAssigningId] = useState(null)
  const [selection, setSelection] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [assignmentData, summaryData, teacherData] = await Promise.all([
          fetchReliefAssignments(),
          fetchReliefAssignmentSummary(),
          fetchAvailableReliefTeachers()
        ])

        setAssignments(assignmentData)
        setTeachers(teacherData)
        setSummary(formatSummary({ summary: summaryData, assignments: assignmentData, teachers: teacherData }))
      } catch (loadError) {
        console.error(loadError)
        setError('Unable to load relief assignment data right now.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const calendarDays = useMemo(() => {
    return assignments.reduce((acc, assignment) => {
      const existing = acc[assignment.date] ?? []
      acc[assignment.date] = [...existing, assignment]
      return acc
    }, {})
  }, [assignments])

  const orderedCalendarDates = useMemo(
    () => Object.keys(calendarDays).sort((a, b) => new Date(a) - new Date(b)),
    [calendarDays]
  )

  const availableTeacherOptions = useMemo(
    () => teachers.filter((teacher) => teacher.status === 'available'),
    [teachers]
  )

  const handleAssignTeacher = async (assignmentId) => {
    const teacherId = selection[assignmentId]
    if (!teacherId) {
      setError('Please select a teacher before assigning.')
      return
    }

    try {
      setAssigningId(assignmentId)
      setError('')

      await assignReliefTeacher({ assignmentId, teacherId })

      const assignedTeacher = teachers.find((teacher) => teacher.id === teacherId)

      setAssignments((prev) =>
        prev.map((item) =>
          item.id === assignmentId
            ? {
                ...item,
                reliefTeacher: assignedTeacher
                  ? { id: assignedTeacher.id, name: assignedTeacher.name, avatar: assignedTeacher.avatar }
                  : null,
                status: 'assigned'
              }
            : item
        )
      )

      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === teacherId ? { ...teacher, status: 'busy' } : teacher
        )
      )

      setSummary((prev) => ({
        ...prev,
        assigned: prev.assigned + 1,
        unassigned: Math.max(prev.unassigned - 1, 0),
        availableTeachers: Math.max(prev.availableTeachers - 1, 0)
      }))

      setSelection((prev) => ({ ...prev, [assignmentId]: '' }))
    } catch (assignError) {
      console.error(assignError)
      setError('Unable to assign teacher at the moment.')
    } finally {
      setAssigningId(null)
    }
  }

  const renderStatusBadge = (status) => {
    const baseClass = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold'

    if (status === 'assigned') {
      return (
        <span className={`${baseClass} bg-green-100 text-green-700`}>
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />
          Assigned
        </span>
      )
    }

    return (
      <span className={`${baseClass} bg-red-100 text-red-700`}>
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500" />
        Unassigned
      </span>
    )
  }

  return (
    <>
      <Header title="Relief Duty Assignment" />
      <section className="min-h-screen bg-[#F7F8FC] px-6 pb-10 pt-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">{card.icon}</div>
              </div>
              <p className="mt-6 text-3xl font-semibold text-slate-900">
                {loading ? '—' : summary[card.key]}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">{card.label}</p>
              <p className="text-xs text-slate-400">{card.helper}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-4 pt-5 text-sm font-semibold ${
                  activeTab === tab.id
                    ? 'text-indigo-600'
                    : 'text-slate-500 transition-colors hover:text-slate-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-0 -bottom-px block h-0.5 rounded-full bg-indigo-600" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'assignments' && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Manage Relief Assignments</h2>
                  <p className="text-sm text-slate-500">Assign relief teachers to cover absent staff members</p>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {['Date & Time', 'Subject', 'Class', 'Absent Teacher', 'Relief Teacher', 'Status', 'Actions'].map(
                      (column) => (
                        <th
                          key={column}
                          className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {column}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <p className="font-semibold">{assignment.date}</p>
                        <p className="text-slate-500">{assignment.time}</p>
                        <p className="text-xs text-slate-400">{assignment.room}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">{assignment.subject}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{assignment.className}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{assignment.absentTeacher}</td>
                      <td className="px-6 py-4">
                        {assignment.reliefTeacher ? (
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                              {assignment.reliefTeacher.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{assignment.reliefTeacher.name}</p>
                              <p className="text-xs text-slate-500">Confirmed</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{renderStatusBadge(assignment.status)}</td>
                      <td className="px-6 py-4">
                        {assignment.status === 'assigned' ? (
                          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                            Reassign
                          </button>
                        ) : (
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <select
                              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                              value={selection[assignment.id] ?? ''}
                              onChange={(event) =>
                                setSelection((prev) => ({ ...prev, [assignment.id]: event.target.value }))
                              }
                            >
                              <option value="">Select teacher</option>
                              {availableTeacherOptions.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                  {teacher.name}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleAssignTeacher(assignment.id)}
                              disabled={assigningId === assignment.id || !selection[assignment.id]}
                              className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
                                assigningId === assignment.id || !selection[assignment.id]
                                  ? 'bg-slate-300'
                                  : 'bg-slate-900 hover:bg-black'
                              }`}
                            >
                              {assigningId === assignment.id ? 'Assigning…' : 'Assign'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!assignments.length && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                        {loading ? 'Loading assignments…' : 'No relief assignments scheduled.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Calendar View</h2>
            <div className="mt-4 space-y-5">
              {orderedCalendarDates.map((date) => (
                <div key={date} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">{date}</p>
                    </div>
                    <span className="text-sm text-slate-500">
                      {calendarDays[date].length} assignment{calendarDays[date].length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {calendarDays[date].map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            {assignment.subject} · {assignment.className}
                          </p>
                          <p className="text-sm text-slate-600">{assignment.time}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {renderStatusBadge(assignment.status)}
                          {assignment.reliefTeacher ? (
                            <span className="text-sm font-medium text-slate-700">
                              {assignment.reliefTeacher.name}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">Needs assignment</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {!orderedCalendarDates.length && (
                <p className="text-center text-sm text-slate-500">No assignments scheduled yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'available' && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Available Teachers</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {teachers.map((teacher) => (
                <article
                  key={teacher.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                    {teacher.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{teacher.name}</p>
                    <p className="text-sm text-slate-500">{teacher.subject}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      teacher.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {teacher.status === 'available' ? 'Available' : 'Busy'}
                  </span>
                </article>
              ))}
              {!teachers.length && (
                <p className="col-span-full text-center text-sm text-slate-500">
                  {loading ? 'Loading teachers…' : 'No teachers to display.'}
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default AdminReliefAssignment


