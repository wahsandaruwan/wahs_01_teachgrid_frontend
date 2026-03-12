import axios from 'axios'

axios.defaults.withCredentials = true;

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

export const fetchAvailableReliefTeachers = async ({ dayOfWeek, period, grade, date, excludeTeacherId }) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/relief-assignments/available`, {
    params: { dayOfWeek, period, grade, date, excludeTeacherId } 
  });
  return data.data;
};

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

export const fetchMyReliefDuties = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/relief-assignments/my-duties`, {
    withCredentials: true 
  });
  return response.data.data;
};

export const updateDutyStatus = async (id, status) => {
  const response = await axios.patch(`${API_BASE_URL}/api/relief-assignments/${id}/status`, 
    { status },
    { withCredentials: true }
  );
  return response.data.data;
};

