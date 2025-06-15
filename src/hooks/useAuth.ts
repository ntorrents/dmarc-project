import { useState, useEffect } from "react";
import {
	authAPI,
	type LoginCredentials,
	type UserProfile,
} from "../lib/api/auth";
import { getErrorMessage } from "../lib/helpers";

export const useAuth = () => {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			setLoading(true);
			const profile = await authAPI.getProfile(); // 🍪 Usa la cookie HttpOnly
			setUser(profile);
		} catch (error) {
			console.error("Auth check failed:", error);
			setUser(null); // No sesión válida
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials: LoginCredentials) => {
		try {
			setError(null);
			setLoading(true);

			const response = await authAPI.login(credentials); // 🍪 No devuelve token, solo éxito

			// Opcional: obtener el perfil tras login
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
			await authAPI.logout(); // elimina cookie HttpOnly en backend
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setUser(null);
			setLoading(false);

			// Limpieza localStorage para que no queden datos residuales
			localStorage.removeItem("token");
			localStorage.removeItem("userName");
			localStorage.removeItem("userEmail");
		}
	};

	const updateProfile = async (data: any) => {
		try {
			setError(null);
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
