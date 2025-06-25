import { useState, useEffect } from "react";
import { authAPI } from "../lib/api/auth";
import { getErrorMessage } from "../lib/helpers";
import { IS_DEV } from "../lib/constants";

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

			if (IS_DEV) {
				const mockUser = {
					id: 1,
					name: "Dev User",
					email: "dev@example.com",
					role: "admin",
				};
				setUser(mockUser);
				setLoading(false);
				return;
			}

			// Si no hay token, no hacer llamada perfil
			const token = localStorage.getItem("token");
			if (!token) {
				setUser(null);
				setLoading(false);
				return;
			}

			const profile = await authAPI.getProfile();
			setUser(profile);
		} catch (error) {
			console.error("Auth check failed:", error);

			if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
				setError(
					"Unable to connect to backend server. Please ensure your backend is running."
				);
			} else if (error.response?.status === 401) {
				setError(null); // No logged in
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

			if (IS_DEV) {
				const mockUser = {
					id: 1,
					name: credentials.email.split("@")[0] || "Dev User",
					email: credentials.email,
					role: "admin",
				};
				setUser(mockUser);
				return mockUser;
			}

			// login devuelve tokens y los guarda en localStorage
			await authAPI.login(credentials);

			// Luego cargar perfil
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
			if (!IS_DEV) {
				await authAPI.logout();
			}
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setUser(null);
			setLoading(false);
			localStorage.removeItem("token");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("userName");
			localStorage.removeItem("userEmail");
		}
	};

	const updateProfile = async (data) => {
		try {
			setError(null);

			if (IS_DEV) {
				const updatedUser = { ...user, ...data };
				setUser(updatedUser);
				return updatedUser;
			}

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
