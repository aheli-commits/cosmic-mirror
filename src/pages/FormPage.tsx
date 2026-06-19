import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FormPage() {
  const navigate = useNavigate()
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Validate structured date and build ISO date string (YYYY-MM-DD)
    setError(null)
    const d = Number(day)
    const m = Number(month)
    const y = Number(year)

    if (!d || !m || !y) {
      setError('Please enter a valid day, month and year.')
      return
    }

    const candidate = new Date(Date.UTC(y, m - 1, d))
    if (candidate.getUTCFullYear() !== y || candidate.getUTCMonth() + 1 !== m || candidate.getUTCDate() !== d) {
      setError('The date entered is not valid. Please check day, month and year.')
      return
    }

    const iso = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

    // Save submitted values so the loading screen can POST them to the API
    const payload = { date: iso, time, location }
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
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          Birth Date
          <div className="date-row">
            <select value={day} onChange={e => setDay(e.target.value)} required aria-label="Day">
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select value={month} onChange={e => setMonth(e.target.value)} required aria-label="Month">
              <option value="">Month</option>
              {[
                'January','February','March','April','May','June','July','August','September','October','November','December'
              ].map((name, idx) => (
                <option key={idx} value={idx + 1}>{name}</option>
              ))}
            </select>

            <select value={year} onChange={e => setYear(e.target.value)} required aria-label="Year">
              <option value="">Year</option>
              {(() => {
                const current = new Date().getFullYear()
                const years = [] as number[]
                for (let y = current; y >= 1900; y--) years.push(y)
                return years.map(y => <option key={y} value={y}>{y}</option>)
              })()}
            </select>
          </div>
          {error && <div style={{ color: '#ffcccb', marginTop: 6 }}>{error}</div>}
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
