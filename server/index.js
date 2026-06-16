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

app.post('/api/reading', async (req, res) => {
  const { birthDate, birthTime, birthLocation } = req.body || {}

  if (!openai) {
    return res.status(500).json({ error: 'OpenAI API key not configured' })
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
    console.error('OpenAI API error:', error.message)
    res.status(500).json({
      error: 'Failed to generate reading',
      message: error.message
    })
  }
})

app.get('/api/reading', (req, res) => {
  res.status(400).json({ error: 'POST with birth data required' })
})

const port = process.env.PORT || 4000
const host = process.env.HOST || '0.0.0.0'
app.listen(port, host, () => console.log(`Mock API server listening on http://${host}:${port}`))
