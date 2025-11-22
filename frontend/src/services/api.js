import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

// Log API configuration on initialization (helpful for debugging)
if (__DEV__) {
  console.log("🔌 API Configuration:", {
    baseURL: API_BASE_URL,
    envVar: process.env.EXPO_PUBLIC_API_URL || "not set (using default)",
  });
}

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return data directly for successful responses (including 201)
    return response.data;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Clear auth and redirect to login
      if (status === 401) {
        const { logout } = useAuthStore.getState();
        logout();
      }

      // Extract error message from response
      const errorMessage =
        data?.message || data?.error || error.message || "An error occurred";

      // Create a more descriptive error
      const apiError = new Error(errorMessage);
      apiError.status = status;
      apiError.data = data;

      console.error("API Error:", {
        status,
        message: errorMessage,
        endpoint: error.config?.url,
        data,
      });

      return Promise.reject(apiError);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error Details:", {
        message: error.message,
        code: error.code,
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        fullUrl: `${error.config?.baseURL}${error.config?.url}`,
        timeout: error.config?.timeout,
        request: error.request
          ? {
              readyState: error.request.readyState,
              status: error.request.status,
              responseText: error.request.responseText?.substring(0, 200),
            }
          : null,
      });

      // Provide more helpful error message
      let errorMessage = "Network error. Please check your connection.";
      const responseText = error.request?.responseText || "";
      const isLocalhostIssue =
        (error.config?.baseURL?.includes("localhost") ||
          error.config?.baseURL?.includes("127.0.0.1")) &&
        (responseText.includes("Failed to connect") ||
          error.code === "ERR_NETWORK");

      if (isLocalhostIssue) {
        errorMessage = `Cannot connect to ${error.config?.baseURL}. If you're running on a physical device or emulator, you need to use your computer's IP address instead of "localhost". Create a .env file with: EXPO_PUBLIC_API_URL=http://YOUR_IP:8000`;
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = `Cannot connect to server at ${error.config?.baseURL}. Make sure the backend is running and the URL is correct.`;
      } else if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") {
        errorMessage = `Cannot resolve host. Check your API URL: ${error.config?.baseURL}`;
      } else if (
        error.code === "ETIMEDOUT" ||
        error.message?.includes("timeout")
      ) {
        errorMessage =
          "Request timed out. The server took too long to respond. This might be a backend performance issue.";
      } else if (error.message?.includes("Network Error") || !error.response) {
        errorMessage = `No response received from server. The request may have taken too long (${error.config?.timeout}ms timeout). Check backend logs for slow queries.`;
      }

      return Promise.reject(new Error(errorMessage));
    } else {
      // Something else happened
      console.error("Request Error:", error.message);
      return Promise.reject(error);
    }
  }
);

// API methods
export const api = {
  get: async (endpoint, config = {}) => {
    return axiosInstance.get(endpoint, config);
  },

  post: async (endpoint, data = {}, config = {}) => {
    return axiosInstance.post(endpoint, data, config);
  },

  put: async (endpoint, data = {}, config = {}) => {
    return axiosInstance.put(endpoint, data, config);
  },

  patch: async (endpoint, data = {}, config = {}) => {
    return axiosInstance.patch(endpoint, data, config);
  },

  delete: async (endpoint, config = {}) => {
    return axiosInstance.delete(endpoint, config);
  },
};

// Export axios instance for advanced usage if needed
export { axiosInstance };

// Export base URL for reference
export { API_BASE_URL };
