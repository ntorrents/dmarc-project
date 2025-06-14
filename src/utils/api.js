// API utility functions with proper error handling and security
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

class APIError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
  }
}

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Create headers with authentication
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// Generic API request function with error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: createHeaders(options.auth !== false),
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      )
    }

    // Handle empty responses
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError('Network error', 0, { originalError: error })
  }
}

// Input validation and sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateDomain = (domain) => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/
  return domainRegex.test(domain)
}

// API functions
export const api = {
  // Authentication
  auth: {
    login: async (credentials) => {
      const sanitizedCredentials = {
        email: sanitizeInput(credentials.email),
        password: credentials.password // Don't sanitize passwords
      }
      
      if (!validateEmail(sanitizedCredentials.email)) {
        throw new APIError('Invalid email format', 400)
      }
      
      return apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(sanitizedCredentials),
        auth: false
      })
    },
    
    profile: {
      get: () => apiRequest('/auth/profile/'),
      update: (data) => {
        const sanitizedData = {
          name: sanitizeInput(data.name),
          email: sanitizeInput(data.email),
          ...(data.password && { password: data.password })
        }
        
        if (!validateEmail(sanitizedData.email)) {
          throw new APIError('Invalid email format', 400)
        }
        
        return apiRequest('/auth/profile/', {
          method: 'PUT',
          body: JSON.stringify(sanitizedData)
        })
      }
    }
  },

  // Domains
  domains: {
    list: (filters = {}) => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, sanitizeInput(value.toString()))
      })
      
      const queryString = params.toString()
      return apiRequest(`/domains/${queryString ? `?${queryString}` : ''}`)
    },
    
    get: (id) => apiRequest(`/domains/${id}/`),
    
    create: (domainData) => {
      const sanitizedData = {
        name: sanitizeInput(domainData.name),
        tag: sanitizeInput(domainData.tag || ''),
        description: sanitizeInput(domainData.description || '')
      }
      
      if (!validateDomain(sanitizedData.name)) {
        throw new APIError('Invalid domain format', 400)
      }
      
      return apiRequest('/domains/', {
        method: 'POST',
        body: JSON.stringify(sanitizedData)
      })
    },
    
    update: (id, data) => {
      const sanitizedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = sanitizeInput(data[key])
        return acc
      }, {})
      
      return apiRequest(`/domains/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(sanitizedData)
      })
    },
    
    delete: (id) => apiRequest(`/domains/${id}/`, { method: 'DELETE' }),
    
    stats: (id) => apiRequest(`/domains/${id}/stats/`)
  },

  // Users
  users: {
    list: () => apiRequest('/users/'),
    
    update: (id, data) => {
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
        role: sanitizeInput(data.role)
      }
      
      if (!validateEmail(sanitizedData.email)) {
        throw new APIError('Invalid email format', 400)
      }
      
      if (!['admin', 'user'].includes(sanitizedData.role)) {
        throw new APIError('Invalid role', 400)
      }
      
      return apiRequest(`/users/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(sanitizedData)
      })
    }
  },

  // Organization
  organization: {
    get: () => apiRequest('/organization/'),
    
    update: (data) => {
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
        phone: sanitizeInput(data.phone || ''),
        address: sanitizeInput(data.address || '')
      }
      
      if (!validateEmail(sanitizedData.email)) {
        throw new APIError('Invalid email format', 400)
      }
      
      return apiRequest('/organization/', {
        method: 'PUT',
        body: JSON.stringify(sanitizedData)
      })
    }
  }
}

export { APIError, validateEmail, validateDomain, sanitizeInput }