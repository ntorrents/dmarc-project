import axiosInstance from "../axios";
import { API_ENDPOINTS } from "../constants";
import { sanitizeInput, validateEmail } from "../helpers";

export const authAPI = {
	login: async (credentials) => {
		const sanitizedCredentials = {
			email: sanitizeInput(credentials.email),
			password: credentials.password, // No sanitizar passwords
		};

		if (!validateEmail(sanitizedCredentials.email)) {
			throw new Error("Invalid email format");
		}

		const response = await axiosInstance.post(
			API_ENDPOINTS.AUTH.LOGIN,
			sanitizedCredentials,
			{ withCredentials: true } // ✅ para que se guarde la cookie
		);
		return response.data;
	},

	getProfile: async () => {
		const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE, {
			withCredentials: true, // ✅ envía cookie automáticamente
		});
		return response.data;
	},

	updateProfile: async (data) => {
		const sanitizedData = {
			name: sanitizeInput(data.name),
			email: sanitizeInput(data.email),
			...(data.currentPassword && { currentPassword: data.currentPassword }),
			...(data.password && { password: data.password }),
		};

		if (!validateEmail(sanitizedData.email)) {
			throw new Error("Invalid email format");
		}

		const response = await axiosInstance.put(
			API_ENDPOINTS.AUTH.PROFILE,
			sanitizedData,
			{ withCredentials: true } // ✅ incluye la cookie para autorizar
		);
		return response.data;
	},

	logout: async () => {
		try {
			await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, null, {
				withCredentials: true, // ✅ para que el backend pueda borrar la cookie
			});
		} finally {
			localStorage.removeItem("token");
			localStorage.removeItem("userName");
			localStorage.removeItem("userEmail");
		}
	},
};