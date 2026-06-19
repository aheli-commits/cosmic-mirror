import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/cosmic-blueprint.css'

export default function CosmicBlueprint() {
  const navigate = useNavigate()
  const loc = useLocation()
  const state = loc.state as any || {}
  
  const [isReady, setIsReady] = useState(false)
  const [showContinue, setShowContinue] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [transitionStarted, setTransitionStarted] = useState(false)
  const sunSign = state.sunSign || 'Unknown'
  const moonSign = state.moonSign || ''
  const hasBirthTime = state.hasBirthTime ?? false
  const results = state.results

  const navigateToResults = () => {
    if (results) {
      navigate('/results', { state: { results } })
    } else {
      navigate('/results')
    }
  }

  const handleContinue = () => {
    if (transitionStarted) return
    setTransitionStarted(true)
    setIsFadingOut(true)
    setTimeout(() => {
      navigateToResults()
    }, 600)
  }

  // Auto-transition to results after the blueprint is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isReady) {
      const continueTimer = setTimeout(() => {
        setShowContinue(true)
      }, 3000)

      return () => {
        clearTimeout(continueTimer)
      }
    }
  }, [isReady])

  return (
    <main className={`page cosmic-blueprint-page${isFadingOut ? ' fade-out' : ''}`}>
      <div className="cosmic-blueprint-container">
        {/* Header */}
        <div className="blueprint-header">
          <h1 className="blueprint-title">Your Cosmic Blueprint</h1>
          <p className="blueprint-subtitle">Discovering your celestial essence</p>
        </div>

        {/* Signs Display */}
        <div className="signs-grid">
          {/* Sun Sign */}
          <div className={`sign-card sun-card ${isReady ? 'loaded' : ''}`}>
            <div className="sign-icon sun-icon">🌞</div>
            <h2 className="sign-name">{sunSign}</h2>
            <p className="sign-meaning">Core identity, ego, and outward self</p>
            <div className="sign-glow sun-glow" />
          </div>

          {/* Moon Sign */}
          <div className={`sign-card moon-card ${isReady ? 'loaded' : ''} ${!hasBirthTime ? 'locked' : ''}`}>
            <div className="sign-icon moon-icon">🌙</div>
            <h2 className="sign-name">
              {hasBirthTime ? moonSign : 'Moon Sign 🔒'}
            </h2>
            <p className="sign-meaning">
              {hasBirthTime
                ? 'Emotional world, instincts, and inner self'
                : 'Add birth time to unlock deeper emotional insights'}
            </p>
            <div className="sign-glow moon-glow" />
          </div>
        </div>

        {/* Celestial Loading Animation */}
        <div className="celestial-animation">
          <div className={`stars-container ${isReady ? 'complete' : 'mapping'}`}>
            <div className="star star-1" />
            <div className="star star-2" />
            <div className="star star-3" />
            <div className="star star-4" />
            <div className="star star-5" />
          </div>
          <p className={`animation-text ${isReady ? 'complete' : ''}`}>
            {isReady ? '✨ Celestial patterns mapped' : 'Mapping your celestial patterns…'}
          </p>
        </div>

        {/* Continue Button */}
        <div className={`blueprint-actions ${showContinue ? 'visible' : ''}`}>
          <button 
            className="btn btn--primary"
            onClick={handleContinue}
            disabled={!showContinue}
          >
            Continue to Your Reading
          </button>
        </div>
      </div>
    </main>
  )
}
