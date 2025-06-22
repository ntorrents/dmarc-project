/**
 * DMARC Record Validator
 * Comprehensive validation and parsing of DMARC records
 */

/**
 * Parse DMARC record into structured data
 */
export function parseDMARCRecord(record) {
  if (!record || typeof record !== 'string') {
    throw new Error('Invalid DMARC record format')
  }

  const tags = {}
  const errors = []
  const warnings = []

  // Split record into tag-value pairs
  const pairs = record.split(';').map(pair => pair.trim()).filter(pair => pair.length > 0)

  for (const pair of pairs) {
    const [tag, ...valueParts] = pair.split('=')
    const value = valueParts.join('=').trim()

    if (!tag || !value) {
      errors.push(`Invalid tag-value pair: ${pair}`)
      continue
    }

    tags[tag.trim().toLowerCase()] = value
  }

  // Validate required version tag
  if (!tags.v || tags.v !== 'DMARC1') {
    errors.push('Missing or invalid version tag (v=DMARC1)')
  }

  // Validate policy
  if (!tags.p) {
    errors.push('Missing required policy tag (p=)')
  } else if (!['none', 'quarantine', 'reject'].includes(tags.p.toLowerCase())) {
    errors.push(`Invalid policy value: ${tags.p}`)
  }

  // Validate subdomain policy
  if (tags.sp && !['none', 'quarantine', 'reject'].includes(tags.sp.toLowerCase())) {
    errors.push(`Invalid subdomain policy value: ${tags.sp}`)
  }

  // Validate percentage
  if (tags.pct) {
    const pct = parseInt(tags.pct)
    if (isNaN(pct) || pct < 0 || pct > 100) {
      errors.push(`Invalid percentage value: ${tags.pct}`)
    } else if (pct < 100) {
      warnings.push(`Percentage is set to ${pct}% - consider setting to 100% for full protection`)
    }
  }

  // Validate alignment modes
  if (tags.adkim && !['r', 's'].includes(tags.adkim.toLowerCase())) {
    errors.push(`Invalid DKIM alignment mode: ${tags.adkim}`)
  }

  if (tags.aspf && !['r', 's'].includes(tags.aspf.toLowerCase())) {
    errors.push(`Invalid SPF alignment mode: ${tags.aspf}`)
  }

  // Validate reporting URIs
  if (tags.rua) {
    const ruaErrors = validateReportingURI(tags.rua, 'aggregate')
    errors.push(...ruaErrors)
  } else {
    warnings.push('No aggregate reporting URI (rua) configured')
  }

  if (tags.ruf) {
    const rufErrors = validateReportingURI(tags.ruf, 'forensic')
    errors.push(...rufErrors)
  } else {
    warnings.push('No forensic reporting URI (ruf) configured')
  }

  // Validate failure reporting options
  if (tags.fo && !['0', '1', 'd', 's'].includes(tags.fo)) {
    errors.push(`Invalid failure reporting option: ${tags.fo}`)
  }

  // Validate report format
  if (tags.rf && tags.rf !== 'afrf') {
    warnings.push(`Non-standard report format: ${tags.rf}`)
  }

  // Validate report interval
  if (tags.ri) {
    const ri = parseInt(tags.ri)
    if (isNaN(ri) || ri < 0) {
      errors.push(`Invalid report interval: ${tags.ri}`)
    }
  }

  return {
    tags,
    errors,
    warnings,
    isValid: errors.length === 0,
    policy: tags.p?.toLowerCase() || 'none',
    subdomainPolicy: tags.sp?.toLowerCase() || tags.p?.toLowerCase() || 'none',
    percentage: tags.pct ? parseInt(tags.pct) : 100,
    hasReporting: !!(tags.rua || tags.ruf),
    hasAggregateReporting: !!tags.rua,
    hasForensicReporting: !!tags.ruf
  }
}

/**
 * Validate reporting URI format
 */
function validateReportingURI(uri, type) {
  const errors = []
  const uris = uri.split(',').map(u => u.trim())

  for (const u of uris) {
    if (!u.startsWith('mailto:')) {
      errors.push(`Invalid ${type} reporting URI format: ${u}`)
      continue
    }

    const email = u.substring(7) // Remove 'mailto:'
    if (!isValidEmail(email)) {
      errors.push(`Invalid email address in ${type} reporting URI: ${email}`)
    }
  }

  return errors
}

/**
 * Basic email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Calculate DMARC score based on configuration
 */
export function calculateDMARCScore(dmarcData) {
  let score = 0
  const issues = []
  const recommendations = []

  if (!dmarcData.found) {
    issues.push('No DMARC record found')
    recommendations.push('Create a DMARC record starting with v=DMARC1')
    recommendations.push('Start with p=none for monitoring')
    recommendations.push('Configure aggregate reporting (rua)')
    return { score: 0, issues, recommendations, status: 'fail' }
  }

  try {
    const parsed = parseDMARCRecord(dmarcData.records[0].data)
    
    // Base score for having DMARC record (15 points)
    score += 15

    // Policy scoring (15 points)
    switch (parsed.policy) {
      case 'reject':
        score += 15
        break
      case 'quarantine':
        score += 10
        recommendations.push('Consider upgrading to reject policy for maximum protection')
        break
      case 'none':
        score += 5
        issues.push('Policy set to none - provides monitoring only')
        recommendations.push('Upgrade to quarantine or reject policy')
        break
    }

    // Percentage scoring (5 points)
    if (parsed.percentage === 100) {
      score += 5
    } else {
      issues.push(`Only ${parsed.percentage}% of emails are subject to DMARC policy`)
      recommendations.push('Set pct=100 for full protection')
    }

    // Reporting scoring (5 points)
    if (parsed.hasAggregateReporting && parsed.hasForensicReporting) {
      score += 5
    } else if (parsed.hasAggregateReporting) {
      score += 3
      recommendations.push('Add forensic reporting (ruf) for detailed failure analysis')
    } else if (parsed.hasForensicReporting) {
      score += 2
      recommendations.push('Add aggregate reporting (rua) for regular compliance reports')
    } else {
      issues.push('No reporting configured')
      recommendations.push('Add rua= tag for email authentication reports')
    }

    // Add validation errors as issues
    issues.push(...parsed.errors)
    
    // Add validation warnings as recommendations
    recommendations.push(...parsed.warnings)

    const status = score >= 35 ? 'success' : score >= 20 ? 'warning' : 'fail'

    return { score, issues, recommendations, status, parsed }
  } catch (error) {
    issues.push(`DMARC record parsing failed: ${error.message}`)
    return { score: 0, issues, recommendations, status: 'fail' }
  }
}