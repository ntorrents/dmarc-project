import axiosInstance from "../axios";
import { API_ENDPOINTS } from "../constants";
import { sanitizeInput, validateDomain } from "../helpers";

export const domainsAPI = {
	list: async (filters = {}) => {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				params.append(key, sanitizeInput(value.toString()));
			}
		});

		const queryString = params.toString();
		const response = await axiosInstance.get(
			`${API_ENDPOINTS.DOMAINS}${queryString ? `?${queryString}` : ""}`
		);
		return response.data;
	},

	get: async (id) => {
		const response = await axiosInstance.get(`${API_ENDPOINTS.DOMAINS}${id}/`);
		return response.data;
	},

	create: async (data) => {
		const sanitizedData = {
			nombre: sanitizeInput(data.nombre),
			cliente: data.cliente, // debe ser un ID (número entero)
			activo: data.activo ?? true,
			status: data.status || "pending",
			compliance_level: data.compliance_level || "low",
			dmarc_policy: data.dmarc_policy || "none",
			notification_email: data.notification_email || "",
			notify_on_changes: data.notify_on_changes ?? true,
			notify_on_expiration: data.notify_on_expiration ?? true,
			tags: data.tags || [],
		};

		if (!validateDomain(sanitizedData.nombre)) {
			throw new Error("Formato de dominio no válido");
		}

		const response = await axiosInstance.post(
			API_ENDPOINTS.DOMAINS,
			sanitizedData
		);
		return response.data;
	},

	update: async (id, data) => {
		const sanitizedData = Object.keys(data).reduce((acc, key) => {
			acc[key] =
				typeof data[key] === "string" ? sanitizeInput(data[key]) : data[key];
			return acc;
		}, {});

		const response = await axiosInstance.put(
			`${API_ENDPOINTS.DOMAINS}${id}/`,
			sanitizedData
		);
		return response.data;
	},

	delete: async (id) => {
		await axiosInstance.delete(`${API_ENDPOINTS.DOMAINS}${id}/`);
	},

	getStats: async () => {
		const response = await axiosInstance.get(`${API_ENDPOINTS.DOMAINS}stats/`);
		return response.data;
	},
};
