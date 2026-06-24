import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Landing from './pages/Landing'
import FormPage from './pages/FormPage'
import Loading from './pages/Loading'
import CosmicBlueprint from './pages/CosmicBlueprint'
import Results from './pages/Results'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/cosmic-blueprint" element={<CosmicBlueprint />} />
        <Route path="/results" element={<Results />} />
      </Routes>
      <SpeedInsights />
    </>
  )
}
