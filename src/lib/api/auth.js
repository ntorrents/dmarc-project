import axiosInstance from "../axios";
import { API_ENDPOINTS } from "../constants";
import { DEV_CONFIG, MOCK_DATA, simulateDelay, devLog } from "../devConfig";
import { clearAuthCookies } from "../axios";


export const authAPI = {
	/**
	 * Login with email and password
	 * Uses HttpOnly cookies for session management
	 */
	login: async (credentials) => {
		if (DEV_CONFIG.USE_MOCK_AUTH) {
			// Mock login for development
			devLog("Mock login", credentials);
			await simulateDelay();
			return {
				user: MOCK_DATA.USER,
				message: "Login successful",
			};
		}

		try {
			const response = await axiosInstance.post(
				API_ENDPOINTS.AUTH.LOGIN_LOGOUT_REFRESH,
				{
					email: credentials.email,
					password: credentials.password,
					action: "login",
				}
			);

			return response.data;
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		}
	},

	/**
	 * Logout user and clear session
	 */
	logout: async () => {
		if (DEV_CONFIG.USE_MOCK_AUTH) {
			devLog("Mock logout");
			await simulateDelay();
			clearAuthCookies();
			return { message: "Logout successful" };
		}

		try {
			const response = await axiosInstance.post(
				API_ENDPOINTS.AUTH.LOGIN_LOGOUT_REFRESH,
				{
					action: "logout",
				}
			);

			// Clear cookies on successful logout
			clearAuthCookies();

			return response.data;
		} catch (error) {
			// Even if logout fails on server, clear local cookies
			clearAuthCookies();
			console.error("Logout error:", error);
			throw error;
		}
	},

	/**
	 * Get current user profile
	 */
	getProfile: async () => {
		if (DEV_CONFIG.USE_MOCK_AUTH) {
			devLog("Mock profile");
			await simulateDelay();
			return MOCK_DATA.USER;
		}

		try {
			const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
			return response.data;
		} catch (error) {
			console.error("Get profile failed:", error);
			throw error;
		}
	},

	/**
	 * Update user profile
	 */
	updateProfile: async (profileData) => {
		if (DEV_CONFIG.USE_MOCK_AUTH) {
			devLog("Mock profile update", profileData);
			await simulateDelay();
			return { ...MOCK_DATA.USER, ...profileData };
		}

		try {
			const response = await axiosInstance.put(
				API_ENDPOINTS.AUTH.PROFILE,
				profileData
			);
			console.log("Profile update response:", response.data); // Debug log
			return response.data;
		} catch (error) {
			console.error("Update profile failed:", error);
			throw error;
		}
	},

	/**
	 * Register new user
	 */
	register: async (userData) => {
		if (DEV_CONFIG.USE_MOCK_AUTH) {
			devLog("Mock registration", userData);
			await simulateDelay();
			return {
				user: { ...MOCK_DATA.USER, ...userData },
				message: "Registration successful",
			};
		}

		try {
			const response = await axiosInstance.post(
				API_ENDPOINTS.AUTH.REGISTER,
				userData
			);
			return response.data;
		} catch (error) {
			console.error("Registration failed:", error);
			throw error;
		}
	},

	/**
	 * Refresh session (if using JWT with refresh tokens)
	 */
	refreshSession: async () => {
		if (DEV_CONFIG.USE_MOCK_AUTH) {
			devLog("Mock session refresh");
			await simulateDelay();
			return { message: "Session refreshed" };
		}

		try {
			const response = await axiosInstance.post(
				API_ENDPOINTS.AUTH.LOGIN_LOGOUT_REFRESH,
				{
					action: "refresh",
				}
			);
			return response.data;
		} catch (error) {
			console.error("Session refresh failed:", error);
			throw error;
		}
	},

	/**
	 * Check if user is authenticated
	 */
	checkAuth: async () => {
		if (DEV_CONFIG.USE_MOCK_AUTH) {
			devLog("Mock auth check");
			await simulateDelay();
			return { authenticated: true, user: MOCK_DATA.USER };
		}

		try {
			const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
			console.log("Auth check response:", response.data); // Debug log
			return { authenticated: true, user: response.data };
		} catch (error) {
			console.log("Auth check failed:", error.response?.status); // Debug log
			return { authenticated: false, user: null };
		}
	},
};
