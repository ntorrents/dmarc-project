import axiosInstance from '../axios'
import { API_ENDPOINTS } from '../constants'
import { sanitizeInput, validateEmail } from '../helpers'

export interface LoginCredentials {
  email: string
  password: string
}

export interface UserProfile {
  id: number
  name: string
  email: string
  role: string
}

export interface UpdateProfileData {
  name: string
  email: string
  currentPassword?: string
  password?: string
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const sanitizedCredentials = {
      email: sanitizeInput(credentials.email),
      password: credentials.password // Don't sanitize passwords
    }
    
    if (!validateEmail(sanitizedCredentials.email)) {
      throw new Error('Invalid email format')
    }
    
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, sanitizedCredentials)
    return response.data
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE)
    return response.data
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      ...(data.currentPassword && { currentPassword: data.currentPassword }),
      ...(data.password && { password: data.password })
    }
    
    if (!validateEmail(sanitizedData.email)) {
      throw new Error('Invalid email format')
    }
    
    const response = await axiosInstance.put(API_ENDPOINTS.AUTH.PROFILE, sanitizedData)
    return response.data
  },

  logout: async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
    }
  }
}