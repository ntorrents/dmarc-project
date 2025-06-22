/**
 * SPF Record Validator
 * Comprehensive validation and parsing of SPF records
 */

/**
 * Parse SPF record into structured data
 */
export function parseSPFRecord(record) {
  if (!record || typeof record !== 'string') {
    throw new Error('Invalid SPF record format')
  }

  const mechanisms = []
  const modifiers = []
  const errors = []
  const warnings = []
  let dnsLookups = 0

  // Split record into terms
  const terms = record.split(/\s+/).filter(term => term.length > 0)

  // Check version
  if (!terms[0] || terms[0].toLowerCase() !== 'v=spf1') {
    errors.push('SPF record must start with v=spf1')
  }

  // Parse mechanisms and modifiers
  for (let i = 1; i < terms.length; i++) {
    const term = terms[i].trim()
    
    if (term.includes('=')) {
      // Modifier
      const [name, value] = term.split('=', 2)
      modifiers.push({ name: name.toLowerCase(), value, raw: term })
      
      if (name.toLowerCase() === 'redirect') {
        dnsLookups++
      }
    } else {
      // Mechanism
      const mechanism = parseSPFMechanism(term)
      mechanisms.push(mechanism)
      
      // Count DNS lookups
      if (['a', 'mx', 'include', 'exists'].includes(mechanism.type)) {
        dnsLookups++
      }
    }
  }

  // Validate DNS lookup limit
  if (dnsLookups > 10) {
    errors.push(`Too many DNS lookups (${dnsLookups}). SPF limit is 10.`)
  } else if (dnsLookups > 8) {
    warnings.push(`High number of DNS lookups (${dnsLookups}). Consider optimizing.`)
  }

  // Check for final mechanism
  const finalMechanism = mechanisms[mechanisms.length - 1]
  if (!finalMechanism || !['all'].includes(finalMechanism.type)) {
    warnings.push('SPF record should end with an "all" mechanism')
  }

  // Validate mechanism syntax
  for (const mechanism of mechanisms) {
    const mechErrors = validateSPFMechanism(mechanism)
    errors.push(...mechErrors)
  }

  return {
    mechanisms,
    modifiers,
    errors,
    warnings,
    dnsLookups,
    isValid: errors.length === 0,
    finalQualifier: finalMechanism?.qualifier || '?',
    hasStrictPolicy: finalMechanism?.qualifier === '-'
  }
}

/**
 * Parse individual SPF mechanism
 */
function parseSPFMechanism(term) {
  const qualifiers = ['+', '-', '~', '?']
  let qualifier = '+'
  let mechanism = term

  // Extract qualifier
  if (qualifiers.includes(term[0])) {
    qualifier = term[0]
    mechanism = term.substring(1)
  }

  // Parse mechanism type and value
  const colonIndex = mechanism.indexOf(':')
  const slashIndex = mechanism.indexOf('/')
  
  let type, value, prefix

  if (colonIndex !== -1) {
    type = mechanism.substring(0, colonIndex)
    const remainder = mechanism.substring(colonIndex + 1)
    
    if (slashIndex > colonIndex) {
      const slashPos = slashIndex - colonIndex - 1
      value = remainder.substring(0, slashPos)
      prefix = remainder.substring(slashPos + 1)
    } else {
      value = remainder
    }
  } else if (slashIndex !== -1) {
    type = mechanism.substring(0, slashIndex)
    prefix = mechanism.substring(slashIndex + 1)
  } else {
    type = mechanism
  }

  return {
    qualifier,
    type: type.toLowerCase(),
    value,
    prefix,
    raw: term
  }
}

/**
 * Validate SPF mechanism syntax
 */
