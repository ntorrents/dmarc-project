/**
 * DKIM Record Validator
 * Comprehensive validation and parsing of DKIM records
 */

/**
 * Parse DKIM record into structured data
 */
export function parseDKIMRecord(record) {
  if (!record || typeof record !== 'string') {
    throw new Error('Invalid DKIM record format')
  }

  const tags = {}
  const errors = []
  const warnings = []

  // Split record into tag-value pairs
  const pairs = record.split(';').map(pair => pair.trim()).filter(pair => pair.length > 0)

  for (const pair of pairs) {
    const [tag, ...valueParts] = pair.split('=')
    const value = valueParts.join('=').trim()

    if (!tag || value === undefined) {
      errors.push(`Invalid tag-value pair: ${pair}`)
      continue
    }

    tags[tag.trim().toLowerCase()] = value
  }

  // Validate version tag
  if (!tags.v || tags.v !== 'DKIM1') {
    errors.push('Missing or invalid version tag (v=DKIM1)')
  }

  // Validate key type
  if (tags.k && tags.k !== 'rsa') {
    warnings.push(`Non-standard key type: ${tags.k}`)
  }

  // Validate algorithm
  if (tags.h && !['sha1', 'sha256'].includes(tags.h)) {
    warnings.push(`Non-standard hash algorithm: ${tags.h}`)
  }

  // Validate service type
  if (tags.s && tags.s !== '*' && tags.s !== 'email') {
    warnings.push(`Restricted service type: ${tags.s}`)
  }

  // Validate flags
  if (tags.t) {
    const flags = tags.t.split(':')
    for (const flag of flags) {
      if (!['y', 's'].includes(flag)) {
        warnings.push(`Unknown flag: ${flag}`)
      }
    }
  }

  // Validate public key
  let keyLength = 0
  if (tags.p) {
    if (tags.p === '') {
      warnings.push('Empty public key (key revoked)')
    } else {
      try {
        // Decode base64 to get key length
        const keyData = atob(tags.p.replace(/\s/g, ''))
        keyLength = estimateRSAKeyLength(keyData)
      } catch (error) {
        errors.push('Invalid base64 encoding in public key')
      }
    }
  } else {
    errors.push('Missing public key (p=)')
  }

  return {
    tags,
    errors,
    warnings,
    isValid: errors.length === 0,
    keyLength,
    algorithm: tags.h || 'sha256',
    keyType: tags.k || 'rsa',
    isRevoked: tags.p === '',
    isTestMode: tags.t && tags.t.includes('y')
  }
}

/**
 * Estimate RSA key length from DER-encoded key data
 */
function estimateRSAKeyLength(keyData) {
  try {
    // This is a simplified estimation
    // In a real implementation, you'd parse the ASN.1 DER structure
    const bytes = keyData.length
    
    if (bytes > 400) return 4096
    if (bytes > 300) return 3072
    if (bytes > 200) return 2048
    if (bytes > 150) return 1536
    if (bytes > 100) return 1024
    return 512
  } catch (error) {
    return 0
  }
}

/**
 * Calculate DKIM score based on configuration
 */
export function calculateDKIMScore(dkimData) {
  let score = 0
  const issues = []
  const recommendations = []

  if (!dkimData.found || dkimData.length === 0) {
    issues.push('No DKIM records found')
    recommendations.push('Configure DKIM signing for your domain')
    recommendations.push('Generate RSA 2048-bit or higher keys')
    recommendations.push('Publish DKIM public key in DNS')
    return { score: 0, issues, recommendations, status: 'fail' }
  }

  let bestScore = 0
  let bestParsed = null

  // Evaluate all found DKIM selectors
  for (const selector of dkimData) {
    for (const record of selector.records) {
      try {
        const parsed = parseDKIMRecord(record.data)
        let selectorScore = 0

        // Base score for having DKIM record (15 points)
        selectorScore += 15

        // Key strength scoring (10 points)
        if (parsed.keyLength >= 2048) {
          selectorScore += 10
        } else if (parsed.keyLength >= 1024) {
          selectorScore += 5
          recommendations.push('Consider upgrading to 2048-bit or higher keys')
        } else if (parsed.keyLength > 0) {
          selectorScore += 2
          issues.push(`Weak key length: ${parsed.keyLength} bits`)
        }

        // Configuration quality scoring (5 points)
        if (parsed.isValid) {
          selectorScore += 3
        }

        if (parsed.algorithm === 'sha256') {
          selectorScore += 2
        } else {
          recommendations.push('Consider using SHA-256 algorithm')
        }

        // Penalties
        if (parsed.isRevoked) {
          issues.push(`DKIM key for selector ${selector.selector} is revoked`)
          selectorScore = 0
        }

        if (parsed.isTestMode) {
          recommendations.push(`DKIM selector ${selector.selector} is in test mode`)
        }

        if (selectorScore > bestScore) {
          bestScore = selectorScore
          bestParsed = parsed
        }

        // Add validation errors and warnings
        issues.push(...parsed.errors.map(e => `${selector.selector}: ${e}`))
        recommendations.push(...parsed.warnings.map(w => `${selector.selector}: ${w}`))
      } catch (error) {
        issues.push(`DKIM record parsing failed for ${selector.selector}: ${error.message}`)
      }
    }
  }

  score = bestScore

  const status = score >= 25 ? 'success' : score >= 15 ? 'warning' : 'fail'

  return { score, issues, recommendations, status, parsed: bestParsed }
}