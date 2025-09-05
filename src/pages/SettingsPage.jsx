import React, { useState } from 'react'
import { Settings, Crown, CreditCard, Globe, Shield, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import InfoCard from '../components/InfoCard'
import PrimaryButton from '../components/PrimaryButton'
import { useAuth } from '../contexts/AuthContext'

const SettingsPage = () => {
  const { user, subscription, upgradeSubscription } = useAuth()
  const [language, setLanguage] = useState('en')
  const [notifications, setNotifications] = useState(true)

  const handleUpgrade = () => {
    // In production, integrate with Stripe
    if (confirm('Upgrade to Premium for $3/month?')) {
      upgradeSubscription()
      alert('Successfully upgraded to Premium!')
    }
  }

  const features = {
    free: [
      'Basic rights information',
      'Traffic stop guidance',
      'Single state access'
    ],
    premium: [
      'All free features',
      'Advanced conversation scripts',
      'Incident recording & storage',
      'Multi-language support',
      'All 50 states coverage',
      'Secure cloud backup',
      'Priority support'
    ]
  }

  if (!user) {
    return (
      <div className="text-center space-y-6">
        <InfoCard>
          <div className="text-center space-y-4">
            <Settings className="h-16 w-16 text-white/40 mx-auto" />
            <h2 className="text-xl font-semibold text-white">Sign In Required</h2>
            <p className="text-white/70">
              Please sign in to access your account settings.
            </p>
          </div>
        </InfoCard>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <InfoCard title="Account Information">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{user.email}</div>
                <div className="text-white/60 text-sm flex items-center space-x-2">
                  {subscription === 'premium' ? (
                    <>
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <span>Premium Member</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Free Plan</span>
                    </>
                  )}
                </div>
              </div>
              
              {subscription === 'free' && (
                <PrimaryButton onClick={handleUpgrade} className="flex items-center space-x-2">
                  <Crown className="h-4 w-4" />
                  <span>Upgrade</span>
                </PrimaryButton>
              )}
            </div>
          </div>
        </InfoCard>
      </motion.div>

      {/* Subscription Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <InfoCard title="Subscription Plans">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className={`p-6 rounded-lg border-2 ${subscription === 'free' ? 'border-primary bg-primary/5' : 'border-white/20 bg-white/5'}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Free Plan</h3>
                  {subscription === 'free' && (
                    <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">Current</span>
                  )}
                </div>
                
                <div className="text-2xl font-bold text-white">$0/month</div>
                
                <ul className="space-y-2">
                  {features.free.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className={`p-6 rounded-lg border-2 ${subscription === 'premium' ? 'border-accent bg-accent/5' : 'border-white/20 bg-white/5'}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <span>Premium Plan</span>
                  </h3>
                  {subscription === 'premium' && (
                    <span className="px-2 py-1 bg-accent text-white text-xs rounded-full">Current</span>
                  )}
                </div>
                
                <div className="text-2xl font-bold text-accent">$3/month</div>
                
                <ul className="space-y-2">
                  {features.premium.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {subscription === 'free' && (
                  <PrimaryButton 
                    onClick={handleUpgrade}
                    className="w-full bg-accent hover:bg-accent/80"
                  >
                    Upgrade to Premium
                  </PrimaryButton>
                )}
              </div>
            </div>
          </div>
        </InfoCard>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <InfoCard title="Preferences">
          <div className="space-y-6">
            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-white/60" />
                <div>
                  <div className="text-white font-medium">Language</div>
                  <div className="text-white/60 text-sm">Choose your preferred language</div>
                </div>
              </div>
              
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={subscription === 'free'}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            {subscription === 'free' && (
              <div className="text-xs text-white/60">
                * Multi-language support available with Premium
              </div>
            )}

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-white/60" />
                <div>
                  <div className="text-white font-medium">Notifications</div>
                  <div className="text-white/60 text-sm">Get updates about new features</div>
                </div>
              </div>
              
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-primary' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </InfoCard>
      </motion.div>

      {/* Payment Method (Premium only) */}
      {subscription === 'premium' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <InfoCard title="Payment Method">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-white/60" />
                <div>
                  <div className="text-white font-medium">•••• •••• •••• 4242</div>
                  <div className="text-white/60 text-sm">Expires 12/25</div>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
                Update
              </button>
            </div>
          </InfoCard>
        </motion.div>
      )}
    </div>
  )
}

export default SettingsPage