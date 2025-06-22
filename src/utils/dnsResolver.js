/**
 * DNS Resolver Utility
 * Provides real-time DNS record validation using multiple DNS APIs
 */

// DNS API endpoints with fallbacks
const DNS_APIS = {
  google: 'https://dns.google/resolve',
  cloudflare: 'https://cloudflare-dns.com/dns-query',
  quad9: 'https://dns.quad9.net:5053/dns-query'
}

// DNS record types
const RECORD_TYPES = {
  TXT: 16,
  A: 1,
  AAAA: 28,
  MX: 15,
  CNAME: 5
}

/**
 * Query DNS records using multiple providers with fallback
 */
export async function queryDNS(domain, recordType = 'TXT', timeout = 5000) {
  const queries = [
    queryGoogleDNS(domain, recordType, timeout),
    queryCloudflareDNS(domain, recordType, timeout),
    queryQuad9DNS(domain, recordType, timeout)
  ]

  try {
    // Try all DNS providers simultaneously, return first successful result
    const result = await Promise.any(queries)
    return result
  } catch (error) {
    console.error('All DNS queries failed:', error)
    throw new Error('DNS resolution failed - please check your internet connection')
  }
}

/**
 * Query Google Public DNS API
 */
async function queryGoogleDNS(domain, recordType, timeout) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const url = `${DNS_APIS.google}?name=${encodeURIComponent(domain)}&type=${recordType}&cd=false&do=false`
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/dns-json'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Google DNS API error: ${response.status}`)
    }

    const data = await response.json()
    return processDNSResponse(data, 'google')
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(`Google DNS query failed: ${error.message}`)
  }
}

/**
 * Query Cloudflare DNS API
 */
async function queryCloudflareDNS(domain, recordType, timeout) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const url = `${DNS_APIS.cloudflare}?name=${encodeURIComponent(domain)}&type=${recordType}`
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/dns-json'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Cloudflare DNS API error: ${response.status}`)
    }

    const data = await response.json()
    return processDNSResponse(data, 'cloudflare')
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(`Cloudflare DNS query failed: ${error.message}`)
  }
}

/**
 * Query Quad9 DNS API
 */
async function queryQuad9DNS(domain, recordType, timeout) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const url = `${DNS_APIS.quad9}?name=${encodeURIComponent(domain)}&type=${recordType}`
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/dns-json'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Quad9 DNS API error: ${response.status}`)
    }

    const data = await response.json()
    return processDNSResponse(data, 'quad9')
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(`Quad9 DNS query failed: ${error.message}`)
  }
}

/**
 * Process DNS API response into standardized format
 */
function processDNSResponse(data, provider) {
  const result = {
    provider,
    status: data.Status || 0,
    records: [],
    authority: data.Authority || [],
    additional: data.Additional || []
  }

  if (data.Answer && Array.isArray(data.Answer)) {
    result.records = data.Answer.map(record => ({
      name: record.name,
      type: record.type,
      ttl: record.TTL,
      data: record.data ? record.data.replace(/"/g, '') : '', // Remove quotes from TXT records
      raw: record
    }))
  }

  return result
}

/**
 * Query specific DMARC record
 */
export async function queryDMARCRecord(domain) {
  try {
    const dmarcDomain = `_dmarc.${domain}`
    const result = await queryDNS(dmarcDomain, 'TXT')
    
    // Filter for DMARC records (must start with v=DMARC1)
    const dmarcRecords = result.records.filter(record => 
      record.data && record.data.toLowerCase().startsWith('v=dmarc1')
    )

    return {
      ...result,
      records: dmarcRecords,
      found: dmarcRecords.length > 0,
      domain: dmarcDomain
    }
  } catch (error) {
    throw new Error(`DMARC query failed: ${error.message}`)
  }
}

/**
 * Query SPF record
 */
export async function querySPFRecord(domain) {
  try {
    const result = await queryDNS(domain, 'TXT')
    
    // Filter for SPF records (must start with v=spf1)
    const spfRecords = result.records.filter(record => 
      record.data && record.data.toLowerCase().startsWith('v=spf1')
    )

    return {
      ...result,
      records: spfRecords,
      found: spfRecords.length > 0,
      domain
    }
  } catch (error) {
    throw new Error(`SPF query failed: ${error.message}`)
  }
}

/**
 * Query DKIM record (requires selector)
 */
export async function queryDKIMRecord(domain, selector = 'default') {
  try {
    const dkimDomain = `${selector}._domainkey.${domain}`
    const result = await queryDNS(dkimDomain, 'TXT')
    
    // Filter for DKIM records (must contain v=DKIM1)
    const dkimRecords = result.records.filter(record => 
      record.data && record.data.toLowerCase().includes('v=dkim1')
    )

    return {
      ...result,
      records: dkimRecords,
      found: dkimRecords.length > 0,
      domain: dkimDomain,
      selector
    }
  } catch (error) {
    throw new Error(`DKIM query failed: ${error.message}`)
  }
}

/**
 * Attempt to discover DKIM selectors
 */
export async function discoverDKIMSelectors(domain) {
  const commonSelectors = [
    'default', 'selector1', 'selector2', 'google', 'k1', 'k2', 
    'mail', 'email', 'dkim', 's1', 's2', 'key1', 'key2',
    'mailgun', 'sendgrid', 'amazonses', 'mandrill'
  ]

  const foundSelectors = []
  
  // Query common selectors in parallel
  const queries = commonSelectors.map(async (selector) => {
    try {
      const result = await queryDKIMRecord(domain, selector)
      if (result.found) {
        foundSelectors.push({
          selector,
          records: result.records
        })
      }
    } catch (error) {
      // Ignore individual selector failures
    }
  })

  await Promise.allSettled(queries)
  
  return foundSelectors
}

/**
 * Comprehensive domain email security check
 */
export async function checkEmailSecurity(domain) {
  try {
    // Run all checks in parallel for better performance
    const [dmarcResult, spfResult, dkimSelectors] = await Promise.allSettled([
      queryDMARCRecord(domain),
      querySPFRecord(domain),
      discoverDKIMSelectors(domain)
    ])

    return {
      domain,
      timestamp: new Date().toISOString(),
      dmarc: dmarcResult.status === 'fulfilled' ? dmarcResult.value : { found: false, error: dmarcResult.reason?.message },
      spf: spfResult.status === 'fulfilled' ? spfResult.value : { found: false, error: spfResult.reason?.message },
      dkim: dkimSelectors.status === 'fulfilled' ? dkimSelectors.value : { found: false, error: dkimSelectors.reason?.message }
    }
  } catch (error) {
    throw new Error(`Email security check failed: ${error.message}`)
  }
}