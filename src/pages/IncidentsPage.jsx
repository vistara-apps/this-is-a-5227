import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, FileText, Download, Share2, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import InfoCard from '../components/InfoCard'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'

const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([])
  const { user, subscription } = useAuth()

  useEffect(() => {
    if (user) {
      const storedIncidents = JSON.parse(localStorage.getItem('incidents') || '[]')
      setIncidents(storedIncidents.reverse()) // Show most recent first
    }
  }, [user])

  const deleteIncident = (incidentId) => {
    if (confirm('Are you sure you want to delete this incident?')) {
      const updatedIncidents = incidents.filter(incident => incident.id !== incidentId)
      setIncidents(updatedIncidents)
      localStorage.setItem('incidents', JSON.stringify(updatedIncidents.reverse()))
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  if (!user) {
    return (
      <div className="text-center space-y-6">
        <InfoCard>
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 text-white/40 mx-auto" />
            <h2 className="text-xl font-semibold text-white">Sign In Required</h2>
            <p className="text-white/70">
              Please sign in to view your recorded incidents.
            </p>
          </div>
        </InfoCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-white">My Incidents</h1>
        </div>
        
        {subscription === 'premium' && (
          <div className="text-sm text-white/60">
            {incidents.length} incident{incidents.length !== 1 ? 's' : ''} recorded
          </div>
        )}
      </motion.div>

      {/* Incidents List */}
      {incidents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <InfoCard>
            <div className="text-center space-y-4 py-8">
              <FileText className="h-16 w-16 text-white/40 mx-auto" />
              <h3 className="text-xl font-semibold text-white">No Incidents Recorded</h3>
              <p className="text-white/70">
                When you record interactions, they will appear here for easy access and management.
              </p>
              {subscription === 'free' && (
                <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-accent text-sm">
                    Upgrade to Premium to start recording and documenting incidents.
                  </p>
                </div>
              )}
            </div>
          </InfoCard>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <InfoCard className="hover:bg-white/5 transition-colors">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-white/60 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(incident.timestamp), 'PPP p')}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-white/70">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(incident.duration)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{incident.state}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteIncident(incident.id)}
                      className="p-2 text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Notes */}
                  {incident.notes && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/80 text-sm">{incident.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-2 border-t border-white/10">
                    <button className="flex items-center space-x-1 px-3 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </InfoCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Premium Feature Notice */}
      {subscription === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <InfoCard className="bg-accent/10 border-accent/20">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-white">Unlock Incident Recording</h3>
              <p className="text-white/80">
                Premium members can record, store, and manage detailed incident documentation with secure cloud storage.
              </p>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-accent">$3/month</div>
                <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/80 transition-colors">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </InfoCard>
        </motion.div>
      )}
    </div>
  )
}

export default IncidentsPage