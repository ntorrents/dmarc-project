import { useState, useEffect } from 'react'
import { authAPI, type LoginCredentials, type UserProfile } from '../lib/api/auth'
import { STORAGE_KEYS } from '../lib/constants'
import { getErrorMessage } from '../lib/helpers'

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      if (!token) {
        setLoading(false)
        return
      }

      const profile = await authAPI.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null)
      setLoading(true)

      const response = await authAPI.login(credentials)
      
      // Store auth data
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.access)
      localStorage.setItem(STORAGE_KEYS.USER_NAME, response.user?.name || credentials.email.split('@')[0])
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, credentials.email)

      // Set user state
      setUser(response.user)
      
      return response
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      // Clear storage is handled in authAPI.logout
    }
  }

  const updateProfile = async (data: any) => {
    try {
      setError(null)
      const updatedUser = await authAPI.updateProfile(data)
      setUser(updatedUser)
      
      // Update stored user info
      localStorage.setItem(STORAGE_KEYS.USER_NAME, updatedUser.name)
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, updatedUser.email)
      
      return updatedUser
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      throw error
    }
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    updateProfile,
    checkAuthStatus
  }
}