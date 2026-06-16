import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FormPage() {
  const navigate = useNavigate()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Save submitted values so the loading screen can POST them to the API
    const payload = { date, time, location }
    try {
      sessionStorage.setItem('birthData', JSON.stringify(payload))
    } catch (e) {
      // ignore storage errors
    }
    // Navigate to loading screen which will redirect to results after 3s
    navigate('/loading')
  }

  return (
    <main className="page container">
      <h2 className="section-title">Enter your birth details</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Birth Date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </label>

        <label>
          Birth Time
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        </label>

        <label>
          Birth Location
          <input type="text" placeholder="City, Country" value={location} onChange={e => setLocation(e.target.value)} />
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-btn">See Your Reading</button>
        </div>
      </form>
    </main>
  )
}
