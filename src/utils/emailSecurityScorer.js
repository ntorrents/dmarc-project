/**
 * Enhanced Email Security Scoring Algorithm
 * Comprehensive scoring system with real DNS validation
 */

import { calculateDMARCScore } from './dmarcValidator'
import { calculateSPFScore } from './spfValidator'
import { calculateDKIMScore } from './dkimValidator'

/**
 * Calculate comprehensive email security score with real DNS data
 */
export function calculateEmailSecurityScore(emailSecurityData) {
  const { dmarc, spf, dkim } = emailSecurityData

  // Calculate individual scores
  const dmarcResult = calculateDMARCScore(dmarc)
  const spfResult = calculateSPFScore(spf)
  const dkimResult = calculateDKIMScore(dkim)

  // Calculate total score
  const totalScore = dmarcResult.score + spfResult.score + dkimResult.score

  // Determine overall grade and risk level
  const { grade, riskLevel, riskColor } = calculateGradeAndRisk(totalScore)

  // Compile all recommendations
  const allRecommendations = [
    ...dmarcResult.recommendations,
    ...spfResult.recommendations,
    ...dkimResult.recommendations
  ].slice(0, 8) // Limit to top 8 recommendations

  // Compile all issues
  const allIssues = [
    ...dmarcResult.issues,
    ...spfResult.issues,
    ...dkimResult.issues
  ]

  return {
    totalScore,
    grade,
    riskLevel,
    riskColor,
    breakdown: {
      dmarc: {
        score: dmarcResult.score,
        maxScore: 40,
        status: dmarcResult.status,
        issues: dmarcResult.issues,
        recommendations: dmarcResult.recommendations,
        details: dmarcResult.parsed
      },
      spf: {
        score: spfResult.score,
        maxScore: 30,
        status: spfResult.status,
        issues: spfResult.issues,
        recommendations: spfResult.recommendations,
        details: spfResult.parsed
      },
      dkim: {
        score: dkimResult.score,
        maxScore: 30,
        status: dkimResult.status,
        issues: dkimResult.issues,
        recommendations: dkimResult.recommendations,
        details: dkimResult.parsed
      }
    },
    recommendations: allRecommendations,
    issues: allIssues,
    summary: generateSecuritySummary(totalScore, dmarcResult, spfResult, dkimResult),
    timestamp: new Date().toISOString()
  }
}

/**
 * Calculate grade and risk level based on total score
 */
function calculateGradeAndRisk(totalScore) {
  if (totalScore >= 90) {
    return { grade: 'A+', riskLevel: 'Very Low', riskColor: 'green' }
  } else if (totalScore >= 85) {
    return { grade: 'A', riskLevel: 'Low', riskColor: 'green' }
  } else if (totalScore >= 80) {
    return { grade: 'B+', riskLevel: 'Low', riskColor: 'green' }
  } else if (totalScore >= 75) {
    return { grade: 'B', riskLevel: 'Low', riskColor: 'yellow' }
  } else if (totalScore >= 70) {
    return { grade: 'C+', riskLevel: 'Medium', riskColor: 'yellow' }
  } else if (totalScore >= 65) {
    return { grade: 'C', riskLevel: 'Medium', riskColor: 'yellow' }
  } else if (totalScore >= 60) {
    return { grade: 'D+', riskLevel: 'Medium', riskColor: 'orange' }
  } else if (totalScore >= 55) {
    return { grade: 'D', riskLevel: 'High', riskColor: 'orange' }
  } else if (totalScore >= 50) {
    return { grade: 'E', riskLevel: 'High', riskColor: 'red' }
  } else {
    return { grade: 'F', riskLevel: 'Critical', riskColor: 'red' }
  }
}

/**
 * Generate security summary text
 */
