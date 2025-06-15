import axios from "axios";

const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance with default configuration
const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			localStorage.removeItem("token");
			localStorage.removeItem("userName");
			localStorage.removeItem("userEmail");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
