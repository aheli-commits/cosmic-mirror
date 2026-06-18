const express = require('express')
const cors = require('cors')
const { OpenAI } = require('openai')

const app = express()
app.use(cors())
app.use(express.json())

const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.warn('Warning: OPENAI_API_KEY environment variable not set. API calls will fail.')
}

const openai = apiKey ? new OpenAI({ apiKey }) : null

// Local fallback generator using simple zodiac-based templates
function getZodiacSign(dateStr) {
  try {
    const d = new Date(dateStr)
    const m = d.getUTCMonth() + 1 // 1-12
    const day = d.getUTCDate()
    if ((m == 1 && day >= 20) || (m == 2 && day <= 18)) return 'Aquarius'
    if ((m == 2 && day >= 19) || (m == 3 && day <= 20)) return 'Pisces'
    if ((m == 3 && day >= 21) || (m == 4 && day <= 19)) return 'Aries'
    if ((m == 4 && day >= 20) || (m == 5 && day <= 20)) return 'Taurus'
    if ((m == 5 && day >= 21) || (m == 6 && day <= 20)) return 'Gemini'
    if ((m == 6 && day >= 21) || (m == 7 && day <= 22)) return 'Cancer'
    if ((m == 7 && day >= 23) || (m == 8 && day <= 22)) return 'Leo'
    if ((m == 8 && day >= 23) || (m == 9 && day <= 22)) return 'Virgo'
    if ((m == 9 && day >= 23) || (m == 10 && day <= 22)) return 'Libra'
    if ((m == 10 && day >= 23) || (m == 11 && day <= 21)) return 'Scorpio'
    if ((m == 11 && day >= 22) || (m == 12 && day <= 21)) return 'Sagittarius'
    if ((m == 12 && day >= 22) || (m == 1 && day <= 19)) return 'Capricorn'
  } catch (e) {
    return 'Unknown'
  }
  return 'Unknown'
}

const TEMPLATES = {
  generic: {
    personality: [
      "Curious and thoughtful, you seek meaning in experiences.",
      "Warm and steady, you bring calm to others.",
      "Bold and energetic, you move the world with enthusiasm.",
      "Introspective and adaptable; you learn quickly from life."
    ],
    strengths: [
      "Adaptable communicator with practical problem-solving skills.",
      "Reliable and patient; others trust your consistency.",
      "Creative risk-taker who sparks new ideas and momentum.",
      "Strong listener who synthesizes diverse perspectives."
    ],
    challenges: [
      "Tendency to overthink; benefit from simplifying choices.",
      "Can be guarded; practice opening up to close friends.",
      "Impulsiveness sometimes leads to avoidable friction.",
      "May second-guess decisions; build small rituals for clarity."
    ],
    relationships: [
      "Deeply loyal once trust is earned; values meaningful bonds.",
      "Enjoys lively conversations and shared adventures with partners.",
      "Needs occasional independence; clear boundaries help growth.",
      "Shows care through small, consistent gestures over time."
    ],
    career: [
      "Thrive in roles that mix creativity with structure.",
      "Excel in dependable, methodical careers like operations or teaching.",
      "Do well in fast-paced startups, sales, or creative leadership.",
      "Enjoy work that balances autonomy with meaningful collaboration."
    ]
  }
}

