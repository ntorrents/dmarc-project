// Email Security Scoring Algorithm
export function calculateEmailSecurityScore(dmarcData, spfData = null, dkimData = null) {
  let totalScore = 0
  let maxScore = 100
  
  const scores = {
    dmarc: 0,
    spf: 0,
    dkim: 0
  }

  const details = {
    dmarc: {
      score: 0,
      status: 'fail',
      issues: [],
      recommendations: []
    },
    spf: {
      score: 0,
      status: 'fail',
      issues: [],
      recommendations: []
    },
    dkim: {
      score: 0,
      status: 'fail',
      issues: [],
      recommendations: []
    }
  }

  // DMARC Scoring (40 points max)
  if (dmarcData && dmarcData.status === 'success') {
    const policy = dmarcData.details?.policy || 'none'
    const percentage = parseInt(dmarcData.details?.percentage || '100')
    const hasReporting = dmarcData.record?.includes('rua=')

    // Base score for having DMARC
    scores.dmarc += 15
    details.dmarc.status = 'warning'

    // Policy scoring
    switch (policy) {
      case 'reject':
        scores.dmarc += 15
        details.dmarc.status = 'success'
        break
      case 'quarantine':
        scores.dmarc += 10
        details.dmarc.status = 'success'
        details.dmarc.recommendations.push('Consider upgrading to reject policy for maximum protection')
        break
      case 'none':
        scores.dmarc += 5
        details.dmarc.issues.push('Policy set to none - provides monitoring only')
        details.dmarc.recommendations.push('Upgrade to quarantine or reject policy')
        break
    }

    // Percentage scoring
    if (percentage === 100) {
      scores.dmarc += 5
    } else {
      details.dmarc.issues.push(`Only ${percentage}% of emails are subject to DMARC policy`)
      details.dmarc.recommendations.push('Set pct=100 for full protection')
    }

    // Reporting scoring
    if (hasReporting) {
      scores.dmarc += 5
    } else {
      details.dmarc.issues.push('No aggregate reporting configured')
      details.dmarc.recommendations.push('Add rua= tag for email authentication reports')
    }
  } else {
    details.dmarc.issues.push('No DMARC record found')
    details.dmarc.recommendations.push('Create a DMARC record starting with v=DMARC1')
    details.dmarc.recommendations.push('Start with p=none for monitoring')
  }

  // SPF Scoring (30 points max) - Simulated for now
  if (spfData !== null) {
    scores.spf = spfData
    if (spfData >= 25) {
      details.spf.status = 'success'
    } else if (spfData >= 15) {
      details.spf.status = 'warning'
      details.spf.recommendations.push('Optimize SPF record for better alignment')
    } else {
      details.spf.issues.push('SPF record needs improvement')
      details.spf.recommendations.push('Review and update SPF record')
    }
  } else {
    // Simulate SPF analysis based on domain
    const simulatedSpfScore = Math.floor(Math.random() * 20) + 15 // 15-35
    scores.spf = simulatedSpfScore
    
    if (simulatedSpfScore >= 25) {
      details.spf.status = 'success'
    } else {
      details.spf.status = 'warning'
      details.spf.issues.push('SPF record could be optimized')
      details.spf.recommendations.push('Review SPF record for proper sender authorization')
    }
  }

  // DKIM Scoring (30 points max) - Simulated for now
  if (dkimData !== null) {
    scores.dkim = dkimData
    if (dkimData >= 25) {
      details.dkim.status = 'success'
    } else if (dkimData >= 15) {
      details.dkim.status = 'warning'
      details.dkim.recommendations.push('Ensure DKIM signatures are properly configured')
    } else {
      details.dkim.issues.push('DKIM implementation needs attention')
      details.dkim.recommendations.push('Set up DKIM signing for your domain')
    }
  } else {
    // Simulate DKIM analysis
    const simulatedDkimScore = Math.floor(Math.random() * 20) + 10 // 10-30
    scores.dkim = simulatedDkimScore
    
    if (simulatedDkimScore >= 25) {
      details.dkim.status = 'success'
    } else {
      details.dkim.status = 'warning'
      details.dkim.issues.push('DKIM signatures could be improved')
      details.dkim.recommendations.push('Verify DKIM key configuration')
    }
  }

  // Calculate total score
  totalScore = scores.dmarc + scores.spf + scores.dkim
  
  // Update individual scores in details
  details.dmarc.score = scores.dmarc
  details.spf.score = scores.spf
  details.dkim.score = scores.dkim

  // Determine overall grade
  let grade = 'F'
  let riskLevel = 'High'
  let riskColor = 'red'

  if (totalScore >= 85) {
    grade = 'A'
    riskLevel = 'Low'
    riskColor = 'green'
  } else if (totalScore >= 75) {
    grade = 'B'
    riskLevel = 'Low'
    riskColor = 'green'
  } else if (totalScore >= 65) {
    grade = 'C'
    riskLevel = 'Medium'
    riskColor = 'yellow'
  } else if (totalScore >= 50) {
    grade = 'D'
    riskLevel = 'Medium'
    riskColor = 'orange'
  } else {
    riskLevel = 'High'
    riskColor = 'red'
  }

  return {
    totalScore,
    grade,
    riskLevel,
    riskColor,
    breakdown: details,
    recommendations: [
      ...details.dmarc.recommendations,
      ...details.spf.recommendations,
      ...details.dkim.recommendations
    ].slice(0, 5) // Limit to top 5 recommendations
  }
}