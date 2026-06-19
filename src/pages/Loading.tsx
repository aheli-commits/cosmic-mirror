import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSunSign, getMoonSign } from '../utils/astrology'

const MESSAGES = [
  'Mapping the stars...',
  'Interpreting celestial patterns...',
  'Translating your cosmic blueprint...'
]

export default function Loading() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % MESSAGES.length), 1000)

    let cancelled = false

    // Minimum duration timer
    const timer = new Promise(resolve => setTimeout(resolve, 3000))

    // Prepare payload from storage
    const raw = sessionStorage.getItem('birthData') || '{}'
    let payload = {}
    try {
      payload = JSON.parse(raw)
    } catch (e) {
      payload = {}
    }

    const fetcher = (async () => {
      try {
        const res = await fetch('/api/reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            birthDate: (payload as any).date || null,
            birthTime: (payload as any).time || null,
            birthLocation: (payload as any).location || null
          })
        })
        const data = await res.json()
        // Save results for the results page fallback
        sessionStorage.setItem('reading', JSON.stringify(data))
        return data
      } catch (e) {
        return null
      }
    })()

    Promise.all([timer, fetcher]).then(([, data]) => {
      if (cancelled) return
      
      // Calculate sun and moon signs
      const sunSign = getSunSign((payload as any).date || '')
      const hasBirthTime = Boolean((payload as any).time)
      const moonSign = hasBirthTime
        ? getMoonSign((payload as any).date || '', (payload as any).time || '12:00')
        : ''

      navigate('/cosmic-blueprint', { 
        state: { 
          sunSign,
          moonSign,
          hasBirthTime,
          results: data
        } 
      })
    })

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [navigate])

  return (
    <main className="page center">
      <div className="hero loading-screen">
        <div className="spinner" aria-hidden></div>
        <p className="loading-message">{MESSAGES[index]}</p>
      </div>
    </main>
  )
}
