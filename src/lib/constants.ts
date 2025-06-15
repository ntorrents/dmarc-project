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
} as const;

// User Roles
export const USER_ROLES = {
	ADMIN: "admin",
	USER: "user",
} as const;

// Domain Status
export const DOMAIN_STATUS = {
	PROTECTED: "protected",
	WARNING: "warning",
	ERROR: "error",
} as const;

// DMARC Policies
export const DMARC_POLICIES = {
	NONE: "none",
	QUARANTINE: "quarantine",
	REJECT: "reject",
} as const;

// DNS Record Types
export const DNS_RECORD_TYPES = {
	DMARC: "DMARC",
	SPF: "SPF",
	DKIM: "DKIM",
} as const;

// Compliance Levels
export const COMPLIANCE_LEVELS = {
	HIGH: "high",
	MEDIUM: "medium",
	LOW: "low",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
	TOKEN: "token",
	USER_NAME: "userName",
	USER_EMAIL: "userEmail",
} as const;

// Environment
export const IS_DEV = import.meta.env.MODE === "development";
