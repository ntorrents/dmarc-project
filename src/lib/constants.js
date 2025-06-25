// API Configuration and Constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Environment Configuration
export const IS_DEV =
	import.meta.env.MODE === "development" &&
	import.meta.env.VITE_USE_MOCK_DATA === "true";
export const IS_PROD = !IS_DEV;

// API Endpoints - Single Source of Truth
export const API_ENDPOINTS = {
	AUTH: {
		LOGIN_LOGOUT_REFRESH: `/auth/auth/`,
		REGISTER: `/auth/register/`,
		PROFILE: `/auth/profile/`,
		COMPANIES: `/auth/empresas/`,
		COMPANY_DETAIL: (id) => `/auth/empresas/${id}/`,
		ROLES: `/auth/roles/`,
		ROLE_DETAIL: (id) => `/auth/roles/${id}/`,
		USERS: `/auth/users/`,
		USER_DETAIL: (id) => `/auth/users/${id}/`,
	},

	PANEL: {
		TAGS: `/panel/tags/`,
		TAG_DETAIL: (id) => `/panel/tags/${id}/`,
		DOMAINS: `/panel/dominios/`,
		DOMAIN_DETAIL: (id) => `/panel/dominios/${id}/`,
		DOMAIN_DNS_RECORDS: (id) => `/panel/dominios/${id}/dns_records/`,
		DOMAIN_CHECK_DNS: (id) => `/panel/dominios/${id}/check_dns/`,
		DOMAIN_BULK_UPDATE: `/panel/dominios/bulk_update/`,
		DOMAIN_STATS: `/panel/dominios/stats/`,
		DNS_RECORDS: `/panel/dns-records/`,
		DNS_RECORD_DETAIL: (id) => `/panel/dns-records/${id}/`,
		DNS_RECORDS_BULK_CREATE: `/panel/dns-records/bulk_create/`,
		AUDIT_LOGS: `/panel/audit-logs/`,
		AUDIT_LOG_DETAIL: (id) => `/panel/audit-logs/${id}/`,
		SYSTEM_SETTINGS: `/panel/system-settings/`,
		SYSTEM_SETTING_DETAIL: (id) => `/panel/system-settings/${id}/`,
	},

	API_DOCS: `/docs/`,
	API_REDOC: `/redoc/`,
	API_SCHEMA: `/schema/`,
};

// User Roles
export const USER_ROLES = {
	SUPER_ADMIN: "super_admin",
	CLIENT_ADMIN: "client_admin",
	USER: "user",
	READ_ONLY: "read_only",
	CONFIG_ONLY: "config_only",
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

// Application Routes
export const ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/signup",
	DASHBOARD: "/dashboard",
	DOMAINS: "/dashboard/domains",
	DOMAIN_DETAIL: (id) => `/dashboard/domains/${id}`,
	REPORTS: "/dashboard/reports",
	THREATS: "/dashboard/threats",
	SETTINGS: "/dashboard/settings",
	PROFILE: "/dashboard/profile",
	USERS: "/dashboard/users",
	AUDIT_LOGS: "/dashboard/audit-logs",
	PRICING: "/pricing",
	CONTACT: "/contact",
	TERMS: "/terms",
	PRIVACY: "/privacy",
};

console.log("API_BASE_URL is:", API_BASE_URL);
