import axiosInstance from '../axios'
import { API_ENDPOINTS } from '../constants'
import { sanitizeInput, validateDomain } from '../helpers'

export const domainsAPI = {
  list: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, sanitizeInput(value.toString()))
    })
    
    const queryString = params.toString()
    const response = await axiosInstance.get(`${API_ENDPOINTS.DOMAINS}${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  get: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.DOMAINS}${id}/`)
    return response.data
  },

  create: async (data) => {
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

  update: async (id, data) => {
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = sanitizeInput(data[key])
      return acc
    }, {})
    
    const response = await axiosInstance.put(`${API_ENDPOINTS.DOMAINS}${id}/`, sanitizedData)
    return response.data
  },

  delete: async (id) => {
    await axiosInstance.delete(`${API_ENDPOINTS.DOMAINS}${id}/`)
  },

  getStats: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.DOMAINS}${id}/stats/`)
    return response.data
  }
}