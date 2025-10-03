import axios from 'axios';

// Create a configured instance of axios
const apiClient = axios.create({
  // This is the only line you'll ever need to change to switch
  // between your local and live backend.
  baseURL: 'https://backend-deployment-u389.onrender.com/', // <-- YOUR LIVE RENDER URL
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