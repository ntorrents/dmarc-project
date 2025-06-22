import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle, XCircle, AlertCircle, Loader2, X, Shield, Mail, Lock, TrendingUp, AlertTriangle, Globe, Clock, Zap } from 'lucide-react'
import { checkEmailSecurity } from '../../utils/dnsResolver'
import { calculateEmailSecurityScore, generateActionPlan } from '../../utils/emailSecurityScorer'
import { validateDomain } from '../../lib/helpers'

const DomainChecker = () => {
  const [domain, setDomain] = useState('')
  const [result, setResult] = useState(null)
  const [securityScore, setSecurityScore] = useState(null)
  const [actionPlan, setActionPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!domain.trim()) return

    // Validate domain format
    if (!validateDomain(domain.trim())) {
      setError('Please enter a valid domain name (e.g., example.com)')
      return
    }

    setIsLoading(true)
    setResult(null)
    setSecurityScore(null)
    setActionPlan(null)
    setError('')

    try {
      // Perform real DNS checks
      const emailSecurityData = await checkEmailSecurity(domain.trim())
      
      // Calculate comprehensive security score
      const scoreData = calculateEmailSecurityScore(emailSecurityData)
      
      // Generate action plan
      const actions = generateActionPlan(scoreData)

      setResult(emailSecurityData)
      setSecurityScore(scoreData)
      setActionPlan(actions)
    } catch (error) {
      console.error('Domain analysis failed:', error)
      setError(error.message || 'Failed to analyze domain. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const closeResult = () => {
    setResult(null)
    setSecurityScore(null)
    setActionPlan(null)
    setError('')
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 75) return 'text-green-500'
    if (score >= 65) return 'text-yellow-500'
    if (score >= 50) return 'text-orange-500'
    return 'text-red-500'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getRiskBadgeStyles = (riskColor) => {
    switch (riskColor) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'orange':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Advanced DMARC Security Analyzer
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get a comprehensive real-time analysis of your domain's email security configuration 
            with DNS validation and expert recommendations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter your domain (e.g., example.com)"
                  className="input-field pr-12"
                  disabled={isLoading}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                type="submit"
                disabled={isLoading || !domain.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Analyze Domain
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-800">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Enhanced Results with Real DNS Data */}
          <AnimatePresence>
            {result && securityScore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Risk Assessment Header */}
                <div className={`relative rounded-xl border-2 p-6 ${getRiskBadgeStyles(securityScore.riskColor)}`}>
                  <button
                    onClick={closeResult}
                    className="absolute top-4 right-4 p-1 hover:bg-black/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Security Risk Level: {securityScore.riskLevel}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Grade:</span>
                      <span className="text-2xl font-bold">{securityScore.grade}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed mb-4">
                    {securityScore.summary}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Analyzed: {new Date(securityScore.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Real-time DNS validation</span>
                    </div>
                  </div>
                </div>

                {/* Overall Score and Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Security Analysis for {domain}
                    </h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Overall Score</div>
                      <div className={`text-3xl font-bold ${getScoreColor(securityScore.totalScore)}`}>
                        {securityScore.totalScore}/100
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* DMARC */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-primary-600" />
                          <h4 className="font-semibold text-gray-900">DMARC</h4>
                        </div>
                        {getStatusIcon(securityScore.breakdown.dmarc.status)}
                      </div>
                      <div className="mb-2">
                        <div className={`text-2xl font-bold ${getScoreColor(securityScore.breakdown.dmarc.score)}`}>
                          {securityScore.breakdown.dmarc.score}/{securityScore.breakdown.dmarc.maxScore}
                        </div>
                        <div className="text-sm text-gray-600">
                          Domain-based Message Authentication
                        </div>
                      </div>
                      {result.dmarc.found && securityScore.breakdown.dmarc.details && (
                        <div className="text-xs text-gray-600 mt-2">
                          Policy: {securityScore.breakdown.dmarc.details.policy || 'none'}
                          {securityScore.breakdown.dmarc.details.percentage !== 100 && (
                            <span> ({securityScore.breakdown.dmarc.details.percentage}%)</span>
                          )}
                        </div>
                      )}
                      {securityScore.breakdown.dmarc.issues.length > 0 && (
                        <div className="text-xs text-red-600 mt-2">
                          {securityScore.breakdown.dmarc.issues[0]}
                        </div>
                      )}
                    </div>

                    {/* SPF */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-5 h-5 text-primary-600" />
                          <h4 className="font-semibold text-gray-900">SPF</h4>
                        </div>
                        {getStatusIcon(securityScore.breakdown.spf.status)}
                      </div>
                      <div className="mb-2">
                        <div className={`text-2xl font-bold ${getScoreColor(securityScore.breakdown.spf.score)}`}>
                          {securityScore.breakdown.spf.score}/{securityScore.breakdown.spf.maxScore}
                        </div>
                        <div className="text-sm text-gray-600">
                          Sender Policy Framework
                        </div>
                      </div>
                      {result.spf.found && securityScore.breakdown.spf.details && (
                        <div className="text-xs text-gray-600 mt-2">
                          Policy: {securityScore.breakdown.spf.details.finalQualifier === '-' ? 'Strict' : 
                                   securityScore.breakdown.spf.details.finalQualifier === '~' ? 'Soft Fail' : 'Permissive'}
                        </div>
                      )}
                      {securityScore.breakdown.spf.issues.length > 0 && (
                        <div className="text-xs text-orange-600 mt-2">
                          {securityScore.breakdown.spf.issues[0]}
                        </div>
                      )}
                    </div>

                    {/* DKIM */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-5 h-5 text-primary-600" />
                          <h4 className="font-semibold text-gray-900">DKIM</h4>
                        </div>
                        {getStatusIcon(securityScore.breakdown.dkim.status)}
                      </div>
                      <div className="mb-2">
                        <div className={`text-2xl font-bold ${getScoreColor(securityScore.breakdown.dkim.score)}`}>
                          {securityScore.breakdown.dkim.score}/{securityScore.breakdown.dkim.maxScore}
                        </div>
                        <div className="text-sm text-gray-600">
                          DomainKeys Identified Mail
                        </div>
                      </div>
                      {result.dkim.length > 0 && securityScore.breakdown.dkim.details && (
                        <div className="text-xs text-gray-600 mt-2">
                          {result.dkim.length} selector{result.dkim.length > 1 ? 's' : ''} found
                          {securityScore.breakdown.dkim.details.keyLength > 0 && (
                            <span> ({securityScore.breakdown.dkim.details.keyLength}-bit)</span>
                          )}
                        </div>
                      )}
                      {securityScore.breakdown.dkim.issues.length > 0 && (
                        <div className="text-xs text-orange-600 mt-2">
                          {securityScore.breakdown.dkim.issues[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DNS Records Display */}
                  {result.dmarc.found && (
                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        DMARC Record Found:
                      </h4>
                      <code className="text-sm font-mono bg-green-100 px-2 py-1 rounded text-green-700 break-all block">
                        {result.dmarc.records[0].data}
                      </code>
                      <div className="text-xs text-green-600 mt-2">
                        Provider: {result.dmarc.provider} | TTL: {result.dmarc.records[0].ttl}s
                      </div>
                    </div>
                  )}

                  {result.spf.found && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        SPF Record Found:
                      </h4>
                      <code className="text-sm font-mono bg-blue-100 px-2 py-1 rounded text-blue-700 break-all block">
                        {result.spf.records[0].data}
                      </code>
                    </div>
                  )}

                  {result.dkim.length > 0 && (
                    <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        DKIM Records Found:
                      </h4>
                      {result.dkim.map((selector, index) => (
                        <div key={index} className="mb-2">
                          <div className="text-sm font-medium text-purple-700">
                            Selector: {selector.selector}
                          </div>
                          <code className="text-xs font-mono bg-purple-100 px-2 py-1 rounded text-purple-600 break-all block">
                            {selector.records[0].data.substring(0, 100)}...
                          </code>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Plan */}
                  {actionPlan && actionPlan.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Recommended Actions:
                      </h4>
                      <div className="space-y-3">
                        {actionPlan.slice(0, 2).map((action, index) => (
                          <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(action.priority)}`}>
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{action.title}</h5>
                              <span className="text-xs uppercase font-medium">{action.priority}</span>
                            </div>
                            <p className="text-sm mb-2">{action.description}</p>
                            <ul className="text-xs space-y-1">
                              {action.steps.slice(0, 2).map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="btn-primary flex-1">
                      <Shield className="w-4 h-4 mr-2" />
                      Start DMARC Journey
                    </button>
                    <button className="btn-outline flex-1">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Get Detailed Report
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time DNS</h3>
              <p className="text-sm text-gray-600">
                Live DNS validation using multiple authoritative sources
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Analysis</h3>
              <p className="text-sm text-gray-600">
                Comprehensive security scoring in seconds
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-sm text-gray-600">
                Actionable recommendations from security experts
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default DomainChecker