function generateSecuritySummary(totalScore, dmarcResult, spfResult, dkimResult) {
  const summaryParts = []

  // Overall assessment
  if (totalScore >= 85) {
    summaryParts.push('Excellent email security configuration with strong authentication protocols in place.')
  } else if (totalScore >= 70) {
    summaryParts.push('Good email security foundation with some areas for improvement.')
  } else if (totalScore >= 50) {
    summaryParts.push('Basic email security measures present but significant gaps remain.')
  } else {
    summaryParts.push('Critical email security vulnerabilities detected requiring immediate attention.')
  }

  // DMARC assessment
  if (dmarcResult.score >= 35) {
    summaryParts.push('DMARC is properly configured and provides strong protection against domain spoofing.')
  } else if (dmarcResult.score >= 20) {
    summaryParts.push('DMARC is configured but could be strengthened for better protection.')
  } else if (dmarcResult.score > 0) {
    summaryParts.push('DMARC is present but provides minimal protection in its current configuration.')
  } else {
    summaryParts.push('No DMARC protection detected - domain is vulnerable to spoofing attacks.')
  }

  // SPF assessment
  if (spfResult.score >= 25) {
    summaryParts.push('SPF record is well-configured and helps prevent email spoofing.')
  } else if (spfResult.score >= 15) {
    summaryParts.push('SPF record exists but could be optimized for better security.')
  } else if (spfResult.score > 0) {
    summaryParts.push('SPF record needs significant improvements to provide adequate protection.')
  } else {
    summaryParts.push('No SPF record found - unauthorized servers can send email on behalf of your domain.')
  }

  // DKIM assessment
  if (dkimResult.score >= 25) {
    summaryParts.push('DKIM signing is properly implemented with strong cryptographic keys.')
  } else if (dkimResult.score >= 15) {
    summaryParts.push('DKIM is configured but key strength or configuration could be improved.')
  } else if (dkimResult.score > 0) {
    summaryParts.push('DKIM implementation is weak and provides limited email integrity protection.')
  } else {
    summaryParts.push('No DKIM signing detected - emails lack cryptographic authentication.')
  }

  return summaryParts.join(' ')
}

/**
 * Generate priority-based action plan
 */
export function generateActionPlan(scoreData) {
  const actions = []

  // Critical actions (score < 50)
  if (scoreData.totalScore < 50) {
    actions.push({
      priority: 'critical',
      title: 'Implement Basic Email Authentication',
      description: 'Your domain lacks fundamental email security. Start with SPF and DMARC records.',
      steps: [
        'Create an SPF record to authorize sending servers',
        'Implement a DMARC record starting with p=none',
        'Configure DKIM signing for email integrity',
        'Monitor DMARC reports for unauthorized usage'
      ]
    })
  }

  // High priority actions
  if (scoreData.breakdown.dmarc.score < 20) {
    actions.push({
      priority: 'high',
      title: 'Strengthen DMARC Protection',
      description: 'Upgrade your DMARC policy for better protection against domain spoofing.',
      steps: [
        'Review DMARC reports to understand email flows',
        'Gradually increase DMARC policy from none to quarantine',
        'Eventually upgrade to reject policy for maximum protection',
        'Ensure 100% of emails are covered (pct=100)'
      ]
    })
  }

  if (scoreData.breakdown.spf.score < 15) {
    actions.push({
      priority: 'high',
      title: 'Optimize SPF Configuration',
      description: 'Improve your SPF record to prevent unauthorized email sending.',
      steps: [
        'Review and update authorized sending sources',
        'Reduce DNS lookups to improve performance',
        'Change soft fail (~all) to hard fail (-all)',
        'Remove unnecessary include statements'
      ]
    })
  }

  // Medium priority actions
  if (scoreData.breakdown.dkim.score < 20) {
    actions.push({
      priority: 'medium',
      title: 'Enhance DKIM Implementation',
      description: 'Strengthen email integrity protection with better DKIM configuration.',
      steps: [
        'Generate 2048-bit or higher RSA keys',
        'Implement DKIM signing for all outbound email',
        'Use SHA-256 algorithm for better security',
        'Set up key rotation schedule'
      ]
    })
  }

  // Low priority optimizations
  if (scoreData.totalScore >= 70) {
    actions.push({
      priority: 'low',
      title: 'Fine-tune Email Security',
      description: 'Optimize your configuration for maximum security and compliance.',
      steps: [
        'Enable forensic reporting (ruf) for detailed analysis',
        'Implement subdomain policy (sp=) if needed',
        'Review and optimize DNS lookup chains',
        'Consider implementing BIMI for brand protection'
      ]
    })
  }

  return actions
}

/**
 * Calculate security trend based on historical data
 */
export function calculateSecurityTrend(currentScore, historicalScores = []) {
  if (historicalScores.length === 0) {
    return { trend: 'new', change: 0, description: 'Initial assessment' }
  }

  const previousScore = historicalScores[historicalScores.length - 1]
  const change = currentScore - previousScore

  if (Math.abs(change) < 2) {
    return { trend: 'stable', change, description: 'Security posture remains stable' }
  } else if (change > 0) {
    return { trend: 'improving', change, description: `Security improved by ${change} points` }
  } else {
    return { trend: 'declining', change, description: `Security declined by ${Math.abs(change)} points` }
  }
}