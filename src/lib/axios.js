import axios from "axios";
import { API_BASE_URL, IS_DEV, ROUTES } from "./constants";

// Create axios instance with secure defaults
const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	withCredentials: true, // Essential for HttpOnly cookies
	headers: {
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest", // CSRF protection
	},
});

// Request interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		// Add CSRF token if available (for Django)
		const csrfToken = getCsrfToken();
		if (csrfToken) {
			config.headers["X-CSRFToken"] = csrfToken;
		}

		// Log requests in development
		if (IS_DEV) {
			console.log(
				`🔄 ${config.method?.toUpperCase()} ${config.url}`,
				config.data
			);
		}

		return config;
	},
	(error) => {
		console.error("Request interceptor error:", error);
		return Promise.reject(error);
	}
);

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		// Log successful responses in development
		if (IS_DEV) {
			console.log(
				`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
				response.data
			);
		}
		return response;
	},
	(error) => {
		// Handle different error scenarios
		if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
			console.error("🌐 Network error - backend may not be running:", error);

			if (!IS_DEV) {
				// In production, show user-friendly error
				throw new Error(
					"Unable to connect to server. Please check your internet connection."
				);
			}
		}

		// Handle authentication errors
		if (error.response?.status === 401) {
			console.warn("🔒 Authentication failed - redirecting to login");
			console.log("Request URL:", error.config?.url);
			console.log("Request method:", error.config?.method);

			// Clear any client-side auth state
			window.dispatchEvent(new CustomEvent("auth:logout"));

			// Only redirect if not already on login page
			if (!window.location.pathname.includes("/login")) {
				window.location.href = ROUTES.LOGIN;
			}
		}

		// Handle forbidden access
		if (error.response?.status === 403) {
			console.warn("🚫 Access forbidden");
			console.log("Request URL:", error.config?.url);
			throw new Error("You do not have permission to perform this action.");
		}

		// Handle server errors
		if (error.response?.status >= 500) {
			console.error("🔥 Server error:", error.response);
			console.log("Request URL:", error.config?.url);
			throw new Error("Server error. Please try again later.");
		}

		// Handle validation errors
		if (error.response?.status === 400) {
			const errorData = error.response.data;
			console.log("Validation error:", errorData);
			if (errorData && typeof errorData === "object") {
				// Extract validation errors
				const validationErrors = Object.entries(errorData)
					.map(
						([field, errors]) =>
							`${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`
					)
					.join("; ");
				throw new Error(validationErrors);
			}
		}

		// Log errors in development
		if (IS_DEV) {
			console.error(
				`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
				error.response?.data || error.message
			);
		}

		return Promise.reject(error);
	}
);

// Helper function to get CSRF token from cookies
function getCsrfToken() {
	const name = "csrftoken";
	let cookieValue = null;

	if (document.cookie && document.cookie !== "") {
		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === name + "=") {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}

	return cookieValue;
}

// Helper function to check if user is authenticated (based on cookie presence)
export function isAuthenticated() {
	// In a real app, you might check for a specific auth cookie
	// For now, we'll rely on the backend to validate the session
	return (
		document.cookie.includes("sessionid") ||
		document.cookie.includes("csrftoken")
	);
}

// Helper function to clear all auth-related cookies (for logout)
export function clearAuthCookies() {
	const cookies = ["sessionid", "csrftoken"];
	cookies.forEach((cookieName) => {
		document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
		document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
	});
}

export default axiosInstance;
