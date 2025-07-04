import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Mail, Lock, BarChart3, Calendar, Globe, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { domainsAPI } from '../lib/api/domains'
import { getErrorMessage } from '../lib/helpers'
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
      
      console.log('Loading domain data for ID:', id)
      
      // Get domain details from API
      const domainData = await domainsAPI.get(id)
      console.log('Domain data received:', domainData)
      
      // Transform API data to match UI expectations
      const transformedDomain = {
        id: domainData.id,
        name: domainData.nombre || domainData.name,
        status: mapDomainStatus(domainData.status, domainData.compliance_level),
        policy: domainData.dmarc_policy || 'none',
        compliance: domainData.compliance_score || 0,
        lastCheck: domainData.last_check || new Date().toISOString(),
        emails: domainData.email_count || 0,
        tag: Array.isArray(domainData.tags) ? domainData.tags[0] : (domainData.tag || 'untagged'),
        createdAt: domainData.created_at || new Date().toISOString(),
        tld: extractTLD(domainData.nombre || domainData.name),
        description: domainData.description || `Email security monitoring for ${domainData.nombre || domainData.name}`
      }

      // Generate mock stats based on domain data
      const mockStats = generateMockStats(transformedDomain)

      setDomain(transformedDomain)
      setStats(mockStats)
    } catch (err) {
      console.error('Error loading domain data:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // Helper function to map domain status
  const mapDomainStatus = (status, complianceLevel) => {
    if (status === 'active' && complianceLevel === 'high') return 'protected'
    if (status === 'active' && complianceLevel === 'medium') return 'warning'
    if (status === 'active' && complianceLevel === 'low') return 'error'
    return status || 'error'
  }

  // Helper function to extract TLD
  const extractTLD = (domain) => {
    if (!domain) return 'com'
    const parts = domain.split('.')
    return parts[parts.length - 1] || 'com'
  }

  // Generate mock stats based on domain data
  const generateMockStats = (domainData) => {
    const baseEmails = domainData.emails || 1000
    const complianceScore = domainData.compliance || 50
    
    // Generate realistic blocked email percentage based on compliance
    const blockedPercentage = Math.max(5, Math.min(25, 30 - (complianceScore / 4)))
    const blockedCount = Math.floor(baseEmails * (blockedPercentage / 100))
    const passedCount = baseEmails - blockedCount

    return {
      blockedEmails: {
        percentage: blockedPercentage.toFixed(1),
        trend: complianceScore > 70 ? 'down' : 'up',
        data: {
          labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
          datasets: [{
            label: 'Blocked Emails %',
            data: generateTrendData(blockedPercentage, 7),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        }
      },
      totalEmails: baseEmails,
      blockedCount: blockedCount,
      passedCount: passedCount,
      dailyStats: generateDailyStats(baseEmails, blockedPercentage, 7)
    }
  }

  // Generate trend data with some variation
  const generateTrendData = (baseValue, days) => {
    const data = []
    for (let i = 0; i < days; i++) {
      const variation = (Math.random() - 0.5) * 4 // ±2% variation
      data.push(Math.max(0, baseValue + variation))
    }
    return data
  }

  // Generate daily stats
  const generateDailyStats = (totalEmails, blockedPercentage, days) => {
    const stats = []
    const dailyAverage = Math.floor(totalEmails / 7) // Weekly average
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const dailyTotal = dailyAverage + Math.floor((Math.random() - 0.5) * dailyAverage * 0.3)
      const dailyBlocked = Math.floor(dailyTotal * (blockedPercentage / 100))
      const dailyPassed = dailyTotal - dailyBlocked
      
      stats.push({
        date: date.toISOString().split('T')[0],
        total: dailyTotal,
        blocked: dailyBlocked,
        passed: dailyPassed
      })
    }
    
    return stats
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
                <p className="text-gray-600 mt-1">{domain.description}</p>
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