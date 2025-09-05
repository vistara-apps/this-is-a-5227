import React, { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext()

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

const stateData = {
  'CA': {
    name: 'California',
    rightsSummary: 'In California, you have the right to remain silent, refuse searches without a warrant, and record police interactions in public.',
    doSayScript: [
      'I am exercising my right to remain silent.',
      'I do not consent to any searches.',
      'Am I free to leave?',
      'I would like to speak to an attorney.'
    ],
    dontSayScript: [
      'Don\'t argue or resist physically',
      'Don\'t provide false information',
      'Don\'t consent to searches',
      'Don\'t answer questions without an attorney'
    ]
  },
  'NY': {
    name: 'New York',
    rightsSummary: 'In New York, you have constitutional rights including remaining silent, refusing consent to searches, and requesting an attorney.',
    doSayScript: [
      'I invoke my Fifth Amendment right to remain silent.',
      'I do not consent to any search.',
      'I want to speak to my lawyer.',
      'Am I being detained or am I free to go?'
    ],
    dontSayScript: [
      'Don\'t volunteer information',
      'Don\'t resist or argue',
      'Don\'t lie to police',
      'Don\'t sign anything without a lawyer'
    ]
  },
  'TX': {
    name: 'Texas',
    rightsSummary: 'Texas law protects your right to remain silent, refuse searches, and record police in public spaces.',
    doSayScript: [
      'I am invoking my right to remain silent.',
      'I do not consent to searches.',
      'I want an attorney present.',
      'Am I under arrest or free to leave?'
    ],
    dontSayScript: [
      'Don\'t resist arrest',
      'Don\'t provide false ID',
      'Don\'t consent to vehicle searches',
      'Don\'t answer questions about your activities'
    ]
  }
}

export const LocationProvider = ({ children }) => {
  const [currentState, setCurrentState] = useState('CA')
  const [loading, setLoading] = useState(false)

  const getCurrentLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate state detection based on coordinates
          // In production, use a geocoding service
          setCurrentState('CA')
          setLoading(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          setLoading(false)
        }
      )
    } else {
      setLoading(false)
    }
  }

  const selectState = (stateCode) => {
    setCurrentState(stateCode)
  }

  const getLegalInfo = (stateCode = currentState) => {
    return stateData[stateCode] || stateData['CA']
  }

  const value = {
    currentState,
    loading,
    getCurrentLocation,
    selectState,
    getLegalInfo,
    availableStates: Object.keys(stateData)
  }

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}