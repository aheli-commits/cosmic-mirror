import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../components/Card'

const TITLE_MAP: Record<string, string> = {
  personality: 'Your Inner Nature',
  strengths: 'Your Gifts',
  challenges: 'Your Growth Edge',
  relationships: 'The Way You Connect',
  career: 'Where You Thrive'
}

export default function Results() {
  const loc = useLocation()
  const navigate = useNavigate()
  const initial = (loc.state as any)?.results

  const [results, setResults] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [readingSource, setReadingSource] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      setResults(initial)
      try {
        sessionStorage.setItem('reading', JSON.stringify(initial))
        const storedSource = sessionStorage.getItem('readingSource')
        if (storedSource) setReadingSource(storedSource)
      } catch (e) {}
    } else {
      try {
        const stored = JSON.parse(sessionStorage.getItem('reading') || 'null')
        setResults(stored)
        const storedSource = sessionStorage.getItem('readingSource')
        if (storedSource) setReadingSource(storedSource)
      } catch (e) {
        setResults(null)
      }
    }
  }, [initial])

  const generateAnother = useCallback(async () => {
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
      const source = res.headers.get('x-reading-source') || null
      if (source) {
        sessionStorage.setItem('readingSource', source)
        setReadingSource(source)
      }
      sessionStorage.setItem('reading', JSON.stringify(data))
      setResults(data)
    } catch (e: any) {
      setError('Failed to generate reflection. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  const onChangeDetails = useCallback(() => {
    navigate('/')
  }, [navigate])

  const entries = results ? Object.entries(results).filter(([k]) => k !== 'received') : []

  return (
    <main className="page container">
      <h2 className="section-title">Your Cosmic Reflection</h2>
      <p className="subtitle" style={{ marginTop: 8, maxWidth: 720 }}>
        Take a quiet moment to read each short reflection. Let the phrases land, notice what resonates, and consider what you might explore next.
      </p>

      <div style={{ height: 28 }} />

      <div className="cards">
        {entries.length ? (
          entries.map(([k, v]) => (
            <Card key={k} title={TITLE_MAP[k] || k} content={v as string} />
          ))
        ) : (
          <p className="subtitle">No results available. Please return and try again.</p>
        )}
      </div>

      <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'space-between', width: '100%' }}>
        <button className="btn" onClick={onChangeDetails}>
          ← Change Birth Details
        </button>

        <div style={{ marginLeft: 'auto' }}>
          <button className="btn" onClick={generateAnother} disabled={loading}>
            {loading ? 'Generating…' : '✨ Generate Another Reflection'}
          </button>
        </div>
      </div>
    </main>
  )
}
