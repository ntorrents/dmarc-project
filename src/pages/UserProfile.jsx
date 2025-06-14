import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Building, Save, Eye, EyeOff, Shield } from 'lucide-react'
import { api, APIError, validateEmail, sanitizeInput } from '../utils/api'

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [organization, setOrganization] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock data for development
        setTimeout(() => {
          setProfile({
            name: localStorage.getItem('userName') || 'John Doe',
            email: localStorage.getItem('userEmail') || 'john@example.com',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
          
          setOrganization({
            name: 'Example Corp',
            email: 'contact@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Business St, City, State 12345'
          })
          
          setIsAdmin(true) // Mock admin status
          setLoading(false)
        }, 1000)
        return
      }
      
      // Production API calls
      const [profileData, orgData] = await Promise.all([
        api.auth.profile.get(),
        api.organization.get().catch(() => null) // Only admins can access this
      ])
      
      setProfile({
        name: profileData.name,
        email: profileData.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      if (orgData) {
        setOrganization(orgData)
        setIsAdmin(true)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError(err instanceof APIError ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }))
    
    if (error) setError(null)
    if (success) setSuccess('')
  }

  const handleOrganizationChange = (field, value) => {
    setOrganization(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }))
    
    if (error) setError(null)
    if (success) setSuccess('')
  }

  const handleSaveProfile = async () => {
    try {
      setError(null)
      setSaving(true)
      
      // Validation
      if (!profile.name.trim() || !profile.email.trim()) {
        setError('Name and email are required')
        return
      }
      
      if (!validateEmail(profile.email)) {
        setError('Please enter a valid email address')
        return
      }
      
      // Password validation if changing password
      if (profile.newPassword) {
        if (!profile.currentPassword) {
          setError('Current password is required to set a new password')
          return
        }
        
        if (profile.newPassword.length < 8) {
          setError('New password must be at least 8 characters long')
          return
        }
        
        if (profile.newPassword !== profile.confirmPassword) {
          setError('New passwords do not match')
          return
        }
      }
      
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock save
        localStorage.setItem('userName', profile.name)
        localStorage.setItem('userEmail', profile.email)
        setSuccess('Profile updated successfully!')
        
        // Clear password fields
        setProfile(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
        return
      }
      
      // Production API call
      const updateData = {
        name: profile.name,
        email: profile.email
      }
      
      if (profile.newPassword) {
        updateData.currentPassword = profile.currentPassword
        updateData.password = profile.newPassword
      }
      
      await api.auth.profile.update(updateData)
      
      setSuccess('Profile updated successfully!')
      
      // Clear password fields
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (err) {
      console.error('Error saving profile:', err)
      setError(err instanceof APIError ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveOrganization = async () => {
    try {
      setError(null)
      setSaving(true)
      
      // Validation
      if (!organization.name.trim() || !organization.email.trim()) {
        setError('Organization name and email are required')
        return
      }
      
      if (!validateEmail(organization.email)) {
        setError('Please enter a valid organization email address')
        return
      }
      
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock save
        setSuccess('Organization settings updated successfully!')
        return
      }
      
      // Production API call
      await api.organization.update(organization)
      setSuccess('Organization settings updated successfully!')
    } catch (err) {
      console.error('Error saving organization:', err)
      setError(err instanceof APIError ? err.message : 'Failed to update organization settings')
    } finally {
      setSaving(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 pt-20"
    >
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </motion.div>

        {/* Success/Error Messages */}
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
            }`}
          >
            <p className={error ? 'text-red-800' : 'text-green-800'}>
              {error || success}
            </p>
            {error && (
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Personal Information
            </h2>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                
                {/* Current Password */}
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="currentPassword"
                      value={profile.currentPassword}
                      onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                      className="input-field pl-10 pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      value={profile.newPassword}
                      onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                      className="input-field pl-10 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      value={profile.confirmPassword}
                      onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                      className="input-field pl-10 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Organization Settings (Admin Only) */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="w-6 h-6 mr-2" />
                Organization Settings
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin Only
                </span>
              </h2>

              <div className="space-y-6">
                {/* Organization Name */}
                <div>
                  <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="orgName"
                    value={organization.name}
                    onChange={(e) => handleOrganizationChange('name', e.target.value)}
                    className="input-field"
                    placeholder="Enter organization name"
                  />
                </div>

                {/* Organization Email */}
                <div>
                  <label htmlFor="orgEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="orgEmail"
                      value={organization.email}
                      onChange={(e) => handleOrganizationChange('email', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter organization email"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="orgPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="orgPhone"
                    value={organization.phone}
                    onChange={(e) => handleOrganizationChange('phone', e.target.value)}
                    className="input-field"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="orgAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="orgAddress"
                    value={organization.address}
                    onChange={(e) => handleOrganizationChange('address', e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Enter organization address"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveOrganization}
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Organization
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default UserProfile