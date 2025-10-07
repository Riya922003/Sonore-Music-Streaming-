import axios from 'axios';

// Create a configured instance of axios
const apiClient = axios.create({
  // This is the only line you'll ever need to change to switch
  // between your local and live backend.
  baseURL: 'https://backend-deployment-u389.onrender.com/api', // <-- LOCAL BACKEND URL
});

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