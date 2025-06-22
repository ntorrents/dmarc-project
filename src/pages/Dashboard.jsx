import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Globe, BarChart3, Settings, Bell, Plus, CheckCircle, AlertTriangle, XCircle, TrendingUp, Mail, Lock, Eye } from 'lucide-react'
import { domainsAPI } from '../lib/api/domains'
import { getErrorMessage } from '../lib/helpers'
import AddDomainModal from '../components/modals/AddDomainModal'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddDomain, setShowAddDomain] = useState(false)

  const stats = [
    {
      title: 'Protected Domains',
      value: domains.length.toString(),
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+1 this month'
    },
    {
      title: 'Active Users',
      value: '5',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+2 this week'
    },
    {
      title: 'DMARC Compliance',
      value: '87%',
      icon: Shield,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      change: '+5% this month'
    },
    {
      title: 'Threats Blocked',
      value: '142',
      icon: BarChart3,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: '+23 today'
    }
  ]

  const recentActivity = [
    {
      type: 'success',
      message: 'DMARC policy updated to quarantine',
      domain: 'example.com',
      time: '2 hours ago'
    },
    {
      type: 'warning',
      message: 'SPF record alignment issue detected',
      domain: 'mycompany.org',
      time: '1 day ago'
    },
    {
      type: 'info',
      message: 'New user added to account',
      domain: 'john@example.com',
      time: '2 days ago'
    },
    {
      type: 'error',
      message: 'DKIM signature validation failed',
      domain: 'business.net',
      time: '3 days ago'
    }
  ]

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock data for development
        setTimeout(() => {
          setDomains([
            {
              id: 1,
              name: 'example.com',
              status: 'protected',
              policy: 'quarantine',
              compliance: 92,
              lastCheck: '2 hours ago',
              emails: '1,234',
              tag: 'production'
            },
            {
              id: 2,
              name: 'mycompany.org',
              status: 'warning',
              policy: 'none',
              compliance: 67,
              lastCheck: '1 day ago',
              emails: '856',
              tag: 'staging'
            },
            {
              id: 3,
              name: 'business.net',
              status: 'error',
              policy: 'none',
              compliance: 34,
              lastCheck: '3 days ago',
              emails: '432',
              tag: 'development'
            },
            {
              id: 4,
              name: 'shop.io',
              status: 'protected',
              policy: 'reject',
              compliance: 98,
              lastCheck: '1 hour ago',
              emails: '2,156',
              tag: 'ecommerce'
            },
            {
              id: 5,
              name: 'blog.com',
              status: 'warning',
              policy: 'quarantine',
              compliance: 75,
              lastCheck: '3 hours ago',
              emails: '543',
              tag: 'content'
            }
          ])
          setLoading(false)
        }, 1000)
        return
      }
      
      // Production API call
      const data = await domainsAPI.list()
      setDomains(data)
    } catch (err) {
      console.error('Error loading domains:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleAddDomain = async (domainData) => {
    try {
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock domain creation
        const newDomain = {
          id: Date.now(),
          name: domainData.name,
          status: 'warning',
          policy: 'none',
          compliance: 0,
          lastCheck: 'Just added',
          emails: '0',
          tag: domainData.tag || 'new'
        }
        setDomains(prev => [...prev, newDomain])
        setShowAddDomain(false)
        return
      }
      
      // Production API call
      const newDomain = await domainsAPI.create(domainData)
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

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'info':
        return <Users className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  // Calculate DMARC policy distribution
  const getPolicyDistribution = () => {
    const policyCount = {
      reject: 0,
      quarantine: 0,
      none: 0,
      'no record': 0,
      invalid: 0
    }

    domains.forEach(domain => {
      if (domain.policy && ['reject', 'quarantine', 'none'].includes(domain.policy)) {
        policyCount[domain.policy]++
      } else if (domain.status === 'error') {
        policyCount['no record']++
      } else {
        policyCount['invalid']++
      }
    })

    return policyCount
  }

  const policyDistribution = getPolicyDistribution()
  
  const doughnutData = {
    labels: ['Reject', 'Quarantine', 'None', 'No Record', 'Invalid'],
    datasets: [
      {
        data: [
          policyDistribution.reject,
          policyDistribution.quarantine,
          policyDistribution.none,
          policyDistribution['no record'],
          policyDistribution.invalid
        ],
        backgroundColor: [
          '#10b981', // green for reject (best)
          '#f59e0b', // yellow for quarantine (medium)
          '#ef4444', // red for none (poor)
          '#6b7280', // gray for no record
          '#dc2626'  // dark red for invalid
        ],
        borderColor: [
          '#059669',
          '#d97706',
          '#dc2626',
          '#4b5563',
          '#b91c1c'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
            return `${label}: ${value} domains (${percentage}%)`
          }
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-primary rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, {localStorage.getItem('userName') || 'User'}!
                </h1>
                <p className="text-primary-100">
                  Here's your email security overview for today
                </p>
              </div>
              <div className="hidden md:block">
                <Shield className="w-16 h-16 text-primary-200" />
              </div>
            </div>
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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.title} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Domains Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Domain Protection Status</h2>
                <button 
                  onClick={() => setShowAddDomain(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Domain
                </button>
              </div>

              <div className="space-y-4">
                {domains.map((domain, index) => (
                  <div key={domain.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(domain.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{domain.name}</h3>
                          <p className="text-sm text-gray-500">
                            Policy: {domain.policy} • {domain.emails} emails processed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(domain.status)}`}>
                          {domain.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">{domain.compliance}% compliant</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
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

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last check: {domain.lastCheck}</span>
                      <button className="text-primary-600 hover:text-primary-700 font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* DMARC Policy Distribution Chart */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">DMARC Policy Distribution</h2>
              <div className="h-64">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="mb-2">Policy breakdown across {domains.length} domains:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Reject (Secure)
                    </span>
                    <span>{policyDistribution.reject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      Quarantine
                    </span>
                    <span>{policyDistribution.quarantine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      None (Monitor)
                    </span>
                    <span>{policyDistribution.none}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                      No Record
                    </span>
                    <span>{policyDistribution['no record']}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowAddDomain(true)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center">
                    <Plus className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-gray-900">Add New Domain</p>
                      <p className="text-sm text-gray-500">Protect another domain</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-gray-900">View Reports</p>
                      <p className="text-sm text-gray-500">Detailed analytics</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-gray-900">Account Settings</p>
                      <p className="text-sm text-gray-500">Manage your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.domain} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All Activity →
              </button>
            </div>
          </motion.div>
        </div>
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

export default Dashboard