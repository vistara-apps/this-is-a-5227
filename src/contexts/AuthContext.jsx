import React, { createContext, useContext, useState, useEffect } from 'react'

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

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      const storedUser = localStorage.getItem('citizenshield_user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setSubscription(userData.subscription || 'free')
      }
      setLoading(false)
    }, 1000)
  }, [])

  const signIn = async (email, password) => {
    // Simulate sign in
    const userData = {
      id: '1',
      email,
      subscription: 'free',
      preferredLanguage: 'en'
    }
    setUser(userData)
    setSubscription('free')
    localStorage.setItem('citizenshield_user', JSON.stringify(userData))
    return userData
  }

  const signUp = async (email, password) => {
    // Simulate sign up
    const userData = {
      id: Date.now().toString(),
      email,
      subscription: 'free',
      preferredLanguage: 'en'
    }
    setUser(userData)
    setSubscription('free')
    localStorage.setItem('citizenshield_user', JSON.stringify(userData))
    return userData
  }

  const signOut = () => {
    setUser(null)
    setSubscription('free')
    localStorage.removeItem('citizenshield_user')
  }

  const upgradeSubscription = () => {
    const updatedUser = { ...user, subscription: 'premium' }
    setUser(updatedUser)
    setSubscription('premium')
    localStorage.setItem('citizenshield_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    loading,
    subscription,
    signIn,
    signUp,
    signOut,
    upgradeSubscription
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}