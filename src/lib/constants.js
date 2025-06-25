// API Endpoints
export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: "/api/token/",
		REFRESH: "/api/token/refresh/",
		PROFILE: "/api/auth/me/",
		LOGOUT: "/api/auth/logout/",
	},
	USERS: "/users/",
	CLIENTES: "/clientes/",
	DOMINIOS: "/dominios/",
	DNS_RECORDS: "/dns-records/",
	TAGS: "/tags/",
	ACCESS: "/domain-access/",
	AUDIT_LOGS: "/audit-logs/",
	SYSTEM_SETTINGS: "/system-settings/",
};

// User Roles
export const USER_ROLES = {
	ADMIN: "admin",
	USER: "user",
};

// Domain Status
export const DOMAIN_STATUS = {
	ACTIVE: "active",
	INACTIVE: "inactive",
	PENDING: "pending",
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
	MX: "MX",
	TXT: "TXT",
	A: "A",
	AAAA: "AAAA",
	CNAME: "CNAME",
};

// Compliance Levels
export const COMPLIANCE_LEVELS = {
	NONE: "none",
	LOW: "low",
	MEDIUM: "medium",
	HIGH: "high",
};

// Local Storage Keys
export const STORAGE_KEYS = {
	TOKEN: "token",
	USER_NAME: "userName",
	USER_EMAIL: "userEmail",
};

// Environment - Check both dev mode and environment variable
export const IS_DEV =
	import.meta.env.MODE === "development" &&
	import.meta.env.VITE_DEV_MODE !== "false";

// Backend URL
export const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
