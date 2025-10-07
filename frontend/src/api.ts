import axios from 'axios';

// Backend URL Configuration
// OPTION 1: Auto-detect based on hostname
const isDevelopment = window.location.hostname === 'localhost';
const BACKEND_BASE_URL = isDevelopment 
  ? 'http://localhost:5000'  // Local development
  : 'https://backend-deployment-u389.onrender.com';  // Production

// OPTION 2: Manual override (uncomment to force a specific environment)
// const BACKEND_BASE_URL = 'http://localhost:5000';  // Force local
// const BACKEND_BASE_URL = 'https://backend-deployment-u389.onrender.com';  // Force production

const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
});

console.log(`🌐 Backend URL configured: ${BACKEND_BASE_URL}`);

// This "interceptor" automatically adds the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔍 Making API request to: ${config.baseURL}${config.url}`);
    // Get the token from localStorage (or wherever you store it after login)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token;
      console.log('🔑 Auth token found and added to request');
    } else {
      console.log('⚠️ No auth token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API response received from: ${response.config.url}`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ API request failed:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;