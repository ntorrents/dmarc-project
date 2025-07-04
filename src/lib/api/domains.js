import axiosInstance from "../axios";
import { API_ENDPOINTS } from "../constants";
import {
	DEV_CONFIG,
	MOCK_DATA,
	simulateDelay,
	devLog,
	devError,
} from "../devConfig";

export const domainsAPI = {
	/**
	 * Get all domains for the current user/client
	 */
	list: async (filters = {}) => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock domains data", filters);
			await simulateDelay();

			// Apply mock filters
			let filteredDomains = [...MOCK_DATA.DOMAINS];

			if (filters.search) {
				filteredDomains = filteredDomains.filter(
					(domain) =>
						domain.nombre
							.toLowerCase()
							.includes(filters.search.toLowerCase()) ||
						domain.tags.some((tag) =>
							tag.toLowerCase().includes(filters.search.toLowerCase())
						)
				);
			}

			if (filters.status) {
				filteredDomains = filteredDomains.filter(
					(domain) => domain.status === filters.status
				);
			}

			if (filters.tags) {
				filteredDomains = filteredDomains.filter((domain) =>
					domain.tags.some((tag) => filters.tags.includes(tag))
				);
			}

			return {
				results: filteredDomains,
				count: filteredDomains.length,
				next: null,
				previous: null,
			};
		}

		try {
			devLog("Making API request to domains endpoint with filters:", filters);

			const params = new URLSearchParams();
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== "") {
					if (Array.isArray(value)) {
						value.forEach((v) => params.append(key, v));
					} else {
						params.append(key, value.toString());
					}
				}
			});

			const queryString = params.toString();
			const url = queryString
				? `${API_ENDPOINTS.PANEL.DOMAINS}?${queryString}`
				: API_ENDPOINTS.PANEL.DOMAINS;

			devLog("Domains API URL:", url);
			const response = await axiosInstance.get(url);
			devLog("Domains API response:", response.data);

			// Handle different response formats
			if (response.data.results) {
				// Paginated response
				return response.data.results;
			} else if (Array.isArray(response.data)) {
				// Direct array response
				return response.data;
			} else {
				// Single object or other format
				return response.data;
			}
		} catch (error) {
			devError("Get domains failed:", error);
			devError("Error details:", error.response?.data);
			throw error;
		}
	},

	/**
	 * Get domain by ID
	 */
	get: async (id) => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock domain get", id);
			await simulateDelay();

			const domain = MOCK_DATA.DOMAINS.find((d) => d.id === parseInt(id));
			if (!domain) {
				throw new Error("Domain not found");
			}
			return domain;
		}

		try {
			const response = await axiosInstance.get(
				API_ENDPOINTS.PANEL.DOMAIN_DETAIL(id)
			);
			return response.data;
		} catch (error) {
			devError("Get domain failed:", error);
			throw error;
		}
	},

	/**
	 * Create new domain
	 */
	create: async (domainData) => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock domain create", domainData);
			await simulateDelay();

			const newDomain = {
				id: Date.now(),
				...domainData,
				cliente: 1, // Current user's client
				activo: true,
				status: "pending",
				compliance_level: "low",
				dmarc_policy: "none",
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				last_check: null,
				dns_records_count: 0,
				compliance_score: 0,
			};
			return newDomain;
		}

		try {
			const response = await axiosInstance.post(
				API_ENDPOINTS.PANEL.DOMAINS,
				domainData
			);
			return response.data;
		} catch (error) {
			devError("Create domain failed:", error);
			throw error;
		}
	},

	/**
	 * Update domain
	 */
	update: async (id, domainData) => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock domain update", id, domainData);
			await simulateDelay();

			const domain = MOCK_DATA.DOMAINS.find((d) => d.id === parseInt(id));
			if (!domain) {
				throw new Error("Domain not found");
			}
			return { ...domain, ...domainData, updated_at: new Date().toISOString() };
		}

		try {
			const response = await axiosInstance.put(
				API_ENDPOINTS.PANEL.DOMAIN_DETAIL(id),
				domainData
			);
			return response.data;
		} catch (error) {
			devError("Update domain failed:", error);
			throw error;
		}
	},

	/**
	 * Delete domain
	 */
	delete: async (id) => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock domain delete", id);
			await simulateDelay();
			return { message: "Domain deleted successfully" };
		}

		try {
			const response = await axiosInstance.delete(
				API_ENDPOINTS.PANEL.DOMAIN_DETAIL(id)
			);
			return response.data;
		} catch (error) {
			devError("Delete domain failed:", error);
			throw error;
		}
	},

	/**
	 * Get domain DNS records
	 */
	getDNSRecords: async (id) => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock DNS records", id);
			await simulateDelay();

			return [
				{
					id: 1,
					domain: parseInt(id),
					type: "DMARC",
					name: `_dmarc.${
						MOCK_DATA.DOMAINS.find((d) => d.id === parseInt(id))?.nombre
					}`,
					value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com",
					ttl: 3600,
					status: "valid",
					last_checked: "2024-01-15T10:30:00Z",
				},
				{
					id: 2,
					domain: parseInt(id),
					type: "SPF",
					name: MOCK_DATA.DOMAINS.find((d) => d.id === parseInt(id))?.nombre,
					value: "v=spf1 include:_spf.google.com ~all",
					ttl: 3600,
					status: "valid",
					last_checked: "2024-01-15T10:30:00Z",
				},
			];
		}

		try {
			const response = await axiosInstance.get(
				API_ENDPOINTS.PANEL.DOMAIN_DNS_RECORDS(id)
			);
			return response.data;
		} catch (error) {
			devError("Get DNS records failed:", error);
			throw error;
		}
	},

	/**
	 * Check domain DNS configuration
	 */
	checkDNS: async (id) => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock DNS check", id);
			await simulateDelay();

			return {
				domain_id: parseInt(id),
				status: "completed",
				results: {
					dmarc: { found: true, valid: true, policy: "quarantine" },
					spf: { found: true, valid: true, mechanisms: 2 },
					dkim: { found: true, valid: true, selectors: ["default"] },
				},
				compliance_score: 92,
				recommendations: [
					"Consider upgrading DMARC policy to reject",
					"Add DKIM key rotation schedule",
				],
			};
		}

		try {
			const response = await axiosInstance.post(
				API_ENDPOINTS.PANEL.DOMAIN_CHECK_DNS(id)
			);
			return response.data;
		} catch (error) {
			devError("DNS check failed:", error);
			throw error;
		}
	},

	/**
	 * Get domain statistics
	 */
	getStats: async () => {
		if (DEV_CONFIG.USE_MOCK_DOMAINS) {
			devLog("Using mock domain stats");
			await simulateDelay();

			return {
				total_domains: MOCK_DATA.DOMAINS.length,
				active_domains: MOCK_DATA.DOMAINS.filter((d) => d.activo).length,
				protected_domains: MOCK_DATA.DOMAINS.filter(
					(d) => d.dmarc_policy !== "none"
				).length,
				average_compliance: 79.5,
				recent_checks: 15,
				issues_found: 3,
			};
		}

		try {
			const response = await axiosInstance.get(
				API_ENDPOINTS.PANEL.DOMAIN_STATS
			);
			return response.data;
		} catch (error) {
			devError("Get domain stats failed:", error);
			throw error;
		}
	},
};
