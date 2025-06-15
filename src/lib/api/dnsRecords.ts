import axiosInstance from '../axios'
import { API_ENDPOINTS, DNS_RECORD_TYPES } from '../constants'

export interface DNSRecord {
  id: number
  domain: number
  type: string
  value: string
  status: string
  lastChecked: string
  isValid: boolean
  errors?: string[]
  warnings?: string[]
}

export interface CreateDNSRecordData {
  domain: number
  type: string
  value: string
}

export interface UpdateDNSRecordData {
  value: string
}

export const dnsRecordsAPI = {
  list: async (domainId?: number): Promise<DNSRecord[]> => {
    const params = domainId ? `?domain=${domainId}` : ''
    const response = await axiosInstance.get(`${API_ENDPOINTS.DNS_RECORDS}${params}`)
    return response.data
  },

  get: async (id: number): Promise<DNSRecord> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.DNS_RECORDS}${id}/`)
    return response.data
  },

  create: async (data: CreateDNSRecordData): Promise<DNSRecord> => {
    if (!Object.values(DNS_RECORD_TYPES).includes(data.type as any)) {
      throw new Error('Invalid DNS record type')
    }
    
    const response = await axiosInstance.post(API_ENDPOINTS.DNS_RECORDS, data)
    return response.data
  },

  update: async (id: number, data: UpdateDNSRecordData): Promise<DNSRecord> => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.DNS_RECORDS}${id}/`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.DNS_RECORDS}${id}/`)
  },

  validate: async (id: number): Promise<DNSRecord> => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.DNS_RECORDS}${id}/validate/`)
    return response.data
  }
}