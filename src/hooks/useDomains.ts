import { useState, useEffect } from 'react'
import { domainsAPI, type Domain, type DomainFilters } from '../lib/api/domains'
import { IS_DEV } from '../lib/constants'
import { getErrorMessage } from '../lib/helpers'

export const useDomains = (initialFilters: DomainFilters = {}) => {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<DomainFilters>(initialFilters)

  useEffect(() => {
    loadDomains()
  }, [filters])

  const loadDomains = async () => {
    try {
      setLoading(true)
      setError(null)

      if (IS_DEV) {
        // Mock data for development
        const mockDomains: Domain[] = [
          {
            id: 1,
            name: 'example.com',
            status: 'protected',
            policy: 'quarantine',
            compliance: 92,
            lastCheck: '2024-01-15T10:30:00Z',
            emails: 1234,
            tag: 'production',
            createdAt: '2024-01-01T00:00:00Z',
            tld: 'com'
          },
          {
            id: 2,
            name: 'mycompany.org',
            status: 'warning',
            policy: 'none',
            compliance: 67,
            lastCheck: '2024-01-14T15:45:00Z',
            emails: 856,
            tag: 'staging',
            createdAt: '2024-01-05T00:00:00Z',
            tld: 'org'
          },
          {
            id: 3,
            name: 'business.net',
            status: 'error',
            policy: 'none',
            compliance: 34,
            lastCheck: '2024-01-12T09:15:00Z',
            emails: 432,
            tag: 'development',
            createdAt: '2024-01-10T00:00:00Z',
            tld: 'net'
          }
        ]
        
        // Apply filters to mock data
        let filteredDomains = mockDomains
        
        if (filters.search) {
          filteredDomains = filteredDomains.filter(domain =>
            domain.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
            domain.tag?.toLowerCase().includes(filters.search!.toLowerCase())
          )
        }
        
        if (filters.tag) {
          filteredDomains = filteredDomains.filter(domain => domain.tag === filters.tag)
        }
        
        if (filters.compliance) {
          filteredDomains = filteredDomains.filter(domain => {
            switch (filters.compliance) {
              case 'high':
                return domain.compliance >= 80
              case 'medium':
                return domain.compliance >= 50 && domain.compliance < 80
              case 'low':
                return domain.compliance < 50
              default:
                return true
            }
          })
        }
        
        setDomains(filteredDomains)
        return
      }

      const data = await domainsAPI.list(filters)
      setDomains(data)
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const addDomain = async (domainData: any) => {
    try {
      if (IS_DEV) {
        const newDomain: Domain = {
          id: Date.now(),
          name: domainData.name,
          status: 'warning',
          policy: 'none',
          compliance: 0,
          lastCheck: new Date().toISOString(),
          emails: 0,
          tag: domainData.tag || 'new',
          createdAt: new Date().toISOString(),
          tld: domainData.name.split('.').pop() || 'com'
        }
        setDomains(prev => [...prev, newDomain])
        return newDomain
      }

      const newDomain = await domainsAPI.create(domainData)
      setDomains(prev => [...prev, newDomain])
      return newDomain
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      throw err
    }
  }

  const updateDomain = async (id: number, data: any) => {
    try {
      if (IS_DEV) {
        setDomains(prev => prev.map(domain => 
          domain.id === id ? { ...domain, ...data } : domain
        ))
        return
      }

      const updatedDomain = await domainsAPI.update(id, data)
      setDomains(prev => prev.map(domain => 
        domain.id === id ? updatedDomain : domain
      ))
      return updatedDomain
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      throw err
    }
  }

  const deleteDomain = async (id: number) => {
    try {
      if (IS_DEV) {
        setDomains(prev => prev.filter(domain => domain.id !== id))
        return
      }

      await domainsAPI.delete(id)
      setDomains(prev => prev.filter(domain => domain.id !== id))
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      throw err
    }
  }

  const updateFilters = (newFilters: Partial<DomainFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  return {
    domains,
    loading,
    error,
    filters,
    loadDomains,
    addDomain,
    updateDomain,
    deleteDomain,
    updateFilters,
    clearFilters
  }
}