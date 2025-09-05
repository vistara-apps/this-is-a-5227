import axios from 'axios'

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY
const PINATA_BASE_URL = 'https://api.pinata.cloud'

export class PinataService {
  static async uploadFile(file, metadata = {}) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Add metadata
      const pinataMetadata = {
        name: metadata.name || file.name,
        keyvalues: {
          type: metadata.type || 'incident_recording',
          timestamp: metadata.timestamp || new Date().toISOString(),
          userId: metadata.userId || 'anonymous',
          ...metadata.keyvalues
        }
      }
      
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata))
      
      // Pinata options
      const pinataOptions = {
        cidVersion: 1,
        wrapWithDirectory: false
      }
      
      formData.append('pinataOptions', JSON.stringify(pinataOptions))

      const response = await axios.post(
        `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      )

      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      }
    } catch (error) {
      console.error('Pinata upload error:', error)
      throw new Error('Failed to upload file to IPFS')
    }
  }

  static async uploadJSON(jsonData, metadata = {}) {
    try {
      const pinataMetadata = {
        name: metadata.name || 'incident_data.json',
        keyvalues: {
          type: metadata.type || 'incident_metadata',
          timestamp: metadata.timestamp || new Date().toISOString(),
          userId: metadata.userId || 'anonymous',
          ...metadata.keyvalues
        }
      }

      const pinataOptions = {
        cidVersion: 1
      }

      const data = {
        pinataContent: jsonData,
        pinataMetadata,
        pinataOptions
      }

      const response = await axios.post(
        `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY
          }
        }
      )

      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      }
    } catch (error) {
      console.error('Pinata JSON upload error:', error)
      throw new Error('Failed to upload JSON to IPFS')
    }
  }

  static async getFileFromIPFS(ipfsHash) {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
      return response.data
    } catch (error) {
      console.error('IPFS retrieval error:', error)
      throw new Error('Failed to retrieve file from IPFS')
    }
  }

  static async listPinnedFiles(userId = null) {
    try {
      const params = {
        status: 'pinned',
        pageLimit: 100
      }

      if (userId) {
        params.metadata = {
          keyvalues: {
            userId: {
              value: userId,
              op: 'eq'
            }
          }
        }
      }

      const response = await axios.get(
        `${PINATA_BASE_URL}/data/pinList`,
        {
          headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY
          },
          params
        }
      )

      return response.data.rows.map(file => ({
        ipfsHash: file.ipfs_pin_hash,
        size: file.size,
        timestamp: file.date_pinned,
        metadata: file.metadata,
        url: `https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}`
      }))
    } catch (error) {
      console.error('Pinata list error:', error)
      throw new Error('Failed to list pinned files')
    }
  }

  static async unpinFile(ipfsHash) {
    try {
      await axios.delete(
        `${PINATA_BASE_URL}/pinning/unpin/${ipfsHash}`,
        {
          headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY
          }
        }
      )
      return true
    } catch (error) {
      console.error('Pinata unpin error:', error)
      throw new Error('Failed to unpin file')
    }
  }

  static async testAuthentication() {
    try {
      const response = await axios.get(
        `${PINATA_BASE_URL}/data/testAuthentication`,
        {
          headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY
          }
        }
      )
      return response.data.message === 'Congratulations! You are communicating with the Pinata API!'
    } catch (error) {
      console.error('Pinata auth test error:', error)
      return false
    }
  }

  // Helper method to create incident package (recording + metadata)
  static async uploadIncidentPackage(recordingFile, incidentData) {
    try {
      // Upload the recording file
      const recordingResult = await this.uploadFile(recordingFile, {
        name: `incident_recording_${incidentData.incidentId}`,
        type: 'incident_recording',
        timestamp: incidentData.timestamp,
        userId: incidentData.userId,
        keyvalues: {
          incidentId: incidentData.incidentId,
          location: incidentData.location ? `${incidentData.location.lat},${incidentData.location.lng}` : null
        }
      })

      // Upload the metadata
      const metadataResult = await this.uploadJSON(incidentData, {
        name: `incident_metadata_${incidentData.incidentId}`,
        type: 'incident_metadata',
        timestamp: incidentData.timestamp,
        userId: incidentData.userId,
        keyvalues: {
          incidentId: incidentData.incidentId,
          recordingHash: recordingResult.ipfsHash
        }
      })

      return {
        recording: recordingResult,
        metadata: metadataResult,
        packageUrl: `https://gateway.pinata.cloud/ipfs/${metadataResult.ipfsHash}`
      }
    } catch (error) {
      console.error('Incident package upload error:', error)
      throw new Error('Failed to upload incident package')
    }
  }
}

export default PinataService
