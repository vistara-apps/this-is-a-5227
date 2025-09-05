import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LocationProvider } from './contexts/LocationContext'
import HomePage from './pages/HomePage'
import RightsPage from './pages/RightsPage'
import RecordPage from './pages/RecordPage'
import IncidentsPage from './pages/IncidentsPage'
import SettingsPage from './pages/SettingsPage'
import AppHeader from './components/AppHeader'

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <div className="min-h-screen gradient-bg">
          <AppHeader />
          <main className="container mx-auto px-4 py-6 max-w-7xl">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rights" element={<RightsPage />} />
              <Route path="/record" element={<RecordPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </LocationProvider>
    </AuthProvider>
  )
}

export default App