import axios from 'axios'

const getNodeEnv = (key) =>
  typeof globalThis !== 'undefined' && globalThis.process?.env ? globalThis.process.env[key] : undefined

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.REACT_APP_API_BASE_URL ||
  getNodeEnv('REACT_APP_API_BASE_URL') ||
  ''

const sampleAssignments = [
  {
    id: 'assign-1',
    date: '2024-01-20',
    time: '09:00 AM - 10:00 AM',
    room: 'Room 205',
    subject: 'Mathematics',
    className: 'Grade 8A',
    absentTeacher: 'Ms. Anderson',
    reliefTeacher: { id: 't1', name: 'John Smith', avatar: 'JS' },
    status: 'assigned'
  },
  {
    id: 'assign-2',
    date: '2024-01-20',
    time: '10:00 AM - 11:00 AM',
    room: 'Lab 2',
    subject: 'Physics',
    className: 'Grade 11A',
    absentTeacher: 'Dr. Brown',
    reliefTeacher: null,
    status: 'unassigned'
  },
  {
    id: 'assign-3',
    date: '2024-01-21',
    time: '02:00 PM - 03:00 PM',
    room: 'Room 103',
    subject: 'History',
    className: 'Grade 10B',
    absentTeacher: 'Mr. Davis',
    reliefTeacher: { id: 't2', name: 'Emily Wilson', avatar: 'EW' },
    status: 'assigned'
  }
]

const sampleTeachers = [
  { id: 't1', name: 'John Smith', subject: 'Mathematics', avatar: 'JS', status: 'available' },
  { id: 't2', name: 'Emily Wilson', subject: 'History', avatar: 'EW', status: 'busy' },
  { id: 't3', name: 'Michael Brown', subject: 'Physics', avatar: 'MB', status: 'available' },
  { id: 't4', name: 'Sophia Turner', subject: 'Chemistry', avatar: 'ST', status: 'available' }
]

const sampleSummary = {
  totalAssignments: sampleAssignments.length,
  assigned: sampleAssignments.filter((item) => item.status === 'assigned').length,
  unassigned: sampleAssignments.filter((item) => item.status !== 'assigned').length,
  availableTeachers: sampleTeachers.filter((teacher) => teacher.status === 'available').length
}

const withApiPlaceholder = async (requestFn, fallback) => {
  if (!API_BASE_URL) {
    return fallback
  }

  try {
    /*
      // --- REAL API ENDPOINT (activate once backend is ready) ---
      const { data } = await requestFn()
      return data
    */
    return fallback
  } catch (error) {
    console.warn('Relief assignment API unavailable. Using sample data.', error)
    return fallback
  }
}

export const fetchReliefAssignments = async () =>
  withApiPlaceholder(
    () =>
      axios.get(`${API_BASE_URL}/relief-assignment/all`, {
        withCredentials: true
      }),
    sampleAssignments
  )

export const fetchReliefAssignmentSummary = async () =>
  withApiPlaceholder(
    () =>
      axios.get(`${API_BASE_URL}/relief-assignment/summary`, {
        withCredentials: true
      }),
    sampleSummary
  )

export const fetchAvailableReliefTeachers = async () =>
  withApiPlaceholder(
    () =>
      axios.get(`${API_BASE_URL}/relief-assignment/teachers`, {
        withCredentials: true
      }),
    sampleTeachers
  )

export const assignReliefTeacher = async ({ assignmentId, teacherId }) =>
  withApiPlaceholder(
    () =>
      axios.post(
        `${API_BASE_URL}/relief-assignment/${assignmentId}/assign`,
        { teacherId },
        { withCredentials: true }
      ),
    { success: true }
  )


