import axiosInstance from "../axios";
import { API_ENDPOINTS } from "../constants";
import { sanitizeInput, validateEmail } from "../helpers";

export const authAPI = {
	login: async (credentials) => {
		const sanitizedCredentials = {
			email: sanitizeInput(credentials.email),
			password: credentials.password,
		};

		if (!validateEmail(sanitizedCredentials.email)) {
			throw new Error("Invalid email format");
		}

		const response = await axiosInstance.post(
			API_ENDPOINTS.AUTH.LOGIN,
			sanitizedCredentials
		);
		const { access, refresh } = response.data;

		localStorage.setItem("token", access);
		localStorage.setItem("refreshToken", refresh);

		return response.data;
	},

	getProfile: async () => {
		const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
		return response.data;
	},

	logout: async () => {
		// Si tienes endpoint de logout backend, llámalo aquí, sino sólo limpia localStorage
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
	},
};
