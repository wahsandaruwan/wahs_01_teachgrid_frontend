import axios from 'axios'

const getNodeEnv = (key) =>
  typeof globalThis !== 'undefined' && globalThis.process?.env ? globalThis.process.env[key] : undefined

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.REACT_APP_API_BASE_URL ||
  getNodeEnv('REACT_APP_API_BASE_URL') ||
  '/api'

const unwrap = (data) => data?.data ?? data?.reliefAssignments ?? data ?? []

export const fetchReliefAssignments = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/relief-assignments`, {
    withCredentials: true
  })
  return unwrap(data)
}

export const fetchAvailableReliefTeachers = async ({ dayOfWeek, period, grade }) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/relief-assignments/available`, {
    withCredentials: true,
    params: { dayOfWeek, period, grade }
  })
  return unwrap(data)
}

export const assignReliefTeacher = async ({ assignmentId, teacherId }) => {
  const { data } = await axios.post(
    `${API_BASE_URL}/api/relief-assignments/${assignmentId}/assign`,
    { teacherId },
    { withCredentials: true }
  )
  return data
}

export const generateReliefAssignmentsForAbsence = async (absenceId) => {
  const { data } = await axios.post(
    `${API_BASE_URL}/api/relief-assignments/${absenceId}/create`,
    {},
    { withCredentials: true }
  )
  return data
}


