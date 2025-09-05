// Recording utilities for audio/video capture

export class RecordingService {
  constructor() {
    this.mediaRecorder = null
    this.recordedChunks = []
    this.stream = null
    this.isRecording = false
    this.recordingType = 'audio' // 'audio' or 'video'
  }

  async startRecording(type = 'audio', options = {}) {
    try {
      this.recordingType = type
      this.recordedChunks = []

      // Get media stream
      const constraints = this.getMediaConstraints(type, options)
      this.stream = await navigator.mediaDevices.getUserMedia(constraints)

      // Create MediaRecorder
      const mimeType = this.getSupportedMimeType(type)
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: mimeType
      })

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        this.isRecording = false
      }

      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error)
        this.stopRecording()
      }

      // Start recording
      this.mediaRecorder.start(1000) // Collect data every second
      this.isRecording = true

      return {
        success: true,
        type: type,
        mimeType: mimeType
      }
    } catch (error) {
      console.error('Recording start error:', error)
      throw new Error(`Failed to start ${type} recording: ${error.message}`)
    }
  }

  stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording to stop'))
        return
      }

      this.mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(this.recordedChunks, {
            type: this.getSupportedMimeType(this.recordingType)
          })

          // Stop all tracks
          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop())
          }

          const result = {
            blob: blob,
            size: blob.size,
            type: this.recordingType,
            mimeType: blob.type,
            duration: this.getRecordingDuration(),
            url: URL.createObjectURL(blob)
          }

          this.cleanup()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      this.mediaRecorder.stop()
    })
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
      return true
    }
    return false
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
      return true
    }
    return false
  }

  getRecordingState() {
    return {
      isRecording: this.isRecording,
      state: this.mediaRecorder?.state || 'inactive',
      type: this.recordingType,
      duration: this.getRecordingDuration()
    }
  }

  getRecordingDuration() {
    // This is a simplified duration calculation
    // In a real implementation, you'd track the actual recording time
    return this.recordedChunks.length * 1000 // Approximate duration in ms
  }

  getMediaConstraints(type, options = {}) {
    const baseConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        ...options.audio
      }
    }

    if (type === 'video') {
      baseConstraints.video = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
        facingMode: options.facingMode || 'user',
        ...options.video
      }
    }

    return baseConstraints
  }

  getSupportedMimeType(type) {
    const mimeTypes = type === 'video' 
      ? [
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm',
          'video/mp4'
        ]
      : [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/mp4',
          'audio/wav'
        ]

    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType
      }
    }

    return type === 'video' ? 'video/webm' : 'audio/webm'
  }

  cleanup() {
    this.recordedChunks = []
    this.mediaRecorder = null
    this.stream = null
    this.isRecording = false
  }

  static async checkPermissions() {
    const permissions = {
      audio: false,
      video: false
    }

    try {
      // Check audio permission
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      permissions.audio = true
      audioStream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.warn('Audio permission denied:', error)
    }

    try {
      // Check video permission
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
      permissions.video = true
      videoStream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.warn('Video permission denied:', error)
    }

    return permissions
  }

  static async requestPermissions(type = 'audio') {
    try {
      const constraints = type === 'video' 
        ? { audio: true, video: true }
        : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      console.error('Permission request failed:', error)
      return false
    }
  }

  static isRecordingSupported() {
    return !!(navigator.mediaDevices && 
              navigator.mediaDevices.getUserMedia && 
              window.MediaRecorder)
  }

  static getAvailableDevices() {
    return navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        return {
          audioInputs: devices.filter(device => device.kind === 'audioinput'),
          videoInputs: devices.filter(device => device.kind === 'videoinput'),
          audioOutputs: devices.filter(device => device.kind === 'audiooutput')
        }
      })
      .catch(error => {
        console.error('Error getting devices:', error)
        return { audioInputs: [], videoInputs: [], audioOutputs: [] }
      })
  }

  // Helper method to create a File object from the recording
  createFile(blob, filename) {
    const extension = this.recordingType === 'video' ? 'webm' : 'webm'
    const file = new File([blob], `${filename}.${extension}`, {
      type: blob.type,
      lastModified: Date.now()
    })
    return file
  }

  // Helper method to convert blob to base64
  static blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}

export default RecordingService
