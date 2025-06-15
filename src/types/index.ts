// User types
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  lastLogin?: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  updatedAt: string
}

// Domain types
export interface Domain {
  id: number
  name: string
  status: 'protected' | 'warning' | 'error'
  policy: 'none' | 'quarantine' | 'reject'
  compliance: number
  lastCheck: string
  emails: number
  tag?: string
  createdAt: string
  tld: string
  description?: string
}

// DNS Record types
export interface DNSRecord {
  id: number
  domain: number
  type: 'DMARC' | 'SPF' | 'DKIM'
  value: string
  status: 'valid' | 'invalid' | 'warning' | 'pending'
  lastChecked: string
  isValid: boolean
  errors?: string[]
  warnings?: string[]
}

// Company/Organization types
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

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next?: string
  previous?: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupForm {
  firstName: string
  lastName: string
  email: string
  company: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  subscribeNewsletter?: boolean
}

export interface DomainForm {
  name: string
  tag?: string
  description?: string
}

export interface UserForm {
  name: string
  email: string
  role: 'admin' | 'user'
}

// Filter types
export interface DomainFilters {
  search?: string
  tag?: string
  compliance?: 'high' | 'medium' | 'low'
  tld?: string
  policy?: 'none' | 'quarantine' | 'reject'
  dateFrom?: string
  dateTo?: string
}

// Statistics types
export interface DomainStats {
  totalEmails: number
  blockedCount: number
  passedCount: number
  blockedEmails: {
    percentage: number
    trend: 'up' | 'down'
    data: ChartData
  }
  dailyStats: DailyStats[]
}

export interface DailyStats {
  date: string
  total: number
  blocked: number
  passed: number
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
  tension?: number
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// Error types
export interface ApiError {
  message: string
  status: number
  data?: any
}