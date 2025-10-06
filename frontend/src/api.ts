import axios from 'axios';

// Create a configured instance of axios
const apiClient = axios.create({
  // This is the only line you'll ever need to change to switch
  // between your local and live backend.
  baseURL: 'http://localhost:5000', // <-- LOCAL BACKEND URL
});

// This "interceptor" automatically adds the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or wherever you store it after login)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;