function validateSPFMechanism(mechanism) {
  const errors = []
  const validTypes = ['all', 'include', 'a', 'mx', 'ptr', 'ip4', 'ip6', 'exists']

  if (!validTypes.includes(mechanism.type)) {
    errors.push(`Invalid SPF mechanism: ${mechanism.type}`)
    return errors
  }

  // Validate specific mechanism types
  switch (mechanism.type) {
    case 'ip4':
      if (!mechanism.value || !isValidIPv4(mechanism.value)) {
        errors.push(`Invalid IPv4 address in ip4 mechanism: ${mechanism.value}`)
      }
      break
    
    case 'ip6':
      if (!mechanism.value || !isValidIPv6(mechanism.value)) {
        errors.push(`Invalid IPv6 address in ip6 mechanism: ${mechanism.value}`)
      }
      break
    
    case 'include':
      if (!mechanism.value) {
        errors.push('Include mechanism requires a domain')
      } else if (!isValidDomain(mechanism.value)) {
        errors.push(`Invalid domain in include mechanism: ${mechanism.value}`)
      }
      break
    
    case 'a':
    case 'mx':
      if (mechanism.value && !isValidDomain(mechanism.value)) {
        errors.push(`Invalid domain in ${mechanism.type} mechanism: ${mechanism.value}`)
      }
      break
  }

  // Validate prefix length
  if (mechanism.prefix) {
    const prefix = parseInt(mechanism.prefix)
    const maxPrefix = mechanism.type === 'ip6' ? 128 : 32
    
    if (isNaN(prefix) || prefix < 0 || prefix > maxPrefix) {
      errors.push(`Invalid prefix length: ${mechanism.prefix}`)
    }
  }

  return errors
}

/**
 * Basic IPv4 validation
 */
function isValidIPv4(ip) {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  
  return parts.every(part => {
    const num = parseInt(part)
    return !isNaN(num) && num >= 0 && num <= 255
  })
}

/**
 * Basic IPv6 validation
 */
function isValidIPv6(ip) {
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/
  return ipv6Regex.test(ip)
}

/**
 * Basic domain validation
 */
function isValidDomain(domain) {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/
  return domainRegex.test(domain)
}

/**
 * Calculate SPF score based on configuration
 */
export function calculateSPFScore(spfData) {
  let score = 0
  const issues = []
  const recommendations = []

  if (!spfData.found) {
    issues.push('No SPF record found')
    recommendations.push('Create an SPF record starting with v=spf1')
    recommendations.push('End with -all for strict policy')
    return { score: 0, issues, recommendations, status: 'fail' }
  }

  // Check for multiple SPF records
  if (spfData.records.length > 1) {
    issues.push('Multiple SPF records found (RFC violation)')
    recommendations.push('Combine into a single SPF record')
    return { score: 0, issues, recommendations, status: 'fail' }
  }

  try {
    const parsed = parseSPFRecord(spfData.records[0].data)
    
    // Base score for having SPF record (10 points)
    score += 10

    // Policy mechanism scoring (10 points)
    switch (parsed.finalQualifier) {
      case '-': // -all (strict)
        score += 10
        break
      case '~': // ~all (soft fail)
        score += 7
        recommendations.push('Consider upgrading to -all for stricter policy')
        break
      case '?': // ?all (neutral)
        score += 3
        issues.push('Neutral policy provides minimal protection')
        recommendations.push('Upgrade to ~all or -all for better security')
        break
      case '+': // +all (pass all)
        issues.push('Permissive policy allows any server to send email')
        recommendations.push('Replace +all with -all for security')
        break
    }

    // DNS lookup scoring (5 points)
    if (parsed.dnsLookups <= 8) {
      score += 3
    } else if (parsed.dnsLookups <= 10) {
      score += 1
      recommendations.push('Consider reducing DNS lookups for better performance')
    } else {
      issues.push(`Too many DNS lookups (${parsed.dnsLookups})`)
    }

    // Syntax validation scoring (2 points)
    if (parsed.isValid) {
      score += 2
    }

    // Record quality (5 points)
    if (spfData.records.length === 1) {
      score += 5
    }

    // Add validation errors as issues
    issues.push(...parsed.errors)
    
    // Add validation warnings as recommendations
    recommendations.push(...parsed.warnings)

    const status = score >= 25 ? 'success' : score >= 15 ? 'warning' : 'fail'

    return { score, issues, recommendations, status, parsed }
  } catch (error) {
    issues.push(`SPF record parsing failed: ${error.message}`)
    return { score: 0, issues, recommendations, status: 'fail' }
  }
}