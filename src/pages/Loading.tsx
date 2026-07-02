import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSunSign, getMoonSign, getRisingSign } from '../utils/astrology'

const MESSAGES = [
  'Reading emotional patterns...',
  'Mapping contradictions...',
  'Interpreting archetypal energy...',
  'Building your cosmic blueprint...'
]

export default function Loading() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % MESSAGES.length), 1400)

    let cancelled = false

    const timer = new Promise(resolve => setTimeout(resolve, 3000))

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
            birthLocation: (payload as any).location || null,
            astrology: {
              sunSign: getSunSign((payload as any).date || ''),
              moonSign: (payload as any).time ? getMoonSign((payload as any).date || '', (payload as any).time || '12:00') : '',
              risingSign: getRisingSign((payload as any).date || '', (payload as any).time || '12:00')
            }
          })
        })
        const data = await res.json()
        sessionStorage.setItem('reading', JSON.stringify(data))
        return data
      } catch (e) {
        return null
      }
    })()

    Promise.all([timer, fetcher]).then(([, data]) => {
      if (cancelled) return

      const birthDate = (payload as any).date || ''
      const birthTime = (payload as any).time || '12:00'
      const sunSign = getSunSign(birthDate)
      const hasBirthTime = Boolean((payload as any).time)
      const moonSign = hasBirthTime
        ? getMoonSign(birthDate, birthTime)
        : ''
      const risingSign = getRisingSign(birthDate, birthTime)
      const readingContext = {
        birthDate,
        birthTime,
        birthLocation: (payload as any).location || null,
        astrology: {
          sunSign,
          moonSign,
          risingSign
        }
      }

      console.log('[reading-context]', readingContext)
      sessionStorage.setItem('readingContext', JSON.stringify(readingContext))

      navigate('/cosmic-blueprint', {
        state: {
          sunSign,
          moonSign,
          risingSign,
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
        <div className="loading-orbit" aria-hidden>
          <div className="loading-core" />
          <div className="loading-ring ring-one" />
          <div className="loading-ring ring-two" />
        </div>
        <p className="loading-eyebrow">Cosmic Mirror</p>
        <p className="loading-message">{MESSAGES[index]}</p>
        <p className="loading-hint">This usually takes a few seconds.</p>
      </div>
    </main>
  )
}