// Add sign-specific overrides to TEMPLATES to give more tailored text
const SIGN_OVERRIDES = {
  Aries: { personality: ["Fiery and pioneering, you lead with courage.", "Quick to start new ventures and embrace challenges."], strengths: ["Decisive action-taker.", "Inspires others through momentum."], challenges: ["Patience can be a struggle.", "Avoid rushing past important details."], relationships: ["Attracted to partners who match your energy.", "Needs someone who celebrates your boldness."], career: ["Leadership and entrepreneurship suit you.", "Thrives where swift decisions matter."] },
  Taurus: { personality: ["Grounded and sensual; you value stability.", "Appreciates comfort and material beauty."], strengths: ["Dependable and practical.", "Brings persistence to long-term projects."], challenges: ["Resistance to change can hold you back.", "Work on flexibility."], relationships: ["Seeks comfort and loyalty in connections.", "Shows love through tangible support."], career: ["Finance, design, or anything tangible fits well.", "Good with hands-on crafts and building."] },
  Gemini: { personality: ["Curious, adaptable, and quick-witted.", "Finds joy in variety and learning."], strengths: ["Great communicator and multitasker.", "Connects ideas quickly."], challenges: ["Scattered focus at times.", "Practice finishing what you start."], relationships: ["Attracted to mentally stimulating partners.", "Needs lively conversation and space to explore."], career: ["Media, education, or tech communication fit well.", "Well-suited to roles that require agility."] },
  Cancer: { personality: ["Nurturing and intuitive; you protect loved ones.", "Feels things deeply and remembers small details."], strengths: ["Empathy and emotional intelligence.", "Creates safe spaces for others."], challenges: ["Can retreat when feeling vulnerable.", "Balance self-care with caretaking."], relationships: ["Values deep emotional security.", "Craves reliability and emotional presence."], career: ["Counseling, caregiving, or hospitality suit you.", "Excel where empathy is central."] },
  Leo: { personality: ["Warm, charismatic, and expressive.", "Enjoys creative self-expression."], strengths: ["Confident leader and performer.", "Generous and protective of friends."], challenges: ["Can crave attention; balance humility.", "Share the spotlight sometimes."], relationships: ["Romantic and generous with partners.", "Seeks admiration and playful romance."], career: ["Creative leadership roles suit you.", "Flourishes in public-facing positions."] },
  Virgo: { personality: ["Practical, analytical, and service-oriented.", "Finds satisfaction in improvement."], strengths: ["Detail-focused and reliable.", "Organizes systems thoughtfully."], challenges: ["Perfectionism may cause stress.", "Allow for human error and rest."], relationships: ["Shows care through helpfulness.", "Prefers practical demonstrations of love."], career: ["Health, analytics, or systems roles fit well.", "Valued for efficiency and precision."] },
  Libra: { personality: ["Diplomatic, charming, and relationship-focused.", "Seeks harmony and aesthetic balance."], strengths: ["Skilled mediator and collaborator.", "Makes things feel graceful."], challenges: ["Indecision can stall progress.", "Set small deadlines to decide."], relationships: ["Seeks balance and fairness in partnerships.", "Thrives with cooperative partners."], career: ["Law, design, or diplomacy fit well.", "Good in partnerships and client-facing roles."] },
  Scorpio: { personality: ["Intense, passionate, and perceptive.", "Sees beneath surface motivations."], strengths: ["Deep focus and transformational power.", "Excellent at research and renewal."], challenges: ["Trust issues and jealousy can appear.", "Cultivate openness and forgiveness."], relationships: ["Seeks depth and loyalty.", "Values emotional honesty and commitment."], career: ["Research, investigation, or therapy fit you.", "Skilled in roles that require discretion."] },
  Sagittarius: { personality: ["Adventurous, optimistic, and philosophical.", "Seeks meaning through exploration."], strengths: ["Big-picture visionary and enthusiastic.", "Brings inspiration to teams."], challenges: ["Restlessness; commit to follow-through.", "Cultivate routines for follow-up."], relationships: ["Values freedom and shared exploration.", "Best with partners who respect autonomy."], career: ["Travel, education, or publishing suit you.", "Enjoys roles with intellectual growth."] },
  Capricorn: { personality: ["Ambitious, disciplined, and responsible.", "Values long-term achievement."], strengths: ["Long-term planning and perseverance.", "Reliable under pressure."], challenges: ["Workaholic tendencies may need balance.", "Schedule regular downtime."], relationships: ["Committed and serious in partnerships.", "Shows love through steady support."], career: ["Management, finance, or engineering fit well.", "Skilled at building sustainable structures."] },
  Aquarius: { personality: ["Innovative, idealistic, and independent.", "Enjoys collaborating on progressive ideas."], strengths: ["Original thinking and humanitarian focus.", "Sees future possibilities."], challenges: ["Can feel detached emotionally.", "Practice emotional availability."], relationships: ["Attracted to partners who respect individuality.", "Values intellectual companionship."], career: ["Tech, social change, or research suit you.", "Thrives in unconventional teams."] },
  Pisces: { personality: ["Imaginative, compassionate, and intuitive.", "Absorbs subtle emotional currents."], strengths: ["Creative empathy and sensitivity.", "Strong artistic or healing instincts."], challenges: ["Boundary-setting can be difficult.", "Practice saying no kindly."], relationships: ["Seeks soulful, supportive connections.", "Craves deep emotional resonance."], career: ["Arts, healing, or spiritual work fit well.", "Finds fulfillment in meaning-driven roles."] }
}

function pickTemplate(sign, field, seed) {
  const generic = TEMPLATES.generic[field]
  const overrides = SIGN_OVERRIDES[sign]
  const list = (overrides && overrides[field]) ? overrides[field].concat(generic) : generic
  return list[Math.abs(seed) % list.length]
}

function generateLocalReading(birthDate, birthTime, birthLocation) {
  const sign = getZodiacSign(birthDate)
  // seed deterministically from date/day/time/location
  let seed = 0
  try {
    const d = new Date(birthDate)
    seed += d.getUTCDate() || 1
  } catch (e) {
    seed += (birthDate || '').length
  }
  if (birthTime) seed += String(birthTime).split(':')[0] || 0
  if (birthLocation) seed += birthLocation.length

  return {
    personality: pickTemplate(sign, 'personality', seed),
    strengths: pickTemplate(sign, 'strengths', seed + 1),
    challenges: pickTemplate(sign, 'challenges', seed + 2),
    relationships: pickTemplate(sign, 'relationships', seed + 3),
    career: pickTemplate(sign, 'career', seed + 4)
  }
}

app.post('/api/reading', async (req, res) => {
  const { birthDate, birthTime, birthLocation } = req.body || {}
  if (!openai) {
    console.warn('OpenAI API key not configured — returning local reading')
    const local = generateLocalReading(birthDate, birthTime, birthLocation)
    return res.json(local)
  }

  try {
    const prompt = `You are an astrology and self-discovery expert. Generate a personalized cosmic reading based on the following birth information:

Birth Date: ${birthDate || 'unknown'}
Birth Time: ${birthTime || 'unknown'}
Birth Location: ${birthLocation || 'unknown'}

Provide a reading in JSON format with these exact fields (keep responses concise, 1-2 sentences each):
{
  "personality": "Description of personality traits",
  "strengths": "Key strengths and abilities",
  "challenges": "Potential challenges to overcome",
  "relationships": "Insights about relationships and connections",
  "career": "Career path and professional insights"
}

Return ONLY valid JSON, no additional text.`

    const message = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    })

    const responseText = message.choices[0]?.message?.content || '{}'
    const result = JSON.parse(responseText)

    // Validate response has required fields
    if (!result.personality || !result.strengths || !result.challenges || !result.relationships || !result.career) {
      throw new Error('Response missing required fields')
    }

    res.json(result)
  } catch (error) {
    console.error('OpenAI API error:', error && error.message)

    // Detect quota or rate-limit style errors and fall back to local generator
    const msg = (error && (error.message || '')) || ''
    const status = (error && (error.status || error.statusCode || (error.response && error.response.status))) || 0
    const isQuota = /quota|rate limit|rate_limit|insufficient_quota|429/i.test(msg) || status === 429

    if (isQuota) {
      console.warn('OpenAI quota detected — returning local reading')
      const local = generateLocalReading(birthDate, birthTime, birthLocation)
      return res.json(local)
    }

    res.status(500).json({
      error: 'Failed to generate reading',
      message: msg || String(error)
    })
  }
})

app.get('/api/reading', (req, res) => {
  res.status(400).json({ error: 'POST with birth data required' })
})

const port = process.env.PORT || 4000
const host = process.env.HOST || '0.0.0.0'
app.listen(port, host, () => console.log(`Mock API server listening on http://${host}:${port}`))
