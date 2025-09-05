import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Download, Share2, MapPin, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import InfoCard from '../components/InfoCard'
import PrimaryButton from '../components/PrimaryButton'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from '../contexts/LocationContext'

const RecordPage = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasRecording, setHasRecording] = useState(false)
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState(null)
  const { user, subscription } = useAuth()
  const { currentState } = useLocation()
  
  const intervalRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    if (subscription === 'free') {
      alert('Recording is a premium feature. Please upgrade to access this functionality.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        // In production, upload to Pinata/IPFS here
        setHasRecording(true)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        })
      }

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    setIsRecording(false)
    setIsPaused(false)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
  }

  const saveIncident = () => {
    const incident = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      duration: recordingTime,
      notes,
      location,
      state: currentState
    }

    // In production, save to Supabase
    const existingIncidents = JSON.parse(localStorage.getItem('incidents') || '[]')
    existingIncidents.push(incident)
    localStorage.setItem('incidents', JSON.stringify(existingIncidents))

    // Reset form
    setRecordingTime(0)
    setHasRecording(false)
    setNotes('')
    setLocation(null)
    
    alert('Incident saved successfully!')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!user) {
    return (
      <div className="text-center space-y-6">
        <InfoCard>
          <div className="text-center space-y-4">
            <Mic className="h-16 w-16 text-white/40 mx-auto" />
            <h2 className="text-xl font-semibold text-white">Sign In Required</h2>
            <p className="text-white/70">
              Please sign in to access the incident recording feature.
            </p>
          </div>
        </InfoCard>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className={`p-6 rounded-2xl ${isRecording ? 'bg-red-500/20' : 'bg-primary/20'}`}>
            <Mic className={`h-12 w-12 ${isRecording ? 'text-red-400' : 'text-primary'}`} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">Record Interaction</h1>
        <p className="text-white/70">
          Document police interactions quickly and securely
        </p>
      </motion.div>

      {/* Recording Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <InfoCard>
          <div className="text-center space-y-6">
            {/* Timer */}
            <div className="space-y-2">
              <div className={`text-4xl font-mono font-bold ${isRecording ? 'text-red-400' : 'text-white'}`}>
                {formatTime(recordingTime)}
              </div>
              {isRecording && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full recording-pulse"></div>
                  <span className="text-red-400 text-sm font-medium">
                    {isPaused ? 'PAUSED' : 'RECORDING'}
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isRecording && !hasRecording && (
                <PrimaryButton
                  onClick={startRecording}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
                >
                  <Mic className="h-5 w-5" />
                  <span>Start Recording</span>
                </PrimaryButton>
              )}

              {isRecording && (
                <>
                  {!isPaused ? (
                    <button
                      onClick={pauseRecording}
                      className="p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Pause className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={resumeRecording}
                      className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play className="h-5 w-5" />
                    </button>
                  )}
                  
                  <PrimaryButton
                    onClick={stopRecording}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <Square className="h-5 w-5" />
                    <span>Stop</span>
                  </PrimaryButton>
                </>
              )}
            </div>

            {/* Location Info */}
            {location && (
              <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Location captured</span>
              </div>
            )}
          </div>
        </InfoCard>
      </motion.div>

      {/* Recording Details */}
      {hasRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InfoCard title="Incident Details">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-white/70">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {formatTime(recordingTime)}</span>
                </div>
                <div className="flex items-center space-x-2 text-white/70">
                  <MapPin className="h-4 w-4" />
                  <span>State: {currentState}</span>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-white/80 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add any additional details about the interaction..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <PrimaryButton
                  onClick={saveIncident}
                  className="flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Save Incident</span>
                </PrimaryButton>
                
                <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </InfoCard>
        </motion.div>
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
              <h3 className="text-lg font-semibold text-white">Premium Feature</h3>
              <p className="text-white/80">
                Upgrade to Premium to unlock incident recording, secure storage, and detailed documentation features.
              </p>
              <PrimaryButton>Upgrade to Premium - $3/month</PrimaryButton>
            </div>
          </InfoCard>
        </motion.div>
      )}
    </div>
  )
}

export default RecordPage