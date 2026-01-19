import { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header'
import { assignReliefTeacher, fetchAvailableReliefTeachers, fetchReliefAssignments } from '../../services/reliefAssignmentService'

const AdminReliefAssignment = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigningId, setAssigningId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [selection, setSelection] = useState({})
  const [availableById, setAvailableById] = useState({})
  const [availableLoadingId, setAvailableLoadingId] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // State for Date Filtering (Defaults to Today)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

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

  // Filtered Assignments based on the selected date
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      if (!item.attendance?.date) return false;
      const itemDate = new Date(item.attendance.date).toISOString().split('T')[0];
      return itemDate === selectedDate;
    });
  }, [assignments, selectedDate]);

  // Summary now calculates stats ONLY for the filtered/selected day
  const summary = useMemo(() => {
    const totalAssignments = filteredAssignments.length
    const assigned = filteredAssignments.filter((item) => item.status === 'assigned').length
    const unassigned = totalAssignments - assigned
    return { totalAssignments, assigned, unassigned }
  }, [filteredAssignments])

  const handleLoadAvailable = async (assignment) => {
    const assignmentId = assignment._id || assignment.id;
    if (!assignmentId || availableById[assignmentId]) return;

    try {
      setAvailableLoadingId(assignmentId);
      const absentTeacherId = assignment.attendance?.teacher?._id || assignment.attendance?.teacher;

      const options = await fetchAvailableReliefTeachers({
        dayOfWeek: assignment.dayOfWeek,
        period: assignment.period,
        grade: assignment.grade,
        date: assignment.attendance?.date,
        excludeTeacherId: absentTeacherId
      });
      setAvailableById((prev) => ({ ...prev, [assignmentId]: options ?? [] }));
    } catch (availError) {
      console.error(availError);
      setError('Unable to load available teachers.');
    } finally {
      setAvailableLoadingId(null);
    }
  };

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

      // 1. Call API
      const response = await assignReliefTeacher({ assignmentId, teacherId })
      
      // 2. Extract the updated assignment and the selected teacher details
      const selectedTeacherObj = availableById[assignmentId]?.find(t => (t._id || t.id) === teacherId);

      // 3. Update Local State
      setAssignments((prev) =>
        prev.map((item) => {
          const itemId = item._id || item.id
          if (itemId !== assignmentId) return item
          
          return {
            ...item,
            reliefTeacher: selectedTeacherObj || item.reliefTeacher,
            status: 'assigned'
          }
        })
      )

      // 4. Reset UI States & Show Success Toast
      setSelection((prev) => ({ ...prev, [assignmentId]: '' }))
      setEditingId(null) 
      setSuccessMessage('Relief teacher assigned successfully!')
      setTimeout(() => setSuccessMessage(''), 4000)

    } catch (assignError) {
      console.error(assignError)
      const message = assignError?.response?.data?.message
      setError(message || 'Unable to assign teacher at the moment.')
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
        
        {/* Date Selection Bar */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
            <div>
                <label className="text-sm font-medium text-slate-600 block mb-1">Select View Date</label>
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Viewing Assignments For</p>
                <p className="text-lg font-bold text-indigo-600">
                    {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500 text-white shadow-md">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">{successMessage}</p>
                <p className="mt-1 text-xs text-green-600">Assignment updated successfully.</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="ml-auto h-6 w-6 rounded-full bg-green-100 text-green-500 hover:bg-green-200 transition-colors flex items-center justify-center"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Daily Total</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : summary.totalAssignments}</p>
          </article>
          <article className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Daily Assigned</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : summary.assigned}</p>
          </article>
          <article className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Daily Pending</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? '—' : summary.unassigned}</p>
          </article>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Manage Relief Assignments</h2>
                <p className="text-sm text-slate-500">Assign relief teachers for {new Date(selectedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-sky-100">
                <tr>
                  {['Slot', 'Grade', 'Subject', 'Absent Teacher', 'Relief Teacher', 'Status', 'Actions'].map((column) => (
                    <th key={column} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredAssignments.map((assignment) => {
                  const assignmentId = assignment._id || assignment.id
                  const absentName = assignment.originalTeacher?.name || assignment.attendance?.teacher?.name || 'N/A'
                  const reliefName = assignment.reliefTeacher?.name
                  const reliefAvatar = assignment.reliefTeacher?.name?.split(' ').filter(Boolean).map((p) => p[0]).join('').slice(0, 2).toUpperCase() || '—'
                  
                  const availableOptions = availableById[assignmentId] ?? []
                  const isLoadingOptions = availableLoadingId === assignmentId
                  const isEditing = editingId === assignmentId;

                  return (
                    <tr key={assignmentId} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <p className="font-semibold">{`Period ${assignment.period ?? '—'}`}</p>
                        <p className="text-xs text-slate-500">{assignment.dayOfWeek}</p>
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
                          <span className="text-sm text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{renderStatusBadge(assignment.status)}</td>
                      
                      <td className="px-6 py-4">
                        {assignment.status === 'assigned' && !isEditing ? (
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setEditingId(assignmentId)}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-tight"
                            >
                              Change Teacher
                            </button>
                          </div>
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
                                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100'
                              }`}
                            >
                              {assigningId === assignmentId ? 'Saving…' : 'Confirm'}
                            </button>
                            {isEditing && (
                              <button 
                                onClick={() => setEditingId(null)}
                                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {!filteredAssignments.length && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                      {loading ? 'Refreshing data…' : `No relief duties found for this date.`}
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