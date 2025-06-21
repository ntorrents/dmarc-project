import axiosInstance from '../axios'
import { API_ENDPOINTS, USER_ROLES } from '../constants'
import { sanitizeInput, validateEmail } from '../helpers'

export const usersAPI = {
  list: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS)
    return response.data
  },

  create: async (data) => {
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      role: sanitizeInput(data.role)
    }
    
    if (!validateEmail(sanitizedData.email)) {
      throw new Error('Invalid email format')
    }
    
    if (!Object.values(USER_ROLES).includes(sanitizedData.role)) {
      throw new Error('Invalid role')
    }
    
    const response = await axiosInstance.post(API_ENDPOINTS.USERS, sanitizedData)
    return response.data
  },

  update: async (id, data) => {
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      role: sanitizeInput(data.role)
    }
    
    if (!validateEmail(sanitizedData.email)) {
      throw new Error('Invalid email format')
    }
    
    if (!Object.values(USER_ROLES).includes(sanitizedData.role)) {
      throw new Error('Invalid role')
    }
    
    const response = await axiosInstance.put(`${API_ENDPOINTS.USERS}${id}/`, sanitizedData)
    return response.data
  },

  delete: async (id) => {
    await axiosInstance.delete(`${API_ENDPOINTS.USERS}${id}/`)
  }
}