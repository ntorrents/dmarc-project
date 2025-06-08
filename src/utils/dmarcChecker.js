export async function checkDMARC(domain) {
  const apiUrl = `https://dns.google/resolve?name=_dmarc.${domain}&type=TXT`

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error('Unable to connect to DNS service.')
    }

    const data = await response.json()

    if (data.Answer) {
      const dmarcRecord = data.Answer.find((record) =>
        record.data.includes('v=DMARC1')
      )

      if (dmarcRecord) {
        const recordData = dmarcRecord.data.replace(/"/g, '')
        
        // Parse DMARC record for better analysis
        const policy = recordData.match(/p=([^;]+)/)?.[1] || 'none'
        const subdomain = recordData.match(/sp=([^;]+)/)?.[1] || policy
        const percentage = recordData.match(/pct=([^;]+)/)?.[1] || '100'
        
        let status = 'success'
        let recommendations = []

        // Provide recommendations based on policy
        if (policy === 'none') {
          status = 'warning'
          recommendations.push('Consider upgrading to quarantine or reject policy for better protection')
        }
        
        if (percentage !== '100') {
          recommendations.push('Consider setting pct=100 for full protection')
        }

        if (!recordData.includes('rua=')) {
          recommendations.push('Add aggregate reporting (rua) to monitor email authentication')
        }

        return {
          status,
          message: `DMARC record found with policy: ${policy}`,
          record: recordData,
          recommendations: recommendations.length > 0 ? recommendations : null,
          details: {
            policy,
            subdomain,
            percentage
          }
        }
      } else {
        return {
          status: 'error',
          message: 'No valid DMARC record found for this domain.',
          recommendations: [
            'Create a DMARC record starting with v=DMARC1',
            'Set up SPF and DKIM records first',
            'Start with a monitoring policy (p=none)',
            'Configure aggregate reporting (rua) for visibility'
          ]
        }
      }
    } else {
      return {
        status: 'error',
        message: 'No DNS records found for this domain.',
        recommendations: [
          'Verify the domain name is correct',
          'Ensure the domain has proper DNS configuration',
          'Contact your DNS provider if issues persist'
        ]
      }
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Error checking DMARC record: ${error.message}`,
      recommendations: [
        'Check your internet connection',
        'Verify the domain name is correct',
        'Try again in a few moments'
      ]
    }
  }
}