import React, { useState } from 'react'
import { Shield, CheckCircle, XCircle, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import InfoCard from '../components/InfoCard'
import StateSelector from '../components/StateSelector'
import { useLocation } from '../contexts/LocationContext'
import { useAuth } from '../contexts/AuthContext'

const RightsPage = () => {
  const [language, setLanguage] = useState('en')
  const { getLegalInfo } = useLocation()
  const { subscription } = useAuth()
  const legalInfo = getLegalInfo()

  const scenarios = [
    {
      id: 'traffic_stop',
      title: 'Traffic Stop',
      description: 'What to do when pulled over by police'
    },
    {
      id: 'questioning',
      title: 'Police Questioning',
      description: 'Your rights during police questioning'
    },
    {
      id: 'search_warrant',
      title: 'Search & Seizure',
      description: 'Understanding search warrants and consent'
    },
    {
      id: 'arrest',
      title: 'Arrest Procedures',
      description: 'Your rights during arrest'
    }
  ]

  const translations = {
    en: {
      rights: 'Your Rights',
      doSay: 'What TO Say',
      dontSay: 'What NOT to Say',
      scenarios: 'Common Scenarios'
    },
    es: {
      rights: 'Sus Derechos',
      doSay: 'Qué DECIR',
      dontSay: 'Qué NO Decir',
      scenarios: 'Escenarios Comunes'
    }
  }

  const t = translations[language]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-white">{t.rights}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <StateSelector />
          
          {subscription === 'premium' && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-white/60" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          )}
        </div>
      </motion.div>

      {/* Rights Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <InfoCard title={`${t.rights} in ${legalInfo.name}`}>
          <p className="text-white/80 leading-relaxed text-lg">{legalInfo.rightsSummary}</p>
        </InfoCard>
      </motion.div>

      {/* Scripts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Do Say */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InfoCard title={t.doSay} variant="script">
            <div className="space-y-3">
              {legalInfo.doSayScript.map((script, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-white/90">{script}</p>
                </div>
              ))}
            </div>
          </InfoCard>
        </motion.div>

        {/* Don't Say */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <InfoCard title={t.dontSay} variant="script">
            <div className="space-y-3">
              {legalInfo.dontSayScript.map((script, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-white/90">{script}</p>
                </div>
              ))}
            </div>
          </InfoCard>
        </motion.div>
      </div>

      {/* Common Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <InfoCard title={t.scenarios}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <h4 className="font-medium text-white mb-2">{scenario.title}</h4>
                <p className="text-white/70 text-sm">{scenario.description}</p>
                {subscription === 'free' && scenario.id !== 'traffic_stop' && (
                  <span className="inline-block mt-2 px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    Premium
                  </span>
                )}
              </div>
            ))}
          </div>
        </InfoCard>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <div className="inline-block p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-sm font-medium">
            ⚠️ Legal Disclaimer: This information is for educational purposes only. Consult with a qualified attorney for specific legal advice.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default RightsPage