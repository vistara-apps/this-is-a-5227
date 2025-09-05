import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, dbHelpers } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState('free')
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        await handleUserSession(session.user)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await handleUserSession(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setSubscription('free')
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleUserSession = async (authUser) => {
    try {
      setUser(authUser)
      
      // Get or create user profile
      let userProfile
      try {
        userProfile = await dbHelpers.getUserProfile(authUser.id)
      } catch (error) {
        // Profile doesn't exist, create it
        userProfile = await dbHelpers.createUserProfile(authUser.id, {
          email: authUser.email,
          preferredLanguage: 'en'
        })
      }
      
      setProfile(userProfile)
      setSubscription(userProfile.subscription_status || 'free')
    } catch (error) {
      console.error('Error handling user session:', error)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return data.user
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            preferred_language: userData.preferredLanguage || 'en'
          }
        }
      })

      if (error) throw error

      return data.user
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      const updatedProfile = await dbHelpers.updateUserProfile(user.id, updates)
      setProfile(updatedProfile)
      
      if (updates.subscription_status) {
        setSubscription(updates.subscription_status)
      }
      
      return updatedProfile
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const upgradeSubscription = async () => {
    try {
      await updateProfile({ subscription_status: 'premium' })
    } catch (error) {
      console.error('Subscription upgrade error:', error)
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
    } catch (error) {
      console.error('Password update error:', error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    loading,
    subscription,
    signIn,
    signUp,
    signOut,
    updateProfile,
    upgradeSubscription,
    resetPassword,
    updatePassword,
    // Computed values
    isAuthenticated: !!user,
    isPremium: subscription === 'premium',
    userEmail: user?.email || '',
    userId: user?.id || null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
