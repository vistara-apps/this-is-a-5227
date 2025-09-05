import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database schema setup functions
export const setupDatabase = async () => {
  try {
    // Create users table (extends Supabase auth.users)
    await supabase.rpc('create_users_table')
    
    // Create incidents table
    await supabase.rpc('create_incidents_table')
    
    // Create state_legal_info table
    await supabase.rpc('create_state_legal_info_table')
    
    console.log('Database setup completed')
  } catch (error) {
    console.error('Database setup error:', error)
  }
}

// Helper functions for database operations
export const dbHelpers = {
  // User operations
  async createUserProfile(userId, userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        user_id: userId,
        email: userData.email,
        preferred_language: userData.preferredLanguage || 'en',
        subscription_status: 'free',
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Incident operations
  async createIncident(incidentData) {
    const { data, error } = await supabase
      .from('incidents')
      .insert([{
        incident_id: crypto.randomUUID(),
        user_id: incidentData.userId,
        timestamp: incidentData.timestamp || new Date().toISOString(),
        location_lat: incidentData.location?.lat,
        location_lng: incidentData.location?.lng,
        recording_url: incidentData.recordingUrl,
        notes: incidentData.notes,
        shareable_card_url: incidentData.shareableCardUrl,
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserIncidents(userId) {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getIncident(incidentId) {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('incident_id', incidentId)
      .single()
    
    if (error) throw error
    return data
  },

  // State legal info operations
  async getStateLegalInfo(stateCode) {
    const { data, error } = await supabase
      .from('state_legal_info')
      .select('*')
      .eq('state_code', stateCode)
      .single()
    
    if (error) throw error
    return data
  },

  async getAllStatesLegalInfo() {
    const { data, error } = await supabase
      .from('state_legal_info')
      .select('*')
      .order('state_code')
    
    if (error) throw error
    return data
  }
}
