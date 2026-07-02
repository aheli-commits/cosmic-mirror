import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import FormPage from './pages/FormPage'
import Loading from './pages/Loading'
import CosmicBlueprint from './pages/CosmicBlueprint'
import Results from './pages/Results'
import PremiumUpsell from './pages/PremiumUpsell'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/cosmic-blueprint" element={<CosmicBlueprint />} />
      <Route path="/results" element={<Results />} />
      <Route path="/premium-upsell" element={<PremiumUpsell />} />
    </Routes>
  )
}
