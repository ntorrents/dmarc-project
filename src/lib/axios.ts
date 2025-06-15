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
		if (error.response?.status === 401) {
			// Redirigir al login si el token ha expirado o no está presente
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
