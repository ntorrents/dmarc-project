import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Globe, Tag, Calendar, Shield, AlertTriangle, CheckCircle, XCircle, BarChart3 } from 'lucide-react'
import { api, APIError } from '../utils/api'
import AddDomainModal from '../components/modals/AddDomainModal'
import { Link } from 'react-router-dom'

const MyDomains = () => {
  const [domains, setDomains] = useState([])
  const [filteredDomains, setFilteredDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddDomain, setShowAddDomain] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    tag: '',
    compliance: '',
    tld: '',
    policy: '',
    dateFrom: '',
    dateTo: ''
  })

  const complianceOptions = [
    { value: '', label: 'All Compliance Levels' },
    { value: 'high', label: 'High (80-100%)' },
    { value: 'medium', label: 'Medium (50-79%)' },
    { value: 'low', label: 'Low (0-49%)' }
  ]

  const policyOptions = [
    { value: '', label: 'All Policies' },
    { value: 'none', label: 'None' },
    { value: 'quarantine', label: 'Quarantine' },
    { value: 'reject', label: 'Reject' }
  ]

  useEffect(() => {
    loadDomains()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [domains, filters])

  const loadDomains = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock data for development
        setTimeout(() => {
          const mockDomains = [
            {
              id: 1,
              name: 'example.com',
              status: 'protected',
              policy: 'quarantine',
              compliance: 92,
              lastCheck: '2024-01-15T10:30:00Z',
              emails: 1234,
              tag: 'production',
              createdAt: '2024-01-01T00:00:00Z',
              tld: 'com'
            },
            {
              id: 2,
              name: 'mycompany.org',
              status: 'warning',
              policy: 'none',
              compliance: 67,
              lastCheck: '2024-01-14T15:45:00Z',
              emails: 856,
              tag: 'staging',
              createdAt: '2024-01-05T00:00:00Z',
              tld: 'org'
            },
            {
              id: 3,
              name: 'business.net',
              status: 'error',
              policy: 'none',
              compliance: 34,
              lastCheck: '2024-01-12T09:15:00Z',
              emails: 432,
              tag: 'development',
              createdAt: '2024-01-10T00:00:00Z',
              tld: 'net'
            },
            {
              id: 4,
              name: 'shop.io',
              status: 'protected',
              policy: 'reject',
              compliance: 98,
              lastCheck: '2024-01-15T11:00:00Z',
              emails: 2156,
              tag: 'ecommerce',
              createdAt: '2023-12-15T00:00:00Z',
              tld: 'io'
            }
          ]
          setDomains(mockDomains)
          setLoading(false)
        }, 1000)
        return
      }
      
      const data = await api.domains.list()
      setDomains(data)
    } catch (err) {
      console.error('Error loading domains:', err)
      setError(err instanceof APIError ? err.message : 'Failed to load domains')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...domains]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(domain =>
        domain.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        domain.tag.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Tag filter
    if (filters.tag) {
      filtered = filtered.filter(domain => domain.tag === filters.tag)
    }

    // Compliance filter
    if (filters.compliance) {
      filtered = filtered.filter(domain => {
        switch (filters.compliance) {
          case 'high':
            return domain.compliance >= 80
          case 'medium':
            return domain.compliance >= 50 && domain.compliance < 80
          case 'low':
            return domain.compliance < 50
          default:
            return true
        }
      })
    }

    // TLD filter
    if (filters.tld) {
      filtered = filtered.filter(domain => domain.tld === filters.tld)
    }

    // Policy filter
    if (filters.policy) {
      filtered = filtered.filter(domain => domain.policy === filters.policy)
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(domain => 
        new Date(domain.createdAt) >= new Date(filters.dateFrom)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(domain => 
        new Date(domain.createdAt) <= new Date(filters.dateTo)
      )
    }

    setFilteredDomains(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      tag: '',
      compliance: '',
      tld: '',
      policy: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  const handleAddDomain = async (domainData) => {
    try {
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        const newDomain = {
          id: Date.now(),
          name: domainData.name,
          status: 'warning',
          policy: 'none',
          compliance: 0,
          lastCheck: new Date().toISOString(),
          emails: 0,
          tag: domainData.tag || 'new',
          createdAt: new Date().toISOString(),
          tld: domainData.name.split('.').pop()
        }
        setDomains(prev => [...prev, newDomain])
        setShowAddDomain(false)
        return
      }
      
      const newDomain = await api.domains.create(domainData)
      setDomains(prev => [...prev, newDomain])
      setShowAddDomain(false)
    } catch (err) {
      console.error('Error adding domain:', err)
      throw err
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'protected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'protected':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getUniqueValues = (key) => {
    return [...new Set(domains.map(domain => domain[key]).filter(Boolean))]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading domains...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Domains</h1>
              <p className="text-gray-600 mt-1">Manage and monitor your protected domains</p>
            </div>
            <button 
              onClick={() => setShowAddDomain(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Domain
            </button>
          </div>
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
              onClick={loadDomains}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search domains..."
                />
              </div>
            </div>

            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <select
                value={filters.tag}
                onChange={(e) => handleFilterChange('tag', e.target.value)}
                className="input-field"
              >
                <option value="">All Tags</option>
                {getUniqueValues('tag').map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Compliance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compliance Level
              </label>
              <select
                value={filters.compliance}
                onChange={(e) => handleFilterChange('compliance', e.target.value)}
                className="input-field"
              >
                {complianceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* TLD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top Level Domain
              </label>
              <select
                value={filters.tld}
                onChange={(e) => handleFilterChange('tld', e.target.value)}
                className="input-field"
              >
                <option value="">All TLDs</option>
                {getUniqueValues('tld').map(tld => (
                  <option key={tld} value={tld}>.{tld}</option>
                ))}
              </select>
            </div>

            {/* Policy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DMARC Policy
              </label>
              <select
                value={filters.policy}
                onChange={(e) => handleFilterChange('policy', e.target.value)}
                className="input-field"
              >
                {policyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="input-field"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredDomains.length} of {domains.length} domains
          </p>
        </motion.div>

        {/* Domains Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredDomains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card hover:shadow-xl transition-all duration-300"
            >
              {/* Domain Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(domain.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{domain.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {domain.tag && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Tag className="w-3 h-3 mr-1" />
                          {domain.tag}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">.{domain.tld}</span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(domain.status)}`}>
                  {domain.status}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{domain.compliance}%</div>
                  <div className="text-xs text-gray-500">Compliance</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{domain.emails.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Emails</div>
                </div>
              </div>

              {/* Compliance Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Compliance Score</span>
                  <span>{domain.compliance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      domain.compliance >= 80 ? 'bg-green-500' : 
                      domain.compliance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${domain.compliance}%` }}
                  ></div>
                </div>
              </div>

              {/* Domain Info */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-between">
                  <span>DMARC Policy:</span>
                  <span className="font-medium">{domain.policy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Created:</span>
                  <span>{formatDate(domain.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Check:</span>
                  <span>{formatDate(domain.lastCheck)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  to={`/dashboard/domains/${domain.id}`}
                  className="flex-1 btn-primary text-center"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Details
                </Link>
                <button className="btn-outline">
                  <Shield className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredDomains.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-12"
          >
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {domains.length === 0 ? 'No domains yet' : 'No domains match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {domains.length === 0 
                ? 'Add your first domain to start protecting your email communications.'
                : 'Try adjusting your filters to see more results.'
              }
            </p>
            {domains.length === 0 && (
              <button 
                onClick={() => setShowAddDomain(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Domain
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Add Domain Modal */}
      {showAddDomain && (
        <AddDomainModal
          onClose={() => setShowAddDomain(false)}
          onAdd={handleAddDomain}
        />
      )}
    </motion.div>
  )
}

export default MyDomains