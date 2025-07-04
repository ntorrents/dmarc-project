// src/lib/api/activity.js
import api from "../axios";

export const activityAPI = {
	getRecentActivity: async () => {
		const response = await api.get(
			"/panel/audit-logs/?ordering=-timestamp&limit=10"
		);

		return response.data?.results || [];
	},
};
