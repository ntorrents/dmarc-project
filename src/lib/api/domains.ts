import axiosInstance from '../axios'
import { API_ENDPOINTS } from '../constants'
import { sanitizeInput, validateDomain } from '../helpers'

export interface Domain {
  id: number
  name: string
  status: string
  policy: string
  compliance: number
  lastCheck: string
  emails: number
  tag?: string
  createdAt: string
  tld: string
  description?: string
}

export interface CreateDomainData {
  name: string
  tag?: string
  description?: string
}

export interface UpdateDomainData {
  name?: string
  tag?: string
  description?: string
}

export interface DomainStats {
  totalEmails: number
  blockedCount: number
  passedCount: number
  blockedEmails: {
    percentage: number
    trend: string
    data: any
  }
  dailyStats: Array<{
    date: string
    total: number
    blocked: number
    passed: number
  }>
}

export interface DomainFilters {
  search?: string
  tag?: string
  compliance?: string
  tld?: string
  policy?: string
  dateFrom?: string
  dateTo?: string
}

export const domainsAPI = {
  list: async (filters: DomainFilters = {}): Promise<Domain[]> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, sanitizeInput(value.toString()))
    })
    
    const queryString = params.toString()
    const response = await axiosInstance.get(`${API_ENDPOINTS.DOMAINS}${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  get: async (id: number): Promise<Domain> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.DOMAINS}${id}/`)
    return response.data
  },

  create: async (data: CreateDomainData): Promise<Domain> => {
    const sanitizedData = {
      name: sanitizeInput(data.name),
      tag: data.tag ? sanitizeInput(data.tag) : '',
      description: data.description ? sanitizeInput(data.description) : ''
    }
    
    if (!validateDomain(sanitizedData.name)) {
      throw new Error('Invalid domain format')
    }
    
    const response = await axiosInstance.post(API_ENDPOINTS.DOMAINS, sanitizedData)
    return response.data
  },

  update: async (id: number, data: UpdateDomainData): Promise<Domain> => {
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = sanitizeInput(data[key])
      return acc
    }, {} as any)
    
    const response = await axiosInstance.put(`${API_ENDPOINTS.DOMAINS}${id}/`, sanitizedData)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.DOMAINS}${id}/`)
  },

  getStats: async (id: number): Promise<DomainStats> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.DOMAINS}${id}/stats/`)
    return response.data
  }
}