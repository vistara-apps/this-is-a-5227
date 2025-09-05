// Location utilities for geolocation and state detection

export class LocationService {
  static async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          })
        },
        (error) => {
          let errorMessage = 'Unknown location error'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  static async getStateFromCoordinates(lat, lng) {
    try {
      // Using a reverse geocoding service (in production, you'd use a proper API)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
      
      if (!response.ok) {
        throw new Error('Failed to get location data')
      }

      const data = await response.json()
      
      // Extract state code from the response
      const stateCode = this.getStateCodeFromName(data.principalSubdivision)
      
      return {
        stateCode,
        stateName: data.principalSubdivision,
        city: data.city,
        country: data.countryName,
        fullAddress: data.locality
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      throw new Error('Failed to determine state from coordinates')
    }
  }

  static getStateCodeFromName(stateName) {
    const stateMap = {
      'Alabama': 'AL',
      'Alaska': 'AK',
      'Arizona': 'AZ',
      'Arkansas': 'AR',
      'California': 'CA',
      'Colorado': 'CO',
      'Connecticut': 'CT',
      'Delaware': 'DE',
      'Florida': 'FL',
      'Georgia': 'GA',
      'Hawaii': 'HI',
      'Idaho': 'ID',
      'Illinois': 'IL',
      'Indiana': 'IN',
      'Iowa': 'IA',
      'Kansas': 'KS',
      'Kentucky': 'KY',
      'Louisiana': 'LA',
      'Maine': 'ME',
      'Maryland': 'MD',
      'Massachusetts': 'MA',
      'Michigan': 'MI',
      'Minnesota': 'MN',
      'Mississippi': 'MS',
      'Missouri': 'MO',
      'Montana': 'MT',
      'Nebraska': 'NE',
      'Nevada': 'NV',
      'New Hampshire': 'NH',
      'New Jersey': 'NJ',
      'New Mexico': 'NM',
      'New York': 'NY',
      'North Carolina': 'NC',
      'North Dakota': 'ND',
      'Ohio': 'OH',
      'Oklahoma': 'OK',
      'Oregon': 'OR',
      'Pennsylvania': 'PA',
      'Rhode Island': 'RI',
      'South Carolina': 'SC',
      'South Dakota': 'SD',
      'Tennessee': 'TN',
      'Texas': 'TX',
      'Utah': 'UT',
      'Vermont': 'VT',
      'Virginia': 'VA',
      'Washington': 'WA',
      'West Virginia': 'WV',
      'Wisconsin': 'WI',
      'Wyoming': 'WY',
      'District of Columbia': 'DC'
    }

    return stateMap[stateName] || null
  }

  static async detectUserState() {
    try {
      const position = await this.getCurrentPosition()
      const locationData = await this.getStateFromCoordinates(position.lat, position.lng)
      
      return {
        ...locationData,
        coordinates: {
          lat: position.lat,
          lng: position.lng
        },
        accuracy: position.accuracy,
        timestamp: position.timestamp
      }
    } catch (error) {
      console.error('State detection error:', error)
      throw error
    }
  }

  static formatCoordinates(lat, lng, precision = 6) {
    return {
      lat: parseFloat(lat.toFixed(precision)),
      lng: parseFloat(lng.toFixed(precision))
    }
  }

  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in kilometers
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  static isLocationPermissionGranted() {
    return new Promise((resolve) => {
      if (!navigator.permissions) {
        resolve(false)
        return
      }

      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        resolve(result.state === 'granted')
      }).catch(() => {
        resolve(false)
      })
    })
  }

  static async requestLocationPermission() {
    try {
      const position = await this.getCurrentPosition()
      return true
    } catch (error) {
      return false
    }
  }
}

export default LocationService
