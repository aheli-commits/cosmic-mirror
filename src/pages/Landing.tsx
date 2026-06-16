import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="page center">
      <div className="hero">
        <h1 className="title">Cosmic Mirror</h1>
        <p className="subtitle">Meet the version of yourself hidden between the stars.</p>
        <Link to="/form" className="primary-btn">Begin Your Reading</Link>
      </div>
      <footer className="credit">© Cosmic Mirror</footer>
    </main>
  )
}
