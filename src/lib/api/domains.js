import axiosInstance from '../axios';
import { API_ENDPOINTS, IS_DEV } from '../constants';

// Mock data for development
const MOCK_DOMAINS = [
  {
    id: 1,
    nombre: 'example.com',
    cliente: 1,
    activo: true,
    status: 'active',
    compliance_level: 'high',
    dmarc_policy: 'quarantine',
    notification_email: 'admin@example.com',
    notify_on_changes: true,
    notify_on_expiration: true,
    tags: ['production', 'main'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    last_check: '2024-01-15T10:30:00Z',
    dns_records_count: 3,
    compliance_score: 92
  },
  {
    id: 2,
    nombre: 'staging.example.com',
    cliente: 1,
    activo: true,
    status: 'warning',
    compliance_level: 'medium',
    dmarc_policy: 'none',
    notification_email: 'admin@example.com',
    notify_on_changes: true,
    notify_on_expiration: false,
    tags: ['staging'],
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-14T15:45:00Z',
    last_check: '2024-01-14T15:45:00Z',
    dns_records_count: 2,
    compliance_score: 67
  }
];

export const domainsAPI = {
  /**
   * Get all domains for the current user/client
   */
  list: async (filters = {}) => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock domains list', filters);
      
      // Apply mock filters
      let filteredDomains = [...MOCK_DOMAINS];
      
      if (filters.search) {
        filteredDomains = filteredDomains.filter(domain =>
          domain.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
          domain.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
        );
      }
      
      if (filters.status) {
        filteredDomains = filteredDomains.filter(domain => domain.status === filters.status);
      }
      
      if (filters.tags) {
        filteredDomains = filteredDomains.filter(domain => 
          domain.tags.some(tag => filters.tags.includes(tag))
        );
      }
      
      return {
        results: filteredDomains,
        count: filteredDomains.length,
        next: null,
        previous: null
      };
    }

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.PANEL.DOMAINS}?${queryString}` : API_ENDPOINTS.PANEL.DOMAINS;
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Get domains failed:', error);
      throw error;
    }
  },

  /**
   * Get domain by ID
   */
  get: async (id) => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock domain get', id);
      const domain = MOCK_DOMAINS.find(d => d.id === parseInt(id));
      if (!domain) {
        throw new Error('Domain not found');
      }
      return domain;
    }

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PANEL.DOMAIN_DETAIL(id));
      return response.data;
    } catch (error) {
      console.error('Get domain failed:', error);
      throw error;
    }
  },

  /**
   * Create new domain
   */
  create: async (domainData) => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock domain create', domainData);
      const newDomain = {
        id: Date.now(),
        ...domainData,
        cliente: 1, // Current user's client
        activo: true,
        status: 'pending',
        compliance_level: 'low',
        dmarc_policy: 'none',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_check: null,
        dns_records_count: 0,
        compliance_score: 0
      };
      return newDomain;
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PANEL.DOMAINS, domainData);
      return response.data;
    } catch (error) {
      console.error('Create domain failed:', error);
      throw error;
    }
  },

  /**
   * Update domain
   */
  update: async (id, domainData) => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock domain update', id, domainData);
      const domain = MOCK_DOMAINS.find(d => d.id === parseInt(id));
      if (!domain) {
        throw new Error('Domain not found');
      }
      return { ...domain, ...domainData, updated_at: new Date().toISOString() };
    }

    try {
      const response = await axiosInstance.put(API_ENDPOINTS.PANEL.DOMAIN_DETAIL(id), domainData);
      return response.data;
    } catch (error) {
      console.error('Update domain failed:', error);
      throw error;
    }
  },

  /**
   * Delete domain
   */
  delete: async (id) => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock domain delete', id);
      return { message: 'Domain deleted successfully' };
    }

    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.PANEL.DOMAIN_DETAIL(id));
      return response.data;
    } catch (error) {
      console.error('Delete domain failed:', error);
      throw error;
    }
  },

  /**
   * Get domain DNS records
   */
  getDNSRecords: async (id) => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock DNS records', id);
      return [
        {
          id: 1,
          domain: parseInt(id),
          type: 'DMARC',
          name: `_dmarc.${MOCK_DOMAINS.find(d => d.id === parseInt(id))?.nombre}`,
          value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com',
          ttl: 3600,
          status: 'valid',
          last_checked: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          domain: parseInt(id),
          type: 'SPF',
          name: MOCK_DOMAINS.find(d => d.id === parseInt(id))?.nombre,
          value: 'v=spf1 include:_spf.google.com ~all',
          ttl: 3600,
          status: 'valid',
          last_checked: '2024-01-15T10:30:00Z'
        }
      ];
    }

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PANEL.DOMAIN_DNS_RECORDS(id));
      return response.data;
    } catch (error) {
      console.error('Get DNS records failed:', error);
      throw error;
    }
  },

  /**
   * Check domain DNS configuration
   */
  checkDNS: async (id) => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock DNS check', id);
      return {
        domain_id: parseInt(id),
        status: 'completed',
        results: {
          dmarc: { found: true, valid: true, policy: 'quarantine' },
          spf: { found: true, valid: true, mechanisms: 2 },
          dkim: { found: true, valid: true, selectors: ['default'] }
        },
        compliance_score: 92,
        recommendations: [
          'Consider upgrading DMARC policy to reject',
          'Add DKIM key rotation schedule'
        ]
      };
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PANEL.DOMAIN_CHECK_DNS(id));
      return response.data;
    } catch (error) {
      console.error('DNS check failed:', error);
      throw error;
    }
  },

  /**
   * Get domain statistics
   */
  getStats: async () => {
    if (IS_DEV) {
      console.log('🔧 DEV MODE: Mock domain stats');
      return {
        total_domains: MOCK_DOMAINS.length,
        active_domains: MOCK_DOMAINS.filter(d => d.activo).length,
        protected_domains: MOCK_DOMAINS.filter(d => d.dmarc_policy !== 'none').length,
        average_compliance: 79.5,
        recent_checks: 15,
        issues_found: 3
      };
    }

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PANEL.DOMAIN_STATS);
      return response.data;
    } catch (error) {
      console.error('Get domain stats failed:', error);
      throw error;
    }
  }
};