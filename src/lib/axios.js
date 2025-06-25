import axios from "axios";
import { API_BASE_URL } from "./constants";

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor para añadir token JWT a cada petición si existe
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// No redirigir en errores de red - que manejen los componentes
		if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
			console.error("Network error - backend may not be running:", error);
			console.error("Make sure your backend is running at:", API_BASE_URL);
			return Promise.reject(error);
		}

		if (error.response?.status === 401) {
			// Solo redirigir si no estamos ya en login
			if (!window.location.pathname.includes("/login")) {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
