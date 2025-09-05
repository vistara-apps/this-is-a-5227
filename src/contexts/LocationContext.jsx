import React, { createContext, useContext, useState, useEffect } from 'react'
import LocationService from '../utils/location'
import { getStateLegalInfo } from '../data/stateLegalInfo'
import OpenAIService from '../services/openai'

const LocationContext = createContext()

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

export const LocationProvider = ({ children }) => {
  const [currentState, setCurrentState] = useState('CA')
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [permissionGranted, setPermissionGranted] = useState(false)

  // Check location permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const granted = await LocationService.isLocationPermissionGranted()
      setPermissionGranted(granted)
    }
    checkPermission()
  }, [])

  const detectLocation = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const locationData = await LocationService.detectUserState()
      
      setLocation({
        lat: locationData.coordinates.lat,
        lng: locationData.coordinates.lng,
        state: locationData.stateCode,
        stateName: locationData.stateName,
        city: locationData.city,
        accuracy: locationData.accuracy,
        timestamp: locationData.timestamp
      })
      
      if (locationData.stateCode) {
        setCurrentState(locationData.stateCode)
      }
      
      setPermissionGranted(true)
    } catch (err) {
      setError(err.message)
      console.error('Location detection failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const requestLocationPermission = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const granted = await LocationService.requestLocationPermission()
      setPermissionGranted(granted)
      
      if (granted) {
        await detectLocation()
      } else {
        setError('Location permission denied')
      }
      
      return granted
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const setManualState = (stateCode) => {
    setCurrentState(stateCode)
    setError(null)
  }

  const getLegalInfo = (stateCode = currentState) => {
    return getStateLegalInfo(stateCode)
  }

  const generateDynamicRights = async (scenario = 'general', language = 'en') => {
    try {
      setLoading(true)
      const summary = await OpenAIService.generateRightsSummary(currentState, scenario)
      return summary
    } catch (err) {
      console.error('Failed to generate dynamic rights:', err)
      // Fallback to static data
      const staticInfo = getLegalInfo()
      return staticInfo?.rightsSummary || 'Unable to load rights information'
    } finally {
      setLoading(false)
    }
  }

  const generateConversationScript = async (scenario, language = 'en') => {
    try {
      setLoading(true)
      const script = await OpenAIService.generateConversationScript(
        currentState, 
        scenario, 
        language
      )
      return script
    } catch (err) {
      console.error('Failed to generate conversation script:', err)
      // Fallback to static data
      const staticInfo = getLegalInfo()
      return {
        doSayScript: staticInfo?.doSayScript || 'I am exercising my right to remain silent.',
        dontSayScript: staticInfo?.dontSayScript || 'Don\'t consent to searches.',
        fullResponse: 'Unable to generate dynamic script'
      }
    } finally {
      setLoading(false)
    }
  }

  const getCurrentPosition = async () => {
    try {
      const position = await LocationService.getCurrentPosition()
      return position
    } catch (err) {
      console.error('Failed to get current position:', err)
      throw err
    }
  }

  const formatCoordinates = (lat, lng, precision = 6) => {
    return LocationService.formatCoordinates(lat, lng, precision)
  }

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    return LocationService.calculateDistance(lat1, lng1, lat2, lng2)
  }

  // Legacy compatibility methods
  const getCurrentLocation = detectLocation
  const selectState = setManualState

  const value = {
    // State
    currentState,
    location,
    loading,
    error,
    permissionGranted,

    // Actions
    detectLocation,
    requestLocationPermission,
    setManualState,
    getCurrentPosition,

    // Legacy compatibility
    getCurrentLocation,
    selectState,

    // Data access
    getLegalInfo,
    generateDynamicRights,
    generateConversationScript,

    // Utilities
    formatCoordinates,
    calculateDistance,

    // Computed values
    hasLocation: !!location,
    currentStateName: location?.stateName || 'Unknown',
    coordinates: location ? { lat: location.lat, lng: location.lng } : null,
    availableStates: ['CA', 'NY', 'TX', 'FL'] // States with legal info
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}
