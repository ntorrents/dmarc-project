import { useState, useEffect } from 'react'
import { dnsRecordsAPI } from '../lib/api/dnsRecords'
import { IS_DEV } from '../lib/constants'
import { getErrorMessage } from '../lib/helpers'

export const useDNSRecords = (domainId) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadRecords()
  }, [domainId])

  const loadRecords = async () => {
    try {
      setLoading(true)
      setError(null)

      if (IS_DEV) {
        // Mock data for development
        const mockRecords = [
          {
            id: 1,
            domain: domainId || 1,
            type: 'DMARC',
            value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com',
            status: 'valid',
            lastChecked: '2024-01-15T10:30:00Z',
            isValid: true
          },
          {
            id: 2,
            domain: domainId || 1,
            type: 'SPF',
            value: 'v=spf1 include:_spf.google.com ~all',
            status: 'valid',
            lastChecked: '2024-01-15T10:30:00Z',
            isValid: true
          },
          {
            id: 3,
            domain: domainId || 1,
            type: 'DKIM',
            value: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
            status: 'warning',
            lastChecked: '2024-01-15T10:30:00Z',
            isValid: true,
            warnings: ['Key length could be improved']
          }
        ]
        setRecords(mockRecords)
        return
      }

      const data = await dnsRecordsAPI.list(domainId)
      setRecords(data)
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const addRecord = async (recordData) => {
    try {
      if (IS_DEV) {
        const newRecord = {
          id: Date.now(),
          domain: recordData.domain,
          type: recordData.type,
          value: recordData.value,
          status: 'pending',
          lastChecked: new Date().toISOString(),
          isValid: false
        }
        setRecords(prev => [...prev, newRecord])
        return newRecord
      }

      const newRecord = await dnsRecordsAPI.create(recordData)
      setRecords(prev => [...prev, newRecord])
      return newRecord
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      throw err
    }
  }

  const updateRecord = async (id, data) => {
    try {
      if (IS_DEV) {
        setRecords(prev => prev.map(record => 
          record.id === id ? { ...record, ...data } : record
        ))
        return
      }

      const updatedRecord = await dnsRecordsAPI.update(id, data)
      setRecords(prev => prev.map(record => 
        record.id === id ? updatedRecord : record
      ))
      return updatedRecord
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      throw err
    }
  }

  const deleteRecord = async (id) => {
    try {
      if (IS_DEV) {
        setRecords(prev => prev.filter(record => record.id !== id))
        return
      }

      await dnsRecordsAPI.delete(id)
      setRecords(prev => prev.filter(record => record.id !== id))
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      throw err
    }
  }

  const validateRecord = async (id) => {
    try {
      if (IS_DEV) {
        setRecords(prev => prev.map(record => 
          record.id === id 
            ? { ...record, status: 'valid', isValid: true, lastChecked: new Date().toISOString() }
            : record
        ))
        return
      }

      const validatedRecord = await dnsRecordsAPI.validate(id)
      setRecords(prev => prev.map(record => 
        record.id === id ? validatedRecord : record
      ))
      return validatedRecord
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      throw err
    }
  }

  return {
    records,
    loading,
    error,
    loadRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    validateRecord
  }
}