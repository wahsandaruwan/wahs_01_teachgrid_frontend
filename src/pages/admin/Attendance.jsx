import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import {
  Search,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

const getNodeEnv = (key) =>
  typeof globalThis !== 'undefined' && globalThis.process?.env ? globalThis.process.env[key] : undefined

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.REACT_APP_API_BASE_URL ||
  getNodeEnv('REACT_APP_API_BASE_URL') ||
  'http://localhost:3301'

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
  const [teachers, setTeachers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editData, setEditData] = useState({
    teacherId: '',
    subject: '',
    status: '',
    checkIn: '',
    checkOut: ''
  })

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const lastInitializedDate = useRef(null)
  const initializingRef = useRef(false)
  const teachersLoadedRef = useRef(false)
  const teachersLoadingRef = useRef(false)

  // Check if selected date is today (allows editing) or past (read-only)
  const isToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return selectedDate === today
  }

  // Check if selected date is in the future (should not allow)
  const isFutureDate = () => {
    const today = new Date().toISOString().split('T')[0]
    return selectedDate > today
  }

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      // Try the attendance teachers endpoint first (as per requirements)
      const response = await axios.get(`${API_BASE_URL}/api/attendance/teachers`, {
        withCredentials: true
      })
      const teachersList = response.data?.data || response.data || []
      return teachersList
    } catch (err) {
      // Fallback to regular teachers endpoint
      try {
        const response = await axios.get(`${API_BASE_URL}/api/teachers`, {
          withCredentials: true
        })
        const teachersList = response.data?.data || response.data || []
        return teachersList
      } catch (fallbackErr) {
        console.error('Error fetching teachers:', fallbackErr)
        // Don't log errors repeatedly - just return empty array
        return []
      }
    }
  }

  // Map backend data to frontend format (convert _id to id)
  // Backend uses: teacher (ObjectId), teacherName (string), date, status, checkIn, checkOut, subject
  const mapBackendToFrontend = (backendData) => {
    if (!Array.isArray(backendData)) return []
    return backendData.map(item => ({
      id: item._id || item.id,
      _id: item._id,
      userId: item.teacher || item.userId || item.user?._id || item.teacher?._id,
      date: item.date,
      subject: item.subject || '',
      absentTeacher: item.teacherName || item.absentTeacher || item.teacher?.name || item.user?.name || '',
      status: item.status || '',
      checkIn: item.checkIn || '',
      checkOut: item.checkOut || ''
    }))
  }

  // Merge teachers with attendance records
  const mergeTeachersWithAttendance = (teachersList, attendanceRecords, targetDate) => {
    const attendanceMap = new Map()
    // Filter records by date to ensure we only match records for the selected date
    attendanceRecords.forEach(record => {
      // Ensure record matches the target date
      const recordDate = record.date ? record.date.split('T')[0] : record.date
      if (recordDate === targetDate) {
        // Backend uses 'teacher' field (ObjectId), map it to userId for matching
        const teacherId = record.teacher || record.userId
        if (teacherId) {
          attendanceMap.set(teacherId.toString(), record)
        }
      }
    })

    return teachersList.map(teacher => {
      const teacherIdStr = teacher._id?.toString() || teacher._id
      const attendance = attendanceMap.get(teacherIdStr)
      const profileSubject = (teacher.subjects && teacher.subjects.length > 0) 
                                ? teacher.subjects[0] 
                                : '';
      if (attendance) {
        return {
          ...attendance,
          teacherId: teacher._id,
          userId: teacher._id,
          subject: profileSubject || attendance.subject || '',
          date: targetDate, // Ensure date matches selected date
          absentTeacher: attendance.teacherName || teacher.name || teacher.email || 'Unknown Teacher'
        }
      } else {
        // Create a placeholder record for teachers without attendance
        return {
          id: null,
          _id: null,
          userId: teacher._id,
          teacherId: teacher._id,
          date: targetDate,
          subject: profileSubject,  
          absentTeacher: teacher.name || teacher.email || 'Unknown Teacher',
          status: '',
          checkIn: '',
          checkOut: ''
        }
      }
    })
  }

  // Fetch attendance records for a date
  const fetchAttendanceRecords = async (date, searchQuery = '', suppressError = false) => {
    try {
      setLoading(true)
      if (!suppressError) {
        setError(null)
      }
      
      const params = new URLSearchParams({ date })
      if (searchQuery) {
        params.append('q', searchQuery)
      }

      const response = await axios.get(`${API_BASE_URL}/api/attendance?${params.toString()}`, {
        withCredentials: true
      })

      // Backend returns array directly (not wrapped in data object)
      const records = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      // Filter records to ensure they match the requested date (backend should do this, but double-check)
      const filteredRecords = records.filter(r => {
        if (!r.date) return false
        const recordDate = typeof r.date === 'string' ? r.date.split('T')[0] : r.date
        return recordDate === date
      })
      return mapBackendToFrontend(filteredRecords)
    } catch (err) {
      console.error('Error fetching attendance records:', err)
      // Don't show duplicate key errors to user - they're handled gracefully
      const errorMessage = err.response?.data?.message || err.message || ''
      if (!errorMessage.includes('E11000') && !errorMessage.includes('duplicate key')) {
        if (!suppressError) {
          setError(err.response?.data?.message || 'Failed to fetch attendance records')
        }
      }
      return []
    } finally {
      setLoading(false)
    }
  }

  // Initialize attendance for a date
  const initializeAttendance = async (date) => {
    // Prevent multiple simultaneous initialization calls
    if (initializingRef.current) {
      return false
    }

    try {
      initializingRef.current = true
      await axios.post(
        `${API_BASE_URL}/api/attendance/init`,
        { date },
        { withCredentials: true }
      )
      return true
    } catch (err) {
      // Handle various error cases gracefully
      const errorMessage = err.response?.data?.message || err.message || ''
      const status = err.response?.status
      
      // If it's a duplicate key error or 500, records might already exist
      // Don't show error to user - just return false and let caller check if records exist
      if (errorMessage.includes('E11000') || 
          errorMessage.includes('duplicate key') ||
          status === 500) {
        // Silently handle - records may already exist, caller will check
        return false // Return false, but caller should check if records exist anyway
      }
      
      // For other errors, log but don't block
      console.warn('Initialization warning:', errorMessage)
      return false
    } finally {
      initializingRef.current = false
    }
  }

  // Fetch teachers on component mount (only once)
  useEffect(() => {
    if (teachersLoadedRef.current || teachersLoadingRef.current) {
      return
    }

    const loadTeachers = async () => {
      teachersLoadingRef.current = true
      try {
        const teachersList = await fetchTeachers()
        if (teachersList.length > 0) {
          setTeachers(teachersList)
          teachersLoadedRef.current = true
        }
      } catch (err) {
        console.error('Failed to load teachers:', err)
      } finally {
        teachersLoadingRef.current = false
      }
    }
    loadTeachers()
  }, [])

  // Load attendance data when date or search changes
  useEffect(() => {
    let isMounted = true
    const dateChanged = lastInitializedDate.current !== selectedDate

    const loadAttendance = async () => {
      if (teachers.length === 0) return; // Don't proceed if teachers aren't loaded yet
      const teachersList = teachers;

      // Clear assignments when date changes to prevent showing wrong date's data
      if (dateChanged && isMounted) {
        setAssignments([])
      }

      // Fetch records for the selected date (without search first to check if initialization is needed)
      const records = await fetchAttendanceRecords(selectedDate, search)
      
      if (!isMounted) return

      // If no records found, no search query, and date changed, try to initialize attendance for that date
      // But don't block the UI if initialization fails
      if (records.length === 0 && !search && dateChanged && !initializingRef.current && teachersList.length > 0) {
        // Try initialization (may fail with 500, but records might already exist)
        initializeAttendance(selectedDate).then(initialized => {
          // Always re-fetch after init attempt (records might exist even if init failed)
          return fetchAttendanceRecords(selectedDate, search, true)
        }).then(newRecords => {
          if (isMounted) {
            lastInitializedDate.current = selectedDate
            const merged = mergeTeachersWithAttendance(teachersList, newRecords, selectedDate)
            setAssignments(merged)
            setError(null)
          }
        }).catch(() => {
          // If both init and fetch fail, still show teachers (they can mark manually)
          if (isMounted) {
            const merged = mergeTeachersWithAttendance(teachersList, [], selectedDate)
            setAssignments(merged)
          }
        })
        
        // Show teachers immediately (don't wait for init)
        if (isMounted) {
          const merged = mergeTeachersWithAttendance(teachersList, [], selectedDate)
          setAssignments(merged)
        }
      } else if (isMounted) {
        // Update the ref if we got records (date was already initialized)
        if (records.length > 0 && dateChanged) {
          lastInitializedDate.current = selectedDate
        }
        // Merge teachers with attendance records - ensure date filtering
        const merged = mergeTeachersWithAttendance(teachersList, records, selectedDate)
        setAssignments(merged)
      }
    }

    // Only load if teachers are available
    if (teachers.length > 0 || teachersLoadedRef.current) {
      loadAttendance()
    }

    return () => {
      isMounted = false
    }
  }, [selectedDate, search, teachers]) // Removed teachers from dependencies to prevent infinite loop

  const handleEdit = (row) => {
    // Prevent editing past dates
    if (!isToday() || isFutureDate()) {
      setError('You can only mark or edit attendance for today\'s date.')
      return
    }

    // Use teacherId as the primary identifier for editing
    const teacherId = row.teacherId || row.userId
    setEditingId(teacherId)
    setEditData({
      teacherId: teacherId,
      subject: row.subject || '',
      status: row.status || '',
      checkIn: row.checkIn || '',
      checkOut: row.checkOut || ''
    })
  }

  const handleSave = async (teacherId) => {
    // Prevent saving for past or future dates
    if (!isToday() || isFutureDate()) {
      setError('You can only mark or edit attendance for today\'s date.')
      return
    }

    // Validate required fields
    if (!editData.status || editData.status === 'unmarked' || editData.status.trim() === '') {
      setError('Please select a valid status (Present, Late, or Leave) before saving.');
      return;
    }

    try {
      setLoading(true)
      setError(null)

      // Backend expects: status, checkIn, checkOut, subject (no userId or date in update)
      const updateData = {
        status: editData.status,
        checkIn: editData.checkIn || '',
        checkOut: editData.checkOut || '',
        subject: editData.subject || ''
      }

      // Find the existing record to determine if we should create or update
      const existingRecord = assignments.find(a => 
        (a.teacherId === teacherId || a.userId === teacherId) && a.id
      )

      if (existingRecord && existingRecord.id) {
        // Update existing record using PUT /api/attendance/:id
        await axios.put(
          `${API_BASE_URL}/api/attendance/${existingRecord.id}`,
          updateData,
          { withCredentials: true }
        )
      } else {
        // No existing record - need to initialize attendance first to create records
        // The init endpoint creates records for all teachers, then we update the specific one
        try {
          // Try to initialize (may fail with 500 if records already exist)
          const initialized = await initializeAttendance(selectedDate)
          
          // Always fetch records after init attempt (they might already exist even if init failed)
          const newRecords = await fetchAttendanceRecords(selectedDate, '', true)
          const teacherRecord = newRecords.find(r => {
            const recordTeacherId = r.userId?.toString() || r.teacherId?.toString()
            return recordTeacherId === teacherId?.toString()
          })
          
          if (teacherRecord && teacherRecord.id) {
            // Record exists (either newly created or was already there), update it
            await axios.put(
              `${API_BASE_URL}/api/attendance/${teacherRecord.id}`,
              updateData,
              { withCredentials: true }
            )
          } else {
            // No record found even after init attempt
            // The init endpoint might be failing - show helpful error
            throw new Error('Unable to create attendance record. The attendance initialization endpoint is returning an error. Please contact the administrator or try again later.')
          }
        } catch (initErr) {
          console.error('Error creating attendance record:', initErr)
          throw new Error(initErr.response?.data?.message || initErr.message || 'Failed to create attendance record. Please try again.')
        }
      }

      // Re-fetch attendance records to get updated data from backend
      // Use empty search to get all records for the date
      // Add a small delay to ensure backend has processed the update
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const updatedRecords = await fetchAttendanceRecords(selectedDate, '', true)
      const merged = mergeTeachersWithAttendance(teachers, updatedRecords, selectedDate)
      
      // Force state update by creating new array reference
      setAssignments([...merged])

      setEditingId(null)
      
      // Clear any errors on success
      setError(null)
    } catch (err) {
      console.error('Error saving attendance record:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save attendance record')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format) => {
    const params = new URLSearchParams({ date: selectedDate })
    const url = `${API_BASE_URL}/api/attendance/export/${format}?${params.toString()}`
    window.open(url, '_blank')
  }

  const statusBadge = (status) => {
    const base = 'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold'
    
    // Handle unmarked state
    if (!status || status === 'unmarked') {
      return <span className={`${base} bg-slate-100 text-slate-500`}><Clock size={12}/>Not Marked</span>
    }
    
    if (status === 'present')
      return <span className={`${base} bg-green-100 text-green-700`}><CheckCircle size={12}/>Present</span>
    if (status === 'late')
      return <span className={`${base} bg-yellow-100 text-yellow-700`}><Clock size={12}/>Late</span>
    
    return <span className={`${base} bg-red-100 text-red-700`}><XCircle size={12}/>Leave</span>
  }

  // Calculate stats from assignments
  const calculateStats = () => {
    const total = assignments.length
    const present = assignments.filter(a => a.status === 'present').length
    const late = assignments.filter(a => a.status === 'late').length
    const leave = assignments.filter(a => a.status === 'leave').length
    
    // Calculate only based on teachers actually marked
    const totalMarked = assignments.filter(a => a.status && a.status !== 'unmarked').length
    const overallRate = totalMarked > 0 ? Math.round((present / totalMarked) * 100) : 0

    return {
      overallRate: `${overallRate}%`,
      presentToday: present,
      total: total,
      onLeave: leave,
      lateArrivals: late
    }
  }

  const stats = calculateStats()
  
  // Filter assignments by search query
  const filtered = assignments.filter(a =>
    a.absentTeacher?.toLowerCase().includes(search.toLowerCase())
  )

  // Separate marked and unmarked teachers
  // Marked: has an ID (record exists) AND has a status
  // Unmarked: no ID (no record) OR no status
  const markedTeachers = filtered.filter(a => 
    a.id && a.status && a.status !== 'unmarked' && a.status.trim() !== ''
  )
  const unmarkedTeachers = filtered.filter(a => 
    !a.id || !a.status || a.status === 'unmarked' || a.status.trim() === ''
  )

  return (
    <>
      <Header title="Attendance Records" />

      <section className="min-h-screen bg-[#F7F8FC] p-6 space-y-6">

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Overall Rate" value={stats.overallRate} subtitle="School average" icon={<CheckCircle className="text-green-500" />} />
          <StatCard title="Present Today" value={stats.presentToday.toString()} subtitle={`Out of ${stats.total}`} icon={<CheckCircle className="text-green-500" />} />
          <StatCard title="On Leave" value={stats.onLeave.toString()} subtitle="Approved" icon={<XCircle className="text-red-500" />} />
          <StatCard title="Late Arrivals" value={stats.lateArrivals.toString()} subtitle="After 7:30 AM" icon={<Clock className="text-yellow-500" />} />
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
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setEditingId(null) // Clear any active editing when date changes
                    setError(null) // Clear errors
                  }}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  className="outline-none bg-transparent"
                />
              </div>
              {!isToday() && (
                <div className="flex items-center px-3 py-2 text-xs text-orange-600 bg-orange-50 rounded-lg">
                  {isFutureDate() ? 'Future dates cannot be selected' : 'View-only mode (past date)'}
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-2 rounded-lg bg-black text-white px-3 py-2 text-sm hover:bg-gray-800"
                  disabled={loading}
                >
                  <Download size={16}/>Export CSV
                </button>
                <button 
                  onClick={() => handleExport('pdf')}
                  className="flex items-center gap-2 rounded-lg bg-gray-700 text-white px-3 py-2 text-sm hover:bg-gray-600"
                  disabled={loading}
                >
                  <Download size={16}/>Export PDF
                </button>
              </div>
            </div>
            </div>
          

          {/* Summary Info */}
          <div className="flex gap-4 mb-4 text-sm text-slate-600">
            <span>Total: <strong>{filtered.length}</strong></span>
            <span>Marked: <strong className="text-green-600">{markedTeachers.length}</strong></span>
            <span>Pending: <strong className="text-orange-600">{unmarkedTeachers.length}</strong></span>
          </div>

          {/* Marked Teachers Section */}
          {markedTeachers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle size={16} /> Marked Attendance ({markedTeachers.length})
              </h3>
              <table className="w-full border-collapse">
                <thead className="text-xs text-slate-500 border-b bg-green-50">
                  <tr>
                    <th className="py-3 text-left align-middle">Teacher</th>
                    <th className="align-middle text-center">Date</th>
                    <th className="align-middle text-center">Status</th>
                    <th className="align-middle text-center w-28">Check In</th>
                    <th className="align-middle text-center w-28">Check Out</th>
                    <th className="align-middle text-center w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {markedTeachers.map(row => {
                    const teacherId = row.teacherId || row.userId
                    const isEditing = editingId === teacherId
                    return (
                      <tr key={teacherId || row.id} className="hover:bg-slate-50">

                    <td className="py-3 font-medium align-middle">
                      {row.absentTeacher}</td>

                    <td className='align-middle text-center'>
                      {row.date}</td>

                    <td className='align-middle text-center'>
                      {isEditing ? (
                        <select
                          className="border rounded p-1 w-full cursor-pointer"
                          value={editData.status}
                          onChange={e => setEditData({ ...editData, status: e.target.value })}
                          disabled={loading}
                        >
                          <option value="">Select Status</option>
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      ) : row.status ? statusBadge(row.status) : '-'}
                    </td>

                    <td className='align-middle text-center w-28'>
                      {isEditing ? (
                        <input 
                          type="time" 
                          className="border rounded p-1 w-full cursor-pointer"
                          value={editData.checkIn}
                          onChange={e => setEditData({ ...editData, checkIn: e.target.value })}
                          disabled={loading}
                        />
                      ) : row.checkIn || '-'}
                    </td>

                    <td className='align-middle text-center w-28'>
                      {isEditing ? (
                        <input 
                          type="time" 
                          className="border rounded p-1 w-full cursor-pointer"
                          value={editData.checkOut}
                          onChange={e => setEditData({ ...editData, checkOut: e.target.value })}
                          disabled={loading}
                        />
                      ) : row.checkOut || '-'}
                    </td>

                    <td className="align-middle text-center w-24 space-x-2">
                      {isEditing ? (
                        <>
                          <button 
                            onClick={() => handleSave(teacherId)} 
                            className="text-green-600 hover:underline"
                            disabled={loading}
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)} 
                            className="text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleEdit(row)} 
                          className="text-blue-600 hover:underline"
                          disabled={!isToday() || isFutureDate()}
                          title={!isToday() ? 'Can only edit attendance for today' : isFutureDate() ? 'Cannot edit attendance for future dates' : 'Edit attendance'}
                        >
                          {!isToday() ? 'View' : 'Edit'}
                        </button>
                      )}
                    </td>
                  </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Unmarked Teachers Section */}
          {unmarkedTeachers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <Clock size={16} /> Pending Attendance ({unmarkedTeachers.length})
              </h3>
              <table className="w-full border-collapse">
                <thead className="text-xs text-slate-500 border-b bg-orange-50">
                  <tr>
                    <th className="py-3 text-left align-middle">Teacher</th>
                    <th className="align-middle text-center">Date</th>
                    <th className="align-middle text-center">Status</th>
                    <th className="align-middle text-center w-28">Check In</th>
                    <th className="align-middle text-center w-28">Check Out</th>
                    <th className="align-middle text-center w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {unmarkedTeachers.map(row => {
                    const teacherId = row.teacherId || row.userId
                    const isEditing = editingId === teacherId
                    return (
                      <tr key={teacherId || row.id} className="hover:bg-slate-50">
                        <td className="py-3 font-medium align-middle">
                          {row.absentTeacher}</td>
                        <td className='align-middle text-center'>
                          {row.date}</td>
                        <td className='align-middle text-center'>
                          {isEditing ? (
                            <select
                              className="border rounded p-1 w-full cursor-pointer"
                              value={editData.status}
                              onChange={e => setEditData({ ...editData, status: e.target.value })}
                              disabled={loading}
                            >
                              <option value="">Select Status</option>
                              {STATUS_OPTIONS.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          ) : statusBadge(row.status)}
                        </td>
                        <td className='align-middle text-center w-28'>
                          {isEditing ? (
                            <input 
                              type="time" 
                              className="border rounded p-1 w-full cursor-pointer"
                              value={editData.checkIn}
                              onChange={e => setEditData({ ...editData, checkIn: e.target.value })}
                              disabled={loading}
                            />
                          ) : row.checkIn || '-'}
                        </td>
                        <td className='align-middle text-center w-28'>
                          {isEditing ? (
                            <input 
                              type="time" 
                              className="border rounded p-1 w-full cursor-pointer"
                              value={editData.checkOut}
                              onChange={e => setEditData({ ...editData, checkOut: e.target.value })}
                              disabled={loading}
                            />
                          ) : row.checkOut || '-'}
                        </td>
                        <td className="align-middle text-center w-24 space-x-2">
                          {isEditing ? (
                            <>
                              <button 
                                onClick={() => handleSave(teacherId)} 
                                className="text-green-600 hover:underline"
                                disabled={loading}
                              >
                                Save
                              </button>
                              <button 
                                onClick={() => setEditingId(null)} 
                                className="text-red-600 hover:underline"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleEdit(row)} 
                              className="text-blue-600 hover:underline"
                              disabled={!isToday() || isFutureDate()}
                              title={!isToday() ? 'Can only mark attendance for today' : isFutureDate() ? 'Cannot mark attendance for future dates' : 'Mark attendance'}
                            >
                              {!isToday() ? 'View' : 'Mark'}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Loading/Empty States */}
          {loading && filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-500">
              Loading attendance records...
            </div>
          )}
          {!loading && filtered.length === 0 && teachers.length > 0 && (
            <div className="py-6 text-center text-sm text-slate-500">
              No attendance records found for this date.
            </div>
          )}
          {!loading && teachers.length === 0 && (
            <div className="py-6 text-center text-sm text-red-500">
              No teachers available. Please check your backend connection.
            </div>
          )}

        </div>
      </section>
    </>
  )
}

export default Attendance
