# DMARC Record Checker - Logic and Scoring System

## Overview
This document outlines the comprehensive logic for the DMARC Record Checker that provides real-time DNS validation and scoring for email security configurations.

## Scoring System Architecture

### 1. Overall Score Calculation (100 points total)
- **DMARC Record (40 points)**
- **SPF Record (30 points)**  
- **DKIM Record (30 points)**

### 2. DMARC Record Scoring (40 points)

#### Base Requirements (15 points)
- ✅ DMARC record exists: +15 points
- ❌ No DMARC record: 0 points

#### Policy Scoring (15 points)
- `p=reject`: +15 points (Maximum security)
- `p=quarantine`: +10 points (Good security)
- `p=none`: +5 points (Monitoring only)

#### Percentage Coverage (5 points)
- `pct=100`: +5 points (Full coverage)
- `pct=75-99`: +3 points (Good coverage)
- `pct=50-74`: +2 points (Partial coverage)
- `pct=25-49`: +1 point (Limited coverage)
- `pct=1-24`: +0 points (Minimal coverage)

#### Reporting Configuration (5 points)
- Both `rua` and `ruf` present: +5 points
- Only `rua` present: +3 points
- Only `ruf` present: +2 points
- No reporting: 0 points

### 3. SPF Record Scoring (30 points)

#### Base Requirements (10 points)
- ✅ SPF record exists: +10 points
- ❌ No SPF record: 0 points

#### Policy Mechanism (10 points)
- Ends with `-all` (strict): +10 points
- Ends with `~all` (soft fail): +7 points
- Ends with `?all` (neutral): +3 points
- Ends with `+all` (pass all): 0 points

#### Record Quality (10 points)
- Single SPF record: +5 points
- Multiple SPF records: 0 points (RFC violation)
- DNS lookups ≤ 10: +3 points
- DNS lookups > 10: 0 points
- No syntax errors: +2 points

### 4. DKIM Record Scoring (30 points)

#### Base Requirements (15 points)
- ✅ DKIM record exists: +15 points
- ❌ No DKIM record: 0 points

#### Key Strength (10 points)
- RSA 2048+ bits: +10 points
- RSA 1024 bits: +5 points
- RSA < 1024 bits: +2 points

#### Configuration Quality (5 points)
- Valid key format: +3 points
- Proper algorithm specified: +2 points

## Risk Level Classification

### Score Ranges
- **90-100**: Excellent (Low Risk) - Grade A
- **80-89**: Good (Low Risk) - Grade B  
- **70-79**: Fair (Medium Risk) - Grade C
- **60-69**: Poor (Medium Risk) - Grade D
- **50-59**: Bad (High Risk) - Grade E
- **0-49**: Critical (High Risk) - Grade F

### Risk Level Descriptions

#### Low Risk (80-100)
- Comprehensive email authentication in place
- Strong DMARC policy (quarantine/reject)
- Proper SPF and DKIM configuration
- Regular monitoring and reporting enabled

#### Medium Risk (60-79)
- Basic authentication configured
- Some security gaps present
- DMARC policy may be too lenient
- Monitoring in place but improvements needed

#### High Risk (0-59)
- Significant authentication gaps
- Vulnerable to spoofing and phishing
- Missing or misconfigured records
- Immediate action required

## DNS API Integration

### Primary DNS Resolver
- **Google Public DNS API**: `https://dns.google/resolve`
- **Cloudflare DNS API**: `https://cloudflare-dns.com/dns-query`
- **Fallback**: Browser DNS resolution

### Query Types
1. **DMARC**: TXT record at `_dmarc.{domain}`
2. **SPF**: TXT record at `{domain}`
3. **DKIM**: TXT record at `{selector}._domainkey.{domain}`

### Error Handling
- Network timeouts (5 second limit)
- DNS resolution failures
- Invalid record formats
- Rate limiting protection

## Validation Logic

### DMARC Record Validation
```javascript
// Check for required v=DMARC1 tag
// Validate policy (p=none|quarantine|reject)
// Check percentage (pct=0-100)
// Validate reporting addresses (rua/ruf)
// Ensure proper syntax and formatting
```

### SPF Record Validation
```javascript
// Check for v=spf1 prefix
// Count DNS lookups (max 10)
// Validate mechanisms (a, mx, include, etc.)
// Check for multiple SPF records
// Validate final qualifier (-all, ~all, etc.)
```

### DKIM Record Validation
```javascript
// Check for v=DKIM1 tag
// Validate public key format
// Check key algorithm and length
// Ensure proper base64 encoding
// Validate optional tags (t, s, etc.)
```

## Recommendations Engine

### Critical Issues (Immediate Action)
- No DMARC record found
- DMARC policy set to p=none for extended period
- Multiple SPF records (RFC violation)
- SPF record with +all qualifier
- Missing or invalid DKIM keys

### Warnings (Should Address)
- DMARC percentage less than 100%
- SPF record approaching 10 DNS lookup limit
- DKIM key length less than 2048 bits
- Missing aggregate reporting (rua)
- Missing forensic reporting (ruf)

### Optimizations (Best Practices)
- Upgrade DMARC policy from quarantine to reject
- Implement DKIM key rotation
- Add subdomain policy (sp=)
- Configure failure reporting options
- Monitor and analyze DMARC reports

## Implementation Features

### Real-time Validation
- Live DNS queries for immediate results
- Caching for performance optimization
- Progressive enhancement for better UX
- Error recovery and retry logic

### Detailed Analysis
- Record parsing and syntax validation
- Security impact assessment
- Compliance checking
- Historical trend analysis

### Actionable Insights
- Step-by-step implementation guides
- Priority-based recommendations
- Risk mitigation strategies
- Best practice guidelines

## Security Considerations

### Input Validation
- Domain name format validation
- DNS injection prevention
- Rate limiting protection
- Sanitization of user inputs

### Privacy Protection
- No logging of domain queries
- Client-side DNS resolution when possible
- Secure HTTPS connections
- No data retention policies

## Performance Optimization

### Caching Strategy
- Browser cache for repeated queries
- CDN caching for common domains
- Background prefetching for popular domains
- Intelligent cache invalidation

### Load Balancing
- Multiple DNS resolver endpoints
- Automatic failover mechanisms
- Geographic load distribution
- Performance monitoring

This comprehensive system provides enterprise-grade DMARC analysis with real-time DNS validation, sophisticated scoring algorithms, and actionable security recommendations.