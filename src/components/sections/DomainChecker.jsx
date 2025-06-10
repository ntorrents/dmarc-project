import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle, XCircle, AlertCircle, Loader2, X, Shield, Mail, Lock, TrendingUp, AlertTriangle } from 'lucide-react'
import { checkDMARC } from '../../utils/dmarcChecker'
import { calculateEmailSecurityScore } from '../../utils/emailSecurityScorer'

const DomainChecker = () => {
  const [domain, setDomain] = useState('')
  const [result, setResult] = useState(null)
  const [securityScore, setSecurityScore] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!domain.trim()) return

    setIsLoading(true)
    setResult(null)
    setSecurityScore(null)

    try {
      const analysisResult = await checkDMARC(domain.trim())
      setResult(analysisResult)
      
      // Calculate security score
      const scoreData = calculateEmailSecurityScore(analysisResult)
      setSecurityScore(scoreData)
    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to analyze domain. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const closeResult = () => {
    setResult(null)
    setSecurityScore(null)
  }

  const getResultIcon = () => {
    switch (result?.status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />
      default:
        return null
    }
  }

  const getResultStyles = () => {
    switch (result?.status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
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
            DMARC Record Checker
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your domain to get an instant analysis of your current DMARC configuration 
            and receive recommendations for improvement.
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
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Domain'
                )}
              </button>
            </div>
          </form>

          {/* Enhanced Results with Security Score */}
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
                      Risk Assessment Level: {securityScore.riskLevel}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Grade:</span>
                      <span className="text-2xl font-bold">{securityScore.grade}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed">
                    {securityScore.riskLevel === 'Low' && 
                      'Domains with a low security risk level have minimal or no significant authentication issues, ensuring robust protection against email-based threats, but periodic monitoring is advisable to stay ahead of emerging risks.'
                    }
                    {securityScore.riskLevel === 'Medium' && 
                      'Domains with medium risk have some authentication gaps that should be addressed to improve email security. While basic protection is in place, there are opportunities for enhancement.'
                    }
                    {securityScore.riskLevel === 'High' && 
                      'Domains with high security risk have significant authentication issues that require immediate attention. Your domain is vulnerable to spoofing and phishing attacks.'
                    }
                  </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          {securityScore.breakdown.dmarc.score}/40
                        </div>
                        <div className="text-sm text-gray-600">
                          Domain-based Message Authentication
                        </div>
                      </div>
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
                          {securityScore.breakdown.spf.score}/30
                        </div>
                        <div className="text-sm text-gray-600">
                          Sender Policy Framework
                        </div>
                      </div>
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
                          {securityScore.breakdown.dkim.score}/30
                        </div>
                        <div className="text-sm text-gray-600">
                          DomainKeys Identified Mail
                        </div>
                      </div>
                      {securityScore.breakdown.dkim.issues.length > 0 && (
                        <div className="text-xs text-orange-600 mt-2">
                          {securityScore.breakdown.dkim.issues[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DMARC Record Details */}
                  {result.status === 'success' && result.record && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">DMARC Record Found:</h4>
                      <code className="text-sm font-mono bg-green-100 px-2 py-1 rounded text-green-700 break-all">
                        {result.record}
                      </code>
                    </div>
                  )}

                  {/* Recommendations */}
                  {securityScore.recommendations.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Recommendations for Improvement:
                      </h4>
                      <ul className="space-y-2 text-sm text-blue-700">
                        {securityScore.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button className="btn-primary flex-1">
                      Start DMARC Journey
                    </button>
                    <button className="btn-outline flex-1">
                      Get Detailed Report
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Simple Result (fallback for errors) */}
            {result && !securityScore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-xl border-2 p-6 ${getResultStyles()}`}
              >
                <button
                  onClick={closeResult}
                  className="absolute top-4 right-4 p-1 hover:bg-black/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getResultIcon()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Analysis Results for {domain}
                    </h3>
                    <p className="leading-relaxed">{result.message}</p>
                    
                    {result.recommendations && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Recommendations:</h4>
                        <ul className="space-y-1 text-sm">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-primary-600 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
              <h3 className="font-semibold text-gray-900 mb-2">DMARC</h3>
              <p className="text-sm text-gray-600">
                Domain-based Message Authentication, Reporting & Conformance
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">SPF</h3>
              <p className="text-sm text-gray-600">
                Sender Policy Framework for email authentication
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">DKIM</h3>
              <p className="text-sm text-gray-600">
                DomainKeys Identified Mail for message integrity
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default DomainChecker