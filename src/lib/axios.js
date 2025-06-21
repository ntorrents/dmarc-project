import axios from "axios";

const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance with default configuration
const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	withCredentials: true, // 👈 necesario para que las cookies viajen con la petición
	headers: {
		"Content-Type": "application/json",
	},
});

// ❌ Eliminamos el interceptor de request: ya no usamos token manual
// ❌ Eliminamos también el manejo de localStorage en el interceptor de response

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Don't redirect on network errors - let components handle them
		if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
			console.error('Network error - backend may not be running:', error);
			return Promise.reject(error);
		}
		
		if (error.response?.status === 401) {
			// Only redirect to login if we're not already on the login page
			if (!window.location.pathname.includes('/login')) {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;