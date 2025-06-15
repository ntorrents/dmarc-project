import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Shield, Save, Plus, Trash2, Edit3, Check, X } from 'lucide-react'
import { usersAPI } from '../lib/api/users'
import { validateEmail, sanitizeInput, getErrorMessage } from '../lib/helpers'

const Settings = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock data for development
        setTimeout(() => {
          setUsers([
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              role: 'admin',
              lastLogin: '2024-01-15T10:30:00Z',
              status: 'active'
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
              role: 'user',
              lastLogin: '2024-01-14T15:45:00Z',
              status: 'active'
            },
            {
              id: 3,
              name: 'Bob Wilson',
              email: 'bob@example.com',
              role: 'user',
              lastLogin: '2024-01-12T09:15:00Z',
              status: 'active'
            }
          ])
          setLoading(false)
        }, 1000)
        return
      }
      
      const data = await usersAPI.list()
      setUsers(data)
    } catch (err) {
      console.error('Error loading users:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user) => {
    setEditingUser({ ...user })
  }

  const handleSaveUser = async () => {
    try {
      if (!editingUser.name.trim() || !editingUser.email.trim()) {
        setError('Name and email are required')
        return
      }

      if (!validateEmail(editingUser.email)) {
        setError('Please enter a valid email address')
        return
      }

      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock update
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? editingUser : user
        ))
        setEditingUser(null)
        setError(null)
        return
      }

      await usersAPI.update(editingUser.id, {
        name: sanitizeInput(editingUser.name),
        email: sanitizeInput(editingUser.email),
        role: editingUser.role
      })

      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? editingUser : user
      ))
      setEditingUser(null)
      setError(null)
    } catch (err) {
      console.error('Error updating user:', err)
      setError(getErrorMessage(err))
    }
  }

  const handleAddUser = async () => {
    try {
      if (!newUser.name.trim() || !newUser.email.trim()) {
        setError('Name and email are required')
        return
      }

      if (!validateEmail(newUser.email)) {
        setError('Please enter a valid email address')
        return
      }

      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock add
        const user = {
          id: Date.now(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          lastLogin: null,
          status: 'pending'
        }
        setUsers(prev => [...prev, user])
        setNewUser({ name: '', email: '', role: 'user' })
        setShowAddUser(false)
        setError(null)
        return
      }

      const user = await usersAPI.create({
        name: sanitizeInput(newUser.name),
        email: sanitizeInput(newUser.email),
        role: newUser.role
      })

      setUsers(prev => [...prev, user])
      setNewUser({ name: '', email: '', role: 'user' })
      setShowAddUser(false)
      setError(null)
    } catch (err) {
      console.error('Error adding user:', err)
      setError(getErrorMessage(err))
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to remove this user?')) {
      return
    }

    try {
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock delete
        setUsers(prev => prev.filter(user => user.id !== userId))
        return
      }

      await usersAPI.delete(userId)
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(getErrorMessage(err))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleBadge = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800'
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage users and account settings</p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              User Management
            </h2>
            <button
              onClick={() => setShowAddUser(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-4">
                <button onClick={handleAddUser} className="btn-primary">
                  <Check className="w-4 h-4 mr-2" />
                  Add User
                </button>
                <button 
                  onClick={() => {
                    setShowAddUser(false)
                    setNewUser({ name: '', email: '', role: 'user' })
                  }}
                  className="btn-outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Login</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      {editingUser?.id === user.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingUser.name}
                            onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                            className="input-field text-sm"
                          />
                          <input
                            type="email"
                            value={editingUser.email}
                            onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                            className="input-field text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                          className="input-field text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {editingUser?.id === user.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={handleSaveUser}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-4">Add your first user to get started.</p>
              <button
                onClick={() => setShowAddUser(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First User
              </button>
            </div>
          )}
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Account Settings
          </h2>

          <div className="space-y-6">
            {/* Security Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-outline">Enable</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Session Management</h4>
                    <p className="text-sm text-gray-600">Manage active sessions and devices</p>
                  </div>
                  <button className="btn-outline">Manage</button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Alerts</h4>
                    <p className="text-sm text-gray-600">Receive email notifications for security events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                    <p className="text-sm text-gray-600">Receive weekly summary reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Settings