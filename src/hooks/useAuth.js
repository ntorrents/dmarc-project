import { useState, useEffect, useCallback } from "react";
import { authAPI } from "../lib/api/auth";
import { IS_DEV } from "../lib/constants";

export const useAuth = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Check authentication status on mount and when auth events occur
	const checkAuthStatus = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const authResult = await authAPI.checkAuth();

			if (authResult.authenticated) {
				console.log("User authenticated:", authResult.user); // Debug log
				setUser(authResult.user);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Auth check failed:", error);
			setUser(null);

			// Only set error if it's not a network issue in dev mode
			if (!IS_DEV || error.code !== "ERR_NETWORK") {
				setError(error.message || "Authentication check failed");
			}
		} finally {
			setLoading(false);
		}
	}, []);

	// Login function
	const login = async (credentials) => {
		try {
			setError(null);
			setLoading(true);

			const result = await authAPI.login(credentials);

			// Get updated user profile after login
			const authResult = await authAPI.checkAuth();
			if (authResult.authenticated) {
				console.log("User logged in:", authResult.user); // Debug log
				setUser(authResult.user);
			}

			return result;
		} catch (error) {
			console.error("Login failed:", error);
			setError(error.message || "Login failed");
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Logout function
	const logout = async () => {
		try {
			setLoading(true);
			await authAPI.logout();
		} catch (error) {
			console.error("Logout error:", error);
			// Don't throw logout errors, just log them
		} finally {
			setUser(null);
			setError(null);
			setLoading(false);
		}
	};

	// Register function
	const register = async (userData) => {
		try {
			setError(null);
			setLoading(true);

			const result = await authAPI.register(userData);

			// Get updated user profile after registration
			const authResult = await authAPI.checkAuth();
			if (authResult.authenticated) {
				setUser(authResult.user);
			}

			return result;
		} catch (error) {
			console.error("Registration failed:", error);
			setError(error.message || "Registration failed");
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Update profile function
	const updateProfile = async (profileData) => {
		try {
			setError(null);

			const updatedUser = await authAPI.updateProfile(profileData);
			setUser(updatedUser);

			return updatedUser;
		} catch (error) {
			console.error("Profile update failed:", error);
			setError(error.message || "Profile update failed");
			throw error;
		}
	};

	// Listen for auth events (like logout from another tab)
	useEffect(() => {
		const handleAuthEvent = (event) => {
			if (event.type === "auth:logout") {
				setUser(null);
				setError(null);
			}
		};

		window.addEventListener("auth:logout", handleAuthEvent);

		return () => {
			window.removeEventListener("auth:logout", handleAuthEvent);
		};
	}, []);

	// Check auth status on mount
	useEffect(() => {
		checkAuthStatus();
	}, [checkAuthStatus]);

	// Computed properties
	const isAuthenticated = !!user;
	const isAdmin = user?.role === "client_admin" || user?.role === "super_admin";
	const isSuperAdmin = user?.role === "super_admin";
	const hasPermission = (permission) =>
		Array.isArray(user?.permissions) && user.permissions.includes(permission);

	return {
		user,
		loading,
		error,
		isAuthenticated,
		isAdmin,
		isSuperAdmin,
		hasPermission,
		login,
		logout,
		register,
		updateProfile,
		checkAuthStatus,
	};
};
