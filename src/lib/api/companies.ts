import axiosInstance from '../axios'
import { API_ENDPOINTS } from '../constants'
import { sanitizeInput, validateEmail } from '../helpers'

export interface Company {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  website?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateCompanyData {
  name: string
  email: string
  phone?: string
  address?: string
  website?: string
}

export const companiesAPI = {
  get: async (): Promise<Company> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION)
    return response.data
  },

  update: async (data: UpdateCompanyData): Promise<Company> => {
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