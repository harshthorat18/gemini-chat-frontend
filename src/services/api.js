import axios from 'axios';

const api = axios.create({
  // Make sure this includes /api
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://gemini-chat-backend-ws3p.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent hanging requests
  timeout: 10000 
});

api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url); // Add logging
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error); // Add error logging
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
