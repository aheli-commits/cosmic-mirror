import React from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../components/Card'

export default function Results() {
  const loc = useLocation()
  const stateResults = (loc.state as any)?.results
  let results = stateResults
  if (!results) {
    try {
      results = JSON.parse(sessionStorage.getItem('reading') || 'null')
    } catch (e) {
      results = null
    }
  }

  const entries = results ? Object.entries(results).filter(([k]) => k !== 'received') : []

  return (
    <main className="page container">
      <h2 className="section-title">Your Cosmic Reading</h2>
      <div className="cards">
        {entries.length ? (
          entries.map(([k, v]) => <Card key={k} title={k} content={v as string} />)
        ) : (
          <p className="subtitle">No results available. Please try again.</p>
        )}
      </div>
    </main>
  )
}
