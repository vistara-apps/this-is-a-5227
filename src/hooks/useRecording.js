import { useState, useRef, useCallback } from 'react'
import RecordingService from '../utils/recording'

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingData, setRecordingData] = useState(null)
  const [error, setError] = useState(null)
  const [permissions, setPermissions] = useState({ audio: false, video: false })

  const recordingServiceRef = useRef(null)
  const timerRef = useRef(null)

  // Initialize recording service
  const initializeRecording = useCallback(() => {
    if (!recordingServiceRef.current) {
      recordingServiceRef.current = new RecordingService()
    }
    return recordingServiceRef.current
  }, [])

  // Start recording timer
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }, [])

  // Stop recording timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Check and request permissions
  const checkPermissions = useCallback(async () => {
    try {
      const perms = await RecordingService.checkPermissions()
      setPermissions(perms)
      return perms
    } catch (err) {
      setError(err.message)
      return { audio: false, video: false }
    }
  }, [])

  // Request specific permissions
  const requestPermissions = useCallback(async (type = 'audio') => {
    try {
      const granted = await RecordingService.requestPermissions(type)
      if (granted) {
        await checkPermissions()
      }
      return granted
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [checkPermissions])

  // Start recording
  const startRecording = useCallback(async (type = 'audio', options = {}) => {
    try {
      setError(null)
      
      // Check if recording is supported
      if (!RecordingService.isRecordingSupported()) {
        throw new Error('Recording is not supported in this browser')
      }

      // Check permissions
      const perms = await checkPermissions()
      if (!perms[type]) {
        const granted = await requestPermissions(type)
        if (!granted) {
          throw new Error(`${type} permission is required for recording`)
        }
      }

      // Initialize and start recording
      const recordingService = initializeRecording()
      const result = await recordingService.startRecording(type, options)

      if (result.success) {
        setIsRecording(true)
        setIsPaused(false)
        setRecordingTime(0)
        setRecordingData(null)
        startTimer()
      }

      return result
    } catch (err) {
      setError(err.message)
      console.error('Failed to start recording:', err)
      throw err
    }
  }, [checkPermissions, requestPermissions, initializeRecording, startTimer])

  // Stop recording
  const stopRecording = useCallback(async () => {
    try {
      setError(null)
      
      if (!recordingServiceRef.current) {
        throw new Error('No active recording to stop')
      }

      const result = await recordingServiceRef.current.stopRecording()
      
      setIsRecording(false)
      setIsPaused(false)
      setRecordingData(result)
      stopTimer()

      return result
    } catch (err) {
      setError(err.message)
      console.error('Failed to stop recording:', err)
      throw err
    }
  }, [stopTimer])

  // Pause recording
  const pauseRecording = useCallback(() => {
    try {
      setError(null)
      
      if (!recordingServiceRef.current) {
        throw new Error('No active recording to pause')
      }

      const success = recordingServiceRef.current.pauseRecording()
      if (success) {
        setIsPaused(true)
        stopTimer()
      }

      return success
    } catch (err) {
      setError(err.message)
      console.error('Failed to pause recording:', err)
      return false
    }
  }, [stopTimer])

  // Resume recording
  const resumeRecording = useCallback(() => {
    try {
      setError(null)
      
      if (!recordingServiceRef.current) {
        throw new Error('No active recording to resume')
      }

      const success = recordingServiceRef.current.resumeRecording()
      if (success) {
        setIsPaused(false)
        startTimer()
      }

      return success
    } catch (err) {
      setError(err.message)
      console.error('Failed to resume recording:', err)
      return false
    }
  }, [startTimer])

  // Get recording state
  const getRecordingState = useCallback(() => {
    if (!recordingServiceRef.current) {
      return {
        isRecording: false,
        state: 'inactive',
        type: null,
        duration: 0
      }
    }

    return recordingServiceRef.current.getRecordingState()
  }, [])

  // Create file from recording data
  const createRecordingFile = useCallback((filename = 'recording') => {
    if (!recordingData || !recordingServiceRef.current) {
      throw new Error('No recording data available')
    }

    return recordingServiceRef.current.createFile(recordingData.blob, filename)
  }, [recordingData])

  // Convert recording to base64
  const getRecordingAsBase64 = useCallback(async () => {
    if (!recordingData) {
      throw new Error('No recording data available')
    }

    return await RecordingService.blobToBase64(recordingData.blob)
  }, [recordingData])

  // Clear recording data
  const clearRecording = useCallback(() => {
    setRecordingData(null)
    setRecordingTime(0)
    setError(null)
    
    if (recordingServiceRef.current) {
      recordingServiceRef.current.cleanup()
    }
  }, [])

  // Format recording time for display
  const formatRecordingTime = useCallback((seconds = recordingTime) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [recordingTime])

  // Get available recording devices
  const getAvailableDevices = useCallback(async () => {
    try {
      return await RecordingService.getAvailableDevices()
    } catch (err) {
      setError(err.message)
      return { audioInputs: [], videoInputs: [], audioOutputs: [] }
    }
  }, [])

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    stopTimer()
    if (recordingServiceRef.current) {
      recordingServiceRef.current.cleanup()
    }
  }, [stopTimer])

  return {
    // State
    isRecording,
    isPaused,
    recordingTime,
    recordingData,
    error,
    permissions,

    // Actions
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    cleanup,

    // Utilities
    checkPermissions,
    requestPermissions,
    getRecordingState,
    createRecordingFile,
    getRecordingAsBase64,
    formatRecordingTime,
    getAvailableDevices,

    // Computed
    canRecord: RecordingService.isRecordingSupported(),
    recordingDuration: formatRecordingTime(),
    hasRecording: !!recordingData
  }
}

export default useRecording
