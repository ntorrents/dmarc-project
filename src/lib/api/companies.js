import axiosInstance from '../axios'
import { API_ENDPOINTS } from '../constants'
import { sanitizeInput, validateEmail } from '../helpers'

export const companiesAPI = {
  get: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION)
    return response.data
  },

  update: async (data) => {
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: data.phone ? sanitizeInput(data.phone) : '',
      address: data.address ? sanitizeInput(data.address) : '',
      website: data.website ? sanitizeInput(data.website) : ''
    }
    
    if (!validateEmail(sanitizedData.email)) {
      throw new Error('Invalid email format')
    }
    
    const response = await axiosInstance.put(API_ENDPOINTS.ORGANIZATION, sanitizedData)
    return response.data
  }
}