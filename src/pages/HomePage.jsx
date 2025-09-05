import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, FileText, Mic, BarChart3, Globe, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import InfoCard from '../components/InfoCard'
import PrimaryButton from '../components/PrimaryButton'
import StateSelector from '../components/StateSelector'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from '../contexts/LocationContext'

const HomePage = () => {
  const { user, subscription } = useAuth()
  const { getLegalInfo } = useLocation()
  const legalInfo = getLegalInfo()

  const features = [
    {
      icon: Shield,
      title: 'State-Specific Rights',
      description: 'Know your rights tailored to your current location and state laws.',
      color: 'text-blue-400'
    },
    {
      icon: FileText,
      title: 'Conversation Scripts',
      description: 'Pre-written scripts for common police interaction scenarios.',
      color: 'text-green-400'
    },
    {
      icon: Mic,
      title: 'Incident Recording',
      description: 'One-tap recording with secure storage and documentation.',
      color: 'text-purple-400'
    },
    {
      icon: BarChart3,
      title: 'Incident Analytics',
      description: 'Track and analyze your recorded interactions over time.',
      color: 'text-orange-400'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-primary/20 rounded-2xl">
            <Shield className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Easin your <span className="text-primary">CitizenShield</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Know your rights, stay protected. Instant legal guidance in your pocket for any police interaction.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <StateSelector />
          <Link to="/rights">
            <PrimaryButton className="flex items-center space-x-2">
              <span>View My Rights</span>
              <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
          </Link>
        </div>
      </motion.div>

      {/* Current State Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <InfoCard title={`Your Rights in ${legalInfo.name}`}>
          <p className="text-white/80 leading-relaxed">{legalInfo.rightsSummary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/rights">
              <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
                Learn More
              </button>
            </Link>
            <Link to="/record">
              <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                Start Recording
              </button>
            </Link>
          </div>
        </InfoCard>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((feature, index) => (
          <InfoCard key={feature.title} className="hover:bg-white/5 transition-colors">
            <div className="flex items-start space-x-4">
              <div className={`p-3 bg-white/10 rounded-lg ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
                {index === 2 && subscription === 'free' && (
                  <span className="inline-block mt-2 px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    Premium Feature
                  </span>
                )}
              </div>
            </div>
          </InfoCard>
        ))}
      </motion.div>

      {/* Subscription CTA */}
      {subscription === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <InfoCard className="text-center bg-accent/10">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Upgrade to Premium</h3>
              <p className="text-white/80">
                Unlock advanced scripting, incident logging, multilingual support, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <span className="text-2xl font-bold text-accent">$3/month</span>
                <Link to="/settings">
                  <PrimaryButton>Upgrade Now</PrimaryButton>
                </Link>
              </div>
            </div>
          </InfoCard>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'States Covered', value: '50+' },
          { label: 'Rights Protected', value: '15+' },
          { label: 'Languages', value: '2' },
          { label: 'Users Protected', value: '10K+' }
        ].map((stat) => (
          <InfoCard key={stat.label} className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-sm text-white/60">{stat.label}</div>
          </InfoCard>
        ))}
      </motion.div>
    </div>
  )
}

export default HomePage