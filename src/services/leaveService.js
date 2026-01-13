import axios from 'axios'

const getNodeEnv = (key) =>
    typeof globalThis !== 'undefined' && globalThis.process?.env ? globalThis.process.env[key] : undefined

const API_BASE_URL =
    (import.meta.env?.VITE_API_BASE_URL ||
        import.meta.env?.REACT_APP_API_BASE_URL ||
        getNodeEnv('REACT_APP_API_BASE_URL') ||
        'http://localhost:3301') + '/api'



export const fetchAllLeaves = async () => {
        const { data } = await axios.get(`${API_BASE_URL}/leave/all`, { withCredentials: true });
        return data.success ? data.data : []; 
    };

export const fetchLeaveStats = async () => {
        const { data } = await axios.get(`${API_BASE_URL}/leave/stats`, { withCredentials: true });
        return data.success ? data.data : null;
    };

export const updateLeaveStatus = async (id, status) => {
        const { data } = await axios.put(`${API_BASE_URL}/leave/update/${id}`, { status }, { withCredentials: true });
        return data.success;
    };
