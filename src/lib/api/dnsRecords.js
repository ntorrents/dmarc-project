import axiosInstance from '../axios'
import { API_ENDPOINTS, DNS_RECORD_TYPES } from '../constants'

export const dnsRecordsAPI = {
  list: async (domainId) => {
    const params = domainId ? `?domain=${domainId}` : ''
    const response = await axiosInstance.get(`${API_ENDPOINTS.DNS_RECORDS}${params}`)
    return response.data
  },

  get: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.DNS_RECORDS}${id}/`)
    return response.data
  },

  create: async (data) => {
    if (!Object.values(DNS_RECORD_TYPES).includes(data.type)) {
      throw new Error('Invalid DNS record type')
    }
    
    const response = await axiosInstance.post(API_ENDPOINTS.DNS_RECORDS, data)
    return response.data
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.DNS_RECORDS}${id}/`, data)
    return response.data
  },

  delete: async (id) => {
    await axiosInstance.delete(`${API_ENDPOINTS.DNS_RECORDS}${id}/`)
  },

  validate: async (id) => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.DNS_RECORDS}${id}/validate/`)
    return response.data
  }
}