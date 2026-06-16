import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import FormPage from './pages/FormPage'
import Loading from './pages/Loading'
import Results from './pages/Results'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  )
}
