// API Endpoints
export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: "/auth/login/",
		PROFILE: "/auth/me/",
		LOGOUT: "/auth/logout/",
	},
	USERS: "/users/",
	DOMAINS: "/domains/",
	DNS_RECORDS: "/dns-records/",
	ORGANIZATION: "/organization/",
};

// User Roles
export const USER_ROLES = {
	ADMIN: "admin",
	USER: "user",
};

// Domain Status
export const DOMAIN_STATUS = {
	PROTECTED: "protected",
	WARNING: "warning",
	ERROR: "error",
};

// DMARC Policies
export const DMARC_POLICIES = {
	NONE: "none",
	QUARANTINE: "quarantine",
	REJECT: "reject",
};

// DNS Record Types
export const DNS_RECORD_TYPES = {
	DMARC: "DMARC",
	SPF: "SPF",
	DKIM: "DKIM",
};

// Compliance Levels
export const COMPLIANCE_LEVELS = {
	HIGH: "high",
	MEDIUM: "medium",
	LOW: "low",
};

// Local Storage Keys
export const STORAGE_KEYS = {
	TOKEN: "token",
	USER_NAME: "userName",
	USER_EMAIL: "userEmail",
};

// Environment - Check both dev mode and environment variable
export const IS_DEV = import.meta.env.MODE === "development" && 
                     (import.meta.env.VITE_DEV_MODE !== "false");

// Backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";