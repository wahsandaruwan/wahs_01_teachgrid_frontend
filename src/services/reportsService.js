import axios from "axios";

const getBaseUrl = () => {
  try {
    const envUrl =
      (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
      "http://localhost:3301";
    return envUrl || "http://localhost:3301";
  } catch {
    return "http://localhost:3301";
  }
};

const apiClient = axios.create({
  baseURL: `${getBaseUrl()}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const fetchAttendanceReports = async (date) => {
  try {
    const response = await apiClient.get("/reports/attendance", {
      params: date ? { filterDate: date } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Attendance Fetch Error:", error);
    throw error;
  }
};

export const fetchLeaveReports = async (date) => {
  try {
    const response = await apiClient.get("/reports/leave", {
      params: date ? { filterDate: date } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Leave Fetch Error:", error);
    throw error;
  }
};

export const fetchReliefReports = async (date) => {
  try {
    const response = await apiClient.get("/reports/relief", {
      params: date ? { filterDate: date } : {},
    });

    return response.data?.reliefData || [];
  } catch (error) {
    console.error("Relief Fetch Error:", error);
    return [];
  }
};
export const fetchTeacherPersonalReports = async (date) => {
  try {
    const response = await apiClient.get("/teacher-reports/my-reports", {
      params: date ? { date: date } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Teacher Personal Reports Fetch Error:", error);
    throw error;
  }
};
