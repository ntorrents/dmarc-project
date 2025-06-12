import { motion } from 'framer-motion'
import { Shield, Users, Globe, BarChart3, Settings, Bell, Plus, CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      title: 'Protected Domains',
      value: '3',
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

  const domains = [
    {
      name: 'example.com',
      status: 'protected',
      policy: 'quarantine',
      compliance: 92,
      lastCheck: '2 hours ago',
      emails: '1,234'
    },
    {
      name: 'mycompany.org',
      status: 'warning',
      policy: 'none',
      compliance: 67,
      lastCheck: '1 day ago',
      emails: '856'
    },
    {
      name: 'business.net',
      status: 'error',
      policy: 'none',
      compliance: 34,
      lastCheck: '3 days ago',
      emails: '432'
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
      message: 'SPF record needs attention',
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
      type: 'success',
      message: 'DKIM signature verified',
      domain: 'business.net',
      time: '3 days ago'
    }
  ]

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
      default:
        return <div className="w-4 h-4 bg-blue-500 rounded-full" />
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your email security overview.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </button>
              <button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Domain
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.title} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-lg mr-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">{stat.change}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Domains List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Domains</h2>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Manage All
                </button>
              </div>

              <div className="space-y-4">
                {domains.map((domain, index) => (
                  <div key={domain.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-primary-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(domain.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{domain.name}</h3>
                          <p className="text-sm text-gray-500">
                            Policy: <span className="font-medium">{domain.policy}</span> • 
                            {domain.emails} emails processed
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
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Compliance Score</span>
                        <span>{domain.compliance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            domain.compliance >= 80 ? 'bg-green-500' : 
                            domain.compliance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${domain.compliance}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Last check: {domain.lastCheck}</span>
                      <button className="text-primary-600 hover:text-primary-700 font-medium">
                        View Details
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
            {/* Quick Actions Card */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-primary-50 hover:border-primary-200 transition-all duration-200 group">
                  <div className="flex items-center">
                    <Plus className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-gray-900">Add New Domain</p>
                      <p className="text-sm text-gray-500">Protect another domain</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-primary-50 hover:border-primary-200 transition-all duration-200 group">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-gray-900">View Reports</p>
                      <p className="text-sm text-gray-500">Detailed analytics</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-primary-50 hover:border-primary-200 transition-all duration-200 group">
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
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.domain} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All Activity
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard