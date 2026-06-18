import React, { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../components/Card'

export default function Results() {
  const loc = useLocation()
  const initial = (loc.state as any)?.results

  const [results, setResults] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      setResults(initial)
      try {
        sessionStorage.setItem('reading', JSON.stringify(initial))
      } catch (e) {}
    } else {
      try {
        const stored = JSON.parse(sessionStorage.getItem('reading') || 'null')
        setResults(stored)
      } catch (e) {
        setResults(null)
      }
    }
  }, [initial])

  const tryAgain = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const raw = sessionStorage.getItem('birthData') || '{}'
      const payload = JSON.parse(raw)
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: payload.date || null,
          birthTime: payload.time || null,
          birthLocation: payload.location || null
        })
      })
      const data = await res.json()
      sessionStorage.setItem('reading', JSON.stringify(data))
      setResults(data)
    } catch (e: any) {
      setError('Failed to fetch reading. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  const entries = results ? Object.entries(results).filter(([k]) => k !== 'received') : []

  return (
    <main className="page container">
      <h2 className="section-title">Your Cosmic Reading</h2>
      <div style={{ marginBottom: 16 }}>
        <button className="btn" onClick={tryAgain} disabled={loading}>
          {loading ? 'Trying again…' : 'Try Again'}
        </button>
        {error && <span style={{ marginLeft: 12 }} className="subtitle">{error}</span>}
      </div>
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
