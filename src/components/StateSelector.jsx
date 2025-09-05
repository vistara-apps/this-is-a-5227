import React, { useState } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { useLocation } from '../contexts/LocationContext'

const StateSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentState, selectState, availableStates, getCurrentLocation, loading } = useLocation()

  const stateNames = {
    'CA': 'California',
    'NY': 'New York',
    'TX': 'Texas'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
      >
        <MapPin className="h-4 w-4" />
        <span>{stateNames[currentState]}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 glass-effect rounded-lg border border-white/20 z-10">
          <div className="p-2">
            <button
              onClick={() => {
                getCurrentLocation()
                setIsOpen(false)
              }}
              disabled={loading}
              className="w-full flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <MapPin className="h-4 w-4" />
              <span>{loading ? 'Getting location...' : 'Use Current Location'}</span>
            </button>
            
            <div className="border-t border-white/20 my-2"></div>
            
            {availableStates.map((stateCode) => (
              <button
                key={stateCode}
                onClick={() => {
                  selectState(stateCode)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors ${
                  currentState === stateCode ? 'bg-white/20' : ''
                }`}
              >
                {stateNames[stateCode]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StateSelector