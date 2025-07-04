import axiosInstance from "../axios";
import { API_ENDPOINTS } from "../constants";
import { DEV_CONFIG, simulateDelay, devLog, devError } from "../devConfig";

export const activityAPI = {
	/**
	 * Create a new activity log entry
	 */
	create: async (activityData) => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Mock activity creation", activityData);
			await simulateDelay();
			return {
				id: Date.now(),
				...activityData,
				created_at: new Date().toISOString(),
			};
		}

		try {
			const response = await axiosInstance.post(
				API_ENDPOINTS.PANEL.RECENT_ACTIVITY,
				activityData
			);
			return response.data;
		} catch (error) {
			devError("Create activity failed:", error);
			throw error;
		}
	},

	/**
	 * Log domain creation activity
	 */
	logDomainCreated: async (domainName, userName = "User") => {
		return await activityAPI.create({
			action_type: "domain_created",
			description: `Domain ${domainName} added to monitoring`,
			domain_name: domainName,
			user_name: userName,
		});
	},

	/**
	 * Log user login activity
	 */
	logUserLogin: async (userName, userEmail) => {
		return await activityAPI.create({
			action_type: "user_login",
			description: `User ${userName} logged in successfully`,
			domain_name: null,
			user_name: userName,
			metadata: { email: userEmail },
		});
	},

	/**
	 * Log policy update activity
	 */
	logPolicyUpdate: async (domainName, oldPolicy, newPolicy, userName = "User") => {
		return await activityAPI.create({
			action_type: "policy_updated",
			description: `DMARC policy updated from ${oldPolicy} to ${newPolicy}`,
			domain_name: domainName,
			user_name: userName,
			metadata: { old_policy: oldPolicy, new_policy: newPolicy },
		});
	},

	/**
	 * Log DNS check activity
	 */
	logDNSCheck: async (domainName, status = "completed") => {
		return await activityAPI.create({
			action_type: "dns_check",
			description: `DNS configuration validated for ${domainName}`,
			domain_name: domainName,
			user_name: "System",
			metadata: { check_status: status },
		});
	},

	/**
	 * Log user management activity
	 */
	logUserManagement: async (action, targetUser, adminUser) => {
		const actionDescriptions = {
			created: "User account created",
			updated: "User account updated",
			deleted: "User account deleted",
			role_changed: "User role changed",
		};

		return await activityAPI.create({
			action_type: "user_management",
			description: `${actionDescriptions[action]} for ${targetUser}`,
			domain_name: null,
			user_name: adminUser,
			metadata: { action, target_user: targetUser },
		});
	},

	/**
	 * Log security event
	 */
	logSecurityEvent: async (eventType, description, domainName = null) => {
		return await activityAPI.create({
			action_type: "security_event",
			description: description,
			domain_name: domainName,
			user_name: "System",
			metadata: { event_type: eventType },
		});
	},
};