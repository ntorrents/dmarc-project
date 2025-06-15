// Input validation and sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/
  return domainRegex.test(domain)
}

// Date formatting
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Status helpers
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'protected':
    case 'success':
      return 'text-green-600'
    case 'warning':
      return 'text-yellow-600'
    case 'error':
    case 'fail':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'protected':
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
    case 'fail':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Compliance score helpers
export const getComplianceColor = (score: number): string => {
  if (score >= 85) return 'text-green-600'
  if (score >= 75) return 'text-green-500'
  if (score >= 65) return 'text-yellow-500'
  if (score >= 50) return 'text-orange-500'
  return 'text-red-500'
}

export const getComplianceLevel = (score: number): string => {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

// Error handling
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Local storage helpers
export const getStoredValue = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export const setStoredValue = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error storing value:', error)
  }
}

export const removeStoredValue = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing stored value:', error)
  }
}