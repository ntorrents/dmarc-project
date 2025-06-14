import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Mail, Lock, BarChart3, Calendar, Globe, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { api, APIError } from '../utils/api'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const DomainDetail = () => {
  const { id } = useParams()
  const [domain, setDomain] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDomainData()
  }, [id])

  const loadDomainData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const isDev = import.meta.env.MODE === 'development'
      
      if (isDev) {
        // Mock data for development
        setTimeout(() => {
          const mockDomain = {
            id: parseInt(id),
            name: 'example.com',
            status: 'protected',
            policy: 'quarantine',
            compliance: 92,
            lastCheck: '2024-01-15T10:30:00Z',
            emails: 1234,
            tag: 'production',
            createdAt: '2024-01-01T00:00:00Z',
            tld: 'com',
            description: 'Main company domain for email communications'
          }

          const mockStats = {
            blockedEmails: {
              percentage: 15.2,
              trend: 'up',
              data: {
                labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
                datasets: [{
                  label: 'Blocked Emails %',
                  data: [12, 14, 13, 16, 15, 18, 15.2],
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  tension: 0.4
                }]
              }
            },
            totalEmails: 8456,
            blockedCount: 1285,
            passedCount: 7171,
            dailyStats: [
              { date: '2024-01-15', total: 1234, blocked: 187, passed: 1047 },
              { date: '2024-01-14', total: 1156, blocked: 173, passed: 983 },
              { date: '2024-01-13', total: 1089, blocked: 142, passed: 947 },
              { date: '2024-01-12', total: 1345, blocked: 201, passed: 1144 },
              { date: '2024-01-11', total: 1278, blocked: 192, passed: 1086 },
              { date: '2024-01-10', total: 1198, blocked: 179, passed: 1019 },
              { date: '2024-01-09', total: 1156, blocked: 211, passed: 945 }
            ]
          }

          setDomain(mockDomain)
          setStats(mockStats)
          setLoading(false)
        }, 1000)
        return
      }
      
      // Production API calls
      const [domainData, statsData] = await Promise.all([
        api.domains.get(id),
        api.domains.stats(id)
      ])
      
      setDomain(domainData)
      setStats(statsData)
    } catch (err) {
      console.error('Error loading domain data:', err)
      setError(err instanceof APIError ? err.message : 'Failed to load domain data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'protected':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blocked Emails Percentage Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%'
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
          <p className="text-gray-600">Loading domain details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Domain</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/dashboard/domains" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Domains
          </Link>
        </div>
      </div>
    )
  }

  if (!domain) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Domain Not Found</h2>
          <p className="text-gray-600 mb-4">The requested domain could not be found.</p>
          <Link to="/dashboard/domains" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Domains
          </Link>
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
          <Link 
            to="/dashboard/domains" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Domains
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(domain.status)}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{domain.name}</h1>
                <p className="text-gray-600 mt-1">{domain.description || 'Domain security overview'}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(domain.status)}`}>
              {domain.status}
            </span>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Compliance Score</h3>
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{domain.compliance}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  domain.compliance >= 80 ? 'bg-green-500' : 
                  domain.compliance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${domain.compliance}%` }}
              ></div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Emails</h3>
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalEmails?.toLocaleString() || domain.emails.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Last 7 days</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Blocked Emails</h3>
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-1" />
                {stats?.blockedEmails?.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.blockedEmails?.percentage || '15.2'}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {stats?.blockedCount?.toLocaleString() || '1,285'} emails
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">DMARC Policy</h3>
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 capitalize">{domain.policy}</div>
            <div className="text-sm text-gray-500 mt-1">Current setting</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Email Security Trends</h2>
              {stats?.blockedEmails?.data && (
                <div className="h-80">
                  <Line data={stats.blockedEmails.data} options={chartOptions} />
                </div>
              )}
            </div>
          </motion.div>

          {/* Domain Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Domain Details */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Domain Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">{domain.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TLD:</span>
                  <span className="font-medium">.{domain.tld}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tag:</span>
                  <span className="font-medium">{domain.tag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{formatDate(domain.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Check:</span>
                  <span className="font-medium">{formatDate(domain.lastCheck)}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {stats?.dailyStats?.slice(0, 5).map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {day.total.toLocaleString()} emails
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        {day.blocked} blocked
                      </div>
                      <div className="text-sm text-green-600">
                        {day.passed} passed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </button>
                <button className="w-full btn-outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Update Policy
                </button>
                <button className="w-full btn-outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Test Configuration
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default DomainDetail