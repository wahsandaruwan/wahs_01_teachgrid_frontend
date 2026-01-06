import { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header'
import { assignReliefTeacher, fetchAvailableReliefTeachers, fetchReliefAssignments } from '../../services/reliefAssignmentService'

const AdminReliefAssignment = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigningId, setAssigningId] = useState(null)
  const [selection, setSelection] = useState({})
  const [availableById, setAvailableById] = useState({})
  const [availableLoadingId, setAvailableLoadingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')
        const assignmentData = await fetchReliefAssignments()
        setAssignments(assignmentData ?? [])
      } catch (loadError) {
        console.error(loadError)
        setError('Unable to load relief assignment data right now.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const summary = useMemo(() => {
    const totalAssignments = assignments.length
    const assigned = assignments.filter((item) => item.status === 'assigned').length
    const unassigned = totalAssignments - assigned
    return { totalAssignments, assigned, unassigned }
  }, [assignments])

  const handleLoadAvailable = async (assignment) => {
    const assignmentId = assignment._id || assignment.id
    if (!assignmentId) return

    if (availableById[assignmentId]) return

    try {
      setAvailableLoadingId(assignmentId)
      setError('')
      // FIX: Passing date from attendance object to help backend filtering
      const options = await fetchAvailableReliefTeachers({
        dayOfWeek: assignment.dayOfWeek,
        period: assignment.period,
        grade: assignment.grade,
        date: assignment.attendance?.date 
      })
      setAvailableById((prev) => ({ ...prev, [assignmentId]: options ?? [] }))
    } catch (availError) {
      console.error(availError)
      const status = availError?.response?.status
      if (status === 403) setError('Only admins can view available relief teachers.')
      else if (status === 400) setError('Invalid request while fetching available teachers.')
      else setError('Unable to load available teachers right now.')
    } finally {
      setAvailableLoadingId(null)
    }
  }

  const handleAssignTeacher = async (assignment) => {
    const assignmentId = assignment._id || assignment.id
    const teacherId = selection[assignmentId]
    if (!teacherId) {
      setError('Please select a teacher before assigning.')
      return
    }

    try {
      setAssigningId(assignmentId)
      setError('')

      const response = await assignReliefTeacher({ assignmentId, teacherId })
      const updated = response?.reliefAssignment || response?.assignment || response

      setAssignments((prev) =>
        prev.map((item) => {
          const itemId = item._id || item.id
          if (itemId !== assignmentId) return item
          return {
            ...item,
            reliefTeacher: updated?.reliefTeacher ?? item.reliefTeacher,
            status: updated?.status ?? 'assigned'
          }
        })
      )

      setSelection((prev) => ({ ...prev, [assignmentId]: '' }))
    } catch (assignError) {
      console.error(assignError)
      const status = assignError?.response?.status
      const message = assignError?.response?.data?.message
      if (status === 403) setError('You do not have permission to assign relief teachers.')
      else if (status === 404) setError('Assignment not found or no longer available.')
      else if (status === 409) setError(message || 'Conflict: teacher is not available for this slot.')
      else if (status === 400) setError(message || 'Invalid request. Please check the details and try again.')
      else setError('Unable to assign teacher at the moment.')
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Total Assignments</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : summary.totalAssignments}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Assigned</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : summary.assigned}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Unassigned</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : summary.unassigned}</p>
          </article>
        </div>

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
                  {['Slot', 'Grade', 'Subject', 'Absent Teacher', 'Relief Teacher', 'Status', 'Actions'].map((column) => (
                    <th
                      key={column}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {assignments.map((assignment) => {
                  const assignmentId = assignment._id || assignment.id
                  
                  // FIX: Mapping name from the new 'attendance' field
                  const absentName =
                    assignment.originalTeacher?.name ||
                    assignment.attendance?.teacher?.name ||
                    'N/A'

                  // FIX: Safely formatting date from the new 'attendance' field
                  const displayDate = assignment.attendance?.date 
                    ? new Date(assignment.attendance.date).toLocaleDateString() 
                    : ''

                  const reliefName = assignment.reliefTeacher?.name
                  const reliefAvatar =
                    assignment.reliefTeacher?.name
                      ?.split(' ')
                      .filter(Boolean)
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || '—'
                  const availableOptions = availableById[assignmentId] ?? []
                  const isLoadingOptions = availableLoadingId === assignmentId

                  return (
                    <tr key={assignmentId} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {/* UI remains same but using displayDate variable */}
                        <p className="font-semibold">{`${displayDate || assignment.dayOfWeek} · Period ${assignment.period ?? '—'}`}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">{assignment.grade || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{assignment.subject || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{absentName}</td>
                      <td className="px-6 py-4">
                        {assignment.reliefTeacher ? (
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                              {reliefAvatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{reliefName}</p>
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
                          <span className="text-sm text-slate-500">Assigned</span>
                        ) : (
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <select
                              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                              value={selection[assignmentId] ?? ''}
                              onFocus={() => handleLoadAvailable(assignment)}
                              onChange={(event) =>
                                setSelection((prev) => ({ ...prev, [assignmentId]: event.target.value }))
                              }
                              disabled={isLoadingOptions}
                            >
                              <option value="">
                                {isLoadingOptions ? 'Loading options…' : 'Select teacher'}
                              </option>
                              {availableOptions.map((teacher) => (
                                <option key={teacher._id || teacher.id} value={teacher._id || teacher.id}>
                                  {teacher.name}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleAssignTeacher(assignment)}
                              disabled={assigningId === assignmentId || !selection[assignmentId]}
                              className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
                                assigningId === assignmentId || !selection[assignmentId]
                                  ? 'bg-slate-300'
                                  : 'bg-slate-900 hover:bg-black'
                              }`}
                            >
                              {assigningId === assignmentId ? 'Assigning…' : 'Assign'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
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
      </section>
    </>
  )
}

export default AdminReliefAssignment