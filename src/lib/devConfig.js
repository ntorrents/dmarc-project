/**
 * Development Configuration
 * Controls mock data and development features
 */

// Master switch for development mode
export const IS_DEV = false; // Set to true to enable all dev features

// Development feature flags
export const DEV_CONFIG = {
  // Authentication
  USE_MOCK_AUTH: IS_DEV && false,
  PREFILL_LOGIN_FORM: IS_DEV && false,
  
  // API Data
  USE_MOCK_DOMAINS: IS_DEV && false,
  USE_MOCK_REPORTS: IS_DEV && false,
  USE_MOCK_THREATS: IS_DEV && false,
  USE_MOCK_USERS: IS_DEV && false,
  USE_MOCK_DNS_RECORDS: IS_DEV && false,
  
  // UI Features
  SHOW_DEV_NOTICES: IS_DEV && false,
  ENABLE_DEBUG_LOGGING: IS_DEV && true,
  
  // API Timeouts (in milliseconds)
  API_TIMEOUT: IS_DEV ? 10000 : 30000,
  
  // Mock data delays (for simulating network latency)
  MOCK_DELAY: IS_DEV ? 1000 : 0
};

// Mock data for development (only used when IS_DEV is true)
export const MOCK_DATA = {
  // User data
  USER: {
    id: 1,
    username: "dev@example.com",
    email: "dev@example.com",
    first_name: "Dev",
    last_name: "User",
    role: "client_admin",
    company: {
      id: 1,
      name: "Example Corp",
      email: "contact@example.com",
    },
    permissions: ["view_domains", "manage_domains", "view_users", "manage_users"],
  },

  // Domains data
  DOMAINS: [
    {
      id: 1,
      nombre: "example.com",
      cliente: 1,
      activo: true,
      status: "active",
      compliance_level: "high",
      dmarc_policy: "quarantine",
      notification_email: "admin@example.com",
      notify_on_changes: true,
      notify_on_expiration: true,
      tags: ["production", "main"],
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      last_check: "2024-01-15T10:30:00Z",
      dns_records_count: 3,
      compliance_score: 92,
    },
    {
      id: 2,
      nombre: "staging.example.com",
      cliente: 1,
      activo: true,
      status: "warning",
      compliance_level: "medium",
      dmarc_policy: "none",
      notification_email: "admin@example.com",
      notify_on_changes: true,
      notify_on_expiration: false,
      tags: ["staging"],
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-14T15:45:00Z",
      last_check: "2024-01-14T15:45:00Z",
      dns_records_count: 2,
      compliance_score: 67,
    },
  ],

  // Reports data
  REPORTS: {
    totalEmails: 45678,
    blockedEmails: 6834,
    passRate: 85.2,
    topThreats: [
      { type: "Phishing", count: 2341, trend: "up" },
      { type: "Spoofing", count: 1876, trend: "down" },
      { type: "Spam", count: 1654, trend: "up" },
      { type: "Malware", count: 963, trend: "stable" },
    ],
  },

  // Threat intelligence data
  THREATS: {
    activeThreatsCurrent: 23,
    activeThreatsChange: "+5",
    blockedAttacks: 1847,
    blockedAttacksChange: "+12%",
    riskLevel: "Medium",
    riskScore: 67,
    lastUpdate: "2 minutes ago",
  }
};

// Development utilities
export const devLog = (...args) => {
  if (DEV_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.log('[DEV]', ...args);
  }
};

export const devWarn = (...args) => {
  if (DEV_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.warn('[DEV]', ...args);
  }
};

export const devError = (...args) => {
  if (DEV_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.error('[DEV]', ...args);
  }
};

// Simulate network delay for development
export const simulateDelay = (ms = DEV_CONFIG.MOCK_DELAY) => {
  if (!IS_DEV || ms === 0) return Promise.resolve();
  return new Promise(resolve => setTimeout(resolve, ms));
};