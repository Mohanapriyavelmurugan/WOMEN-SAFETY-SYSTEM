import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User related API calls
export const userApi = {
  register: async (userData: any) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
};

// Incident related API calls
export const incidentApi = {
  report: async (incidentData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    try {
      const response = await api.post('/incidents/report', incidentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },
  getCase: async (caseId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }
    try {
      const response = await api.get(`/cases/${caseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Police/Admin related API calls
export const policeApi = {
  login: async (credentials: any) => {
    const response = await api.post('/police/login', credentials);
    return response.data;
  },
};

export default api; 