import axiosInstance from "../axios";
import { API_ENDPOINTS } from "../constants";
import {
	DEV_CONFIG,
	MOCK_DATA,
	simulateDelay,
	devLog,
	devError,
} from "../devConfig";

export const statsAPI = {
	/**
	 * Get dashboard statistics
	 */
	getDashboardStats: async () => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock dashboard stats");
			await simulateDelay();

			return {
				total_domains: MOCK_DATA.DOMAINS.length,
				active_users: 5,
				dmarc_compliance: 87.5,
				protected_domains: MOCK_DATA.DOMAINS.filter(
					(d) => d.dmarc_policy !== "none"
				).length,
				average_compliance: 79.5,
				recent_checks: 15,
				issues_found: 3,
			};
		}

		try {
			devLog("Making API request to dashboard stats endpoint");
			const response = await axiosInstance.get(
				API_ENDPOINTS.PANEL.DOMAIN_STATS
			);
			devLog("Dashboard stats API response:", response.data);

			return response.data;
		} catch (error) {
			devError("Get dashboard stats failed:", error);
			throw error;
		}
	},

	/**
	 * Get user statistics
	 */
	getUserStats: async () => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock user stats");
			await simulateDelay();

			return {
				total_users: 5,
				active_users: 4,
				admin_users: 1,
				last_login_count: 3,
			};
		}

		try {
			devLog("Making API request to user stats endpoint");
			const response = await axiosInstance.get(
				API_ENDPOINTS.AUTH.USERS + "stats/"
			);
			devLog("User stats API response:", response.data);

			return response.data;
		} catch (error) {
			devError("Get user stats failed:", error);
			throw error;
		}
	},

	/**
	 * Get compliance statistics
	 */
	getComplianceStats: async () => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock compliance stats");
			await simulateDelay();

			return {
				average_compliance: 87.5,
				high_compliance_domains: 2,
				medium_compliance_domains: 1,
				low_compliance_domains: 0,
				total_domains: 3,
			};
		}

		try {
			devLog("Making API request to compliance stats endpoint");
			const response = await axiosInstance.get(
				API_ENDPOINTS.PANEL.DOMAINS + "compliance-stats/"
			);
			devLog("Compliance stats API response:", response.data);

			return response.data;
		} catch (error) {
			devError("Get compliance stats failed:", error);
			throw error;
		}
	},
};