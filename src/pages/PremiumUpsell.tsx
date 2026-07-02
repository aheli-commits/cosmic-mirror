import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const BENEFITS = [
  {
    title: 'Core Archetype Breakdown',
    body: 'Understand the dominant archetypes shaping your personality and emotional world.',
    icon: '✨'
  },
  {
    title: 'Emotional Patterns',
    body: 'See the unconscious patterns influencing how you react, connect, and protect yourself.',
    icon: '🪞'
  },
  {
    title: 'Relationship Dynamics',
    body: 'Explore how you love, attach, trust, and navigate intimacy.',
    icon: '❤️'
  },
  {
    title: 'Shadow Patterns',
    body: 'Identify defense mechanisms, blind spots, and emotional armor.',
    icon: '🌑'
  },
  {
    title: 'Growth Edge',
    body: 'Receive personalized insights on where healing and growth may lie.',
    icon: '🌱'
  }
]

const PAYMENT_METHODS = ['UPI', 'Credit / Debit Cards', 'Net Banking', 'International Cards']

export default function PremiumUpsell() {
  const [formData, setFormData] = useState({ name: '', email: '', country: '' })
  const [submitted, setSubmitted] = useState(false)
  const [paymentPreview, setPaymentPreview] = useState(false)
  const hasReading = Boolean(sessionStorage.getItem('reading'))

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sessionStorage.setItem('premiumUpsellLead', JSON.stringify(formData))
    setSubmitted(true)
  }

  return (
    <main className="page premium-upsell-page">
      <section className="premium-shell">
        <header className="premium-hero">
          <p className="eyebrow">Premium reading</p>
          <h1 className="premium-title">Your Cosmic Mirror reading is just the beginning.</h1>
          <p className="subtitle premium-intro">
            What you’ve seen is a glimpse of your emotional blueprint. But human patterns are rarely simple.
            Your full Cosmic Blueprint goes deeper into the contradictions, defense mechanisms, and emotional patterns that shape how you love, protect, and connect.
          </p>
          <div className="premium-hero-actions">
            <a href="#capture" className="btn btn--primary">Unlock My Full Cosmic Blueprint 🌙</a>
            <span className="premium-note">Founding pricing • ₹499 / $9</span>
          </div>
        </header>

        <section className="premium-benefits" aria-label="Premium benefits">
          <div className="premium-section-heading">
            <p className="eyebrow">What’s inside</p>
            <h2>What’s Inside Your Full Cosmic Blueprint</h2>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map(benefit => (
              <article className="benefit-card" key={benefit.title}>
                <div className="benefit-icon" aria-hidden>{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
          <p className="benefit-footer">Built for people seeking deeper self-awareness in life, love, and relationships.</p>
        </section>

        <section className="premium-pricing-card" aria-label="Pricing">
          <div className="premium-section-heading">
            <p className="eyebrow">Founding user pricing</p>
            <h2>Founding User Pricing</h2>
          </div>
          <p className="pricing-copy">As an early Cosmic Mirror user, you get access to beta pricing.</p>
          <div className="pricing-row">
            <div className="pricing-pill">
              <span className="pricing-label">India</span>
              <strong>₹499</strong>
              <span className="pricing-strike">₹999</span>
            </div>
            <div className="pricing-pill">
              <span className="pricing-label">Global</span>
              <strong>$9</strong>
              <span className="pricing-strike">$19</span>
            </div>
          </div>
          <p className="pricing-note">Limited-time pricing for early adopters.</p>
        </section>

        <section className="capture-card" id="capture">
          <div className="capture-copy">
            <p className="eyebrow">Receive your full blueprint</p>
            <h2>Receive Your Full Blueprint</h2>
            <p>Your detailed reading will be delivered to your inbox within 24–48 hours.</p>
            {hasReading && (
              <div className="pill-row">
                <span className="pill">Using your current reading context</span>
                <span className="pill">No birth details needed again</span>
              </div>
            )}
          </div>

          <form className="premium-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Ari Chen" required />
            </label>
            <label>
              Email Address
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </label>
            <label>
              Country (optional)
              <input name="country" value={formData.country} onChange={handleChange} placeholder="India" />
            </label>
            <button className="btn btn--primary" type="submit">Continue to Payment</button>
            {submitted && <p className="form-success">Thanks — your request has been saved locally for this preview. We’ll guide you to the next step from here.</p>}
          </form>
        </section>

        <section className="payments-card" aria-label="Payment placeholder">
          <div className="premium-section-heading">
            <p className="eyebrow">Secure checkout</p>
            <h2>Secure Payment Options</h2>
          </div>
          <div className="payment-methods">
            {PAYMENT_METHODS.map(method => (
              <div className="payment-pill" key={method}>{method}</div>
            ))}
          </div>
          <button className="btn btn--primary" type="button" onClick={() => setPaymentPreview(true)}>
            Proceed to Payment
          </button>
          {paymentPreview && <p className="payment-preview">Payment flow placeholder for this sprint. The premium experience is ready for integration next.</p>}
        </section>

        <div className="premium-footer-link">
          <Link to="/results" className="text-link">← Back to your reading</Link>
        </div>
      </section>
    </main>
  )
}
