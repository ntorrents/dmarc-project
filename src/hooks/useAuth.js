import { useState, useEffect } from "react";
import {
	authAPI,
} from "../lib/api/auth";
import { getErrorMessage } from "../lib/helpers";

export const useAuth = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			setLoading(true);
			setError(null);

			// In development mode, create a mock user to bypass authentication
			const isDev = import.meta.env.MODE === "development";
			
			if (isDev) {
				// Create a mock user for development
				const mockUser = {
					id: 1,
					name: "Dev User",
					email: "dev@example.com",
					role: "admin"
				};
				setUser(mockUser);
				setLoading(false);
				return;
			}

			// Production mode - use real authentication
			const profile = await authAPI.getProfile();
			setUser(profile);
		} catch (error) {
			console.error("Auth check failed:", error);
			
			// Check if it's a network error
			if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
				setError("Unable to connect to server. Please check if the backend is running.");
			} else if (error.response?.status === 401) {
				// Unauthorized - user not logged in, this is expected
				setError(null);
			} else {
				setError(getErrorMessage(error));
			}
			
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials) => {
		try {
			setError(null);
			setLoading(true);

			// In development mode, simulate successful login
			const isDev = import.meta.env.MODE === "development";
			
			if (isDev) {
				const mockUser = {
					id: 1,
					name: credentials.email.split('@')[0] || "Dev User",
					email: credentials.email,
					role: "admin"
				};
				setUser(mockUser);
				return mockUser;
			}

			// Production mode - use real authentication
			const response = await authAPI.login(credentials);
			const profile = await authAPI.getProfile();
			setUser(profile);

			return profile;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			setError(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			setLoading(true);
			
			// In development mode, just clear the user
			const isDev = import.meta.env.MODE === "development";
			
			if (!isDev) {
				await authAPI.logout();
			}
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setUser(null);
			setLoading(false);

			// Clear localStorage
			localStorage.removeItem("token");
			localStorage.removeItem("userName");
			localStorage.removeItem("userEmail");
		}
	};

	const updateProfile = async (data) => {
		try {
			setError(null);
			
			// In development mode, just update the mock user
			const isDev = import.meta.env.MODE === "development";
			
			if (isDev) {
				const updatedUser = { ...user, ...data };
				setUser(updatedUser);
				return updatedUser;
			}

			// Production mode - use real API
			const updatedUser = await authAPI.updateProfile(data);
			setUser(updatedUser);
			return updatedUser;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			setError(errorMessage);
			throw error;
		}
	};

	const isAuthenticated = !!user;
	const isAdmin = user?.role === "admin";

	return {
		user,
		loading,
		error,
		isAuthenticated,
		isAdmin,
		login,
		logout,
		updateProfile,
		checkAuthStatus,
	};
};