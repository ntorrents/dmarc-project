import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { UserProfile, LoginCredentials } from '../lib/api/auth'

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (credentials: LoginCredentials) => Promise<any>
  logout: () => Promise<void>
  updateProfile: (data: any) => Promise<UserProfile>
  checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}