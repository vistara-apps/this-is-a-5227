import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { dbHelpers } from '../lib/supabase'
import PinataService from '../services/pinata'
import OpenAIService from '../services/openai'

export const useIncidents = () => {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load user incidents
  const loadIncidents = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const userIncidents = await dbHelpers.getUserIncidents(user.id)
      setIncidents(userIncidents)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load incidents:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create new incident
  const createIncident = async (incidentData) => {
    if (!user) throw new Error('User not authenticated')

    setLoading(true)
    setError(null)

    try {
      const incidentId = crypto.randomUUID()
      const timestamp = new Date().toISOString()

      const newIncident = {
        incidentId,
        userId: user.id,
        timestamp,
        location: incidentData.location,
        notes: incidentData.notes,
        recordingUrl: null,
        shareableCardUrl: null
      }

      // Upload recording if provided
      if (incidentData.recordingFile) {
        const uploadResult = await PinataService.uploadIncidentPackage(
          incidentData.recordingFile,
          newIncident
        )
        newIncident.recordingUrl = uploadResult.recording.url
      }

      // Generate shareable card if requested
      if (incidentData.generateCard) {
        const cardContent = await OpenAIService.generateShareableCard(newIncident)
        const cardResult = await PinataService.uploadJSON(
          { content: cardContent, incident: newIncident },
          {
            name: `incident_card_${incidentId}`,
            type: 'shareable_card',
            userId: user.id
          }
        )
        newIncident.shareableCardUrl = cardResult.url
      }

      // Save to database
      const savedIncident = await dbHelpers.createIncident(newIncident)
      
      // Update local state
      setIncidents(prev => [savedIncident, ...prev])

      return savedIncident
    } catch (err) {
      setError(err.message)
      console.error('Failed to create incident:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get incident by ID
  const getIncident = async (incidentId) => {
    setLoading(true)
    setError(null)

    try {
      const incident = await dbHelpers.getIncident(incidentId)
      return incident
    } catch (err) {
      setError(err.message)
      console.error('Failed to get incident:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete incident (and associated files)
  const deleteIncident = async (incidentId) => {
    setLoading(true)
    setError(null)

    try {
      const incident = incidents.find(i => i.incident_id === incidentId)
      if (!incident) throw new Error('Incident not found')

      // Delete from IPFS if recording exists
      if (incident.recording_url) {
        const ipfsHash = incident.recording_url.split('/').pop()
        await PinataService.unpinFile(ipfsHash)
      }

      // Delete shareable card from IPFS if exists
      if (incident.shareable_card_url) {
        const ipfsHash = incident.shareable_card_url.split('/').pop()
        await PinataService.unpinFile(ipfsHash)
      }

      // Delete from database (this would need to be implemented in dbHelpers)
      // await dbHelpers.deleteIncident(incidentId)

      // Update local state
      setIncidents(prev => prev.filter(i => i.incident_id !== incidentId))

      return true
    } catch (err) {
      setError(err.message)
      console.error('Failed to delete incident:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Generate incident summary
  const generateIncidentSummary = async (incidentId) => {
    const incident = incidents.find(i => i.incident_id === incidentId)
    if (!incident) throw new Error('Incident not found')

    try {
      const summary = await OpenAIService.generateIncidentSummary({
        timestamp: incident.timestamp,
        location: incident.location_lat && incident.location_lng 
          ? { lat: incident.location_lat, lng: incident.location_lng }
          : null,
        notes: incident.notes
      })

      return summary
    } catch (err) {
      console.error('Failed to generate summary:', err)
      throw err
    }
  }

  // Get incident statistics
  const getIncidentStats = () => {
    const stats = {
      total: incidents.length,
      thisMonth: 0,
      withRecordings: 0,
      withLocation: 0,
      byMonth: {}
    }

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    incidents.forEach(incident => {
      const incidentDate = new Date(incident.created_at)
      const monthKey = `${incidentDate.getFullYear()}-${incidentDate.getMonth()}`

      // Count this month
      if (incidentDate.getMonth() === currentMonth && 
          incidentDate.getFullYear() === currentYear) {
        stats.thisMonth++
      }

      // Count with recordings
      if (incident.recording_url) {
        stats.withRecordings++
      }

      // Count with location
      if (incident.location_lat && incident.location_lng) {
        stats.withLocation++
      }

      // Group by month
      stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + 1
    })

    return stats
  }

  // Load incidents when user changes
  useEffect(() => {
    if (user) {
      loadIncidents()
    } else {
      setIncidents([])
    }
  }, [user])

  return {
    incidents,
    loading,
    error,
    createIncident,
    getIncident,
    deleteIncident,
    generateIncidentSummary,
    getIncidentStats,
    refreshIncidents: loadIncidents
  }
}

export default useIncidents
