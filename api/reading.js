const { OpenAI } = require('openai')

const apiKey = process.env.OPENAI_API_KEY
const openai = apiKey ? new OpenAI({ apiKey }) : null

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

const SIGN_OVERRIDES = {
  Aries: {
    personality: [
      "You often present a bold, forward-moving energy that draws others in. Beneath that drive is a reflective impatience—the sense that time is a resource to be used rather than waited for. The tension shows up when decisive action meets the need for deliberate listening. A practical takeaway is to pair your instinct to begin with a moment of quiet assessment so your momentum lands where it matters most."
    ],
    strengths: [
      "Your gift is initiating and catalyzing momentum; people notice your courage and clarity. Underneath, you can read opportunities quickly and act before doubt deepens. The contradiction is that the very impulse that opens doors can sometimes skip necessary follow-through. Growth comes by combining your appetite for beginnings with small systems that secure long-term impact."
    ],
    challenges: [
      "You may feel pressure to keep proving your capability through action, which can exhaust you over time. Beneath that, there can be a quiet fear of stagnation that drives risks. The tension is between preserving momentum and building sustainable foundations. The insight is that measured pauses will actually amplify your influence rather than diminish it."
    ],
    relationships: [
      "Others see you as a confident partner who brings energy and direction. Beneath that outgoingness you crave genuine acknowledgment for the intentions behind your actions. The subtle contradiction is wanting both admiration and emotional reciprocity. The recommendation is to invite honest reflections from close partners—this deepens trust while keeping your spark alive."
    ],
    career: [
      "In work, your appetite for leading projects and starting initiatives is clear and effective. Beneath your boldness you want to create something durable rather than fleeting. The tension appears when short-term wins crowd out the architecture of long-term success. The most rewarding paths will let you launch with conviction and steward the outcomes patiently."
    ]
  },
  Taurus: {
    personality: [
      "You often embody steadiness and a grounded presence that calms volatile situations. Beneath that reliable surface is an aesthetic sense and appetite for sensory richness—comfort matters to you. The contradiction is wanting both security and meaningful change. A helpful insight is to treat purposeful novelty as an investment in long-term satisfaction rather than a threat to stability."
    ],
    strengths: [
      "Your strengths are perseverance and practical judgment; people rely on your steady follow-through. Beneath that dependability is a subtle intuition about value—what is worth keeping and where to invest. The tension arises when guarding comfort keeps you from useful growth. The step forward is to test small changes that preserve your core while expanding possibility."
    ],
    challenges: [
      "You may resist change because you prize security and predictability, which can limit opportunity. Underneath that resistance is a natural caution that protects you from unnecessary risk. The internal struggle is balancing preservation with openness. Growth comes from framing change as a gradual refinement of what already matters to you."
    ],
    relationships: [
      "Others experience you as reliable, warm, and materially attentive—someone who makes care concrete. Beneath that generosity you expect reciprocity and clarity about commitments. The subtle tension is between offering support and needing visible appreciation. The insight is to name what you value in relationships; doing so reduces resentment and invites deeper mutuality."
    ],
    career: [
      "Professionally, your strengths lie in roles that reward steady competence, craftsmanship, and financial savvy. Beneath your practical skill is a desire for work that also feels aesthetically or ethically meaningful. The contradiction is choosing between stable roles and projects that satisfy a deeper sense of purpose. The most fulfilling paths blend reliable contribution with occasional creative ownership."
    ]
  },
  Gemini: {
    personality: [
      "You often come across as lively, quick-thinking, and conversationally agile. Beneath that bright exterior there is a restless curiosity that seeks multiple perspectives. The tension is between valuing variety and crafting depth. A useful approach is to channel curiosity into a few focused interests where your adaptability becomes a long-term advantage."
    ],
    strengths: [
      "Your gift is connecting ideas and people with ease; you’re excellent at translating between contexts. Underneath, there’s a talent for spotting overlooked links that others miss. The contradiction is that breadth can sometimes feel scattered. The insight is that deliberate constraints—time, topic, or form—turn your versatility into reliable expertise."
    ],
    challenges: [
      "You may struggle with finishing projects because new opportunities constantly appear. Beneath that tendency is genuine curiosity and fear of missing out. The internal tension is between exploration and completion. Growth looks like choosing projects that can flexibly evolve while setting clear endpoints."
    ],
    relationships: [
      "People appreciate your wit and conversational agility; you enliven interactions. Beneath that sociability you often seek intellectual stimulation more than surface-level comfort. The tension is wanting both novelty and a sense of rooted intimacy. The practical move is to cultivate a few relationships where playful curiosity is matched by steady presence."
    ],
    career: [
      "In work, you thrive in roles that require adaptability, communication, and quick learning. Beneath the apparent ease is an ability to synthesize complex information. The contradiction is craving variety while needing a sense of mastery. Seek roles that offer rotating responsibilities within a stable framework so you can grow depth without losing variety."
    ]
  },
  Cancer: {
    personality: [
      "You reliably signal warmth and protective attention; others feel cared for in your presence. Beneath this caregiving mantle is a rich emotional life that notices small shifts and historical patterns. The tension arises when you withdraw to protect your inner world rather than risk being seen. The takeaway is that selective vulnerability builds deeper security more than full withdrawal."
    ],
    strengths: [
      "Your empathy and memory for personal detail create safe spaces for people to belong. Beneath this is a perceptive radar for emotional undercurrents. The contradiction is that deep caring can sometimes feel burdensome. The insight is to organize boundaries that allow you to be generous without depleting yourself."
    ],
    challenges: [
      "You may guard yourself by stepping back when you feel exposed, which can be misunderstood as aloofness. Beneath that tendency is a genuine wish to be respected and emotionally safe. The internal struggle is balancing protection with authentic engagement. Growth comes from gradual disclosures that test safety while expanding connection."
    ],
    relationships: [
      "In relationships, you are fiercely loyal and attentive to others’ needs. Underneath your devotion is a yearning for reciprocal care that acknowledges your inner life. The tension is wanting to nurture without losing yourself. The practical step is to communicate needs early so support is reciprocal and sustainable."
    ],
    career: [
      "You often excel in roles that involve care, counseling, or tending to people and environments. Beneath that service orientation is a desire for recognition of the emotional labor you provide. The contradiction is that giving can feel more visible than the quiet competence you bring. Aim for roles where care is both valued and properly supported."
    ]
  },
  Leo: {
    personality: [
      "You project warmth, confidence, and an appetite for creative expression. Beneath the stage-ready energy is a sincere wish to be seen for your authentic gifts. The tension appears when external attention becomes the measure of worth. The takeaway is to root expression in values, not only applause—this leads to more sustainable fulfillment."
    ],
    strengths: [
      "Your natural charisma and generosity energize groups and inspire others. Beneath that flair is discipline in crafting moments and experiences. The contradiction is craving recognition while also seeking depth of impact. The insight is to align visible leadership with causes that matter to you; recognition follows meaningful contribution."
    ],
    challenges: [
      "You may feel pressure to perform confidence even when you have doubts, which can isolate you. Underneath is a need for honest, grounding feedback. The internal tension is between image and inner reality. Growth comes from inviting trusted people to reflect on both your strengths and blind spots."
    ],
    relationships: [
      "People are drawn to your warmth and big-hearted generosity. Beneath that openness you want admiration and emotional reciprocity. The tension is giving loudly while needing quiet, steady devotion. The practical move is to name both generous gestures and small daily needs so your relationships feel well-tuned."
    ],
    career: [
      "You flourish in roles that let you lead, create, and inspire—where your presence makes a difference. Beneath that, you value work that connects to legacy and meaning. The contradiction is balancing visibility with sustained craft. The best professional fit lets you showcase talent while deepening the work behind the spotlight."
    ]
  },
  Virgo: {
    personality: [
      "You come across as thoughtful, precise, and quietly competent. Beneath that attentiveness is a desire for clarity and a sense of usefulness. The tension is between refinement and self-compassion when standards become exacting. The insight is to practice small rituals of acceptance as you pursue improvement—this keeps skill from turning into harshness."
    ],
    strengths: [
      "Your strength is turning complexity into clear, manageable steps; others rely on your methodical approach. Beneath this efficiency is a capacity for deep analysis and care. The contradiction is that usefulness can overshadow delight. The takeaway is to pair your problem-solving with occasional creative lifts that refresh perspective."
    ],
    challenges: [
      "Perfectionism can cause you to fixate on small errors and miss broader progress. Underlying that is a sincere wish to do right by people and tasks. The internal tension is balancing rigor with generative momentum. Growth comes from accepting 'good enough' on some fronts to preserve energy for what truly matters."
    ],
    relationships: [
      "You show care through practical support and thoughtful attention to detail. Beneath this service is a desire for appreciation that feels specific and sincere. The tension is offering help while waiting for explicit gratitude. The practical advice is to express needs directly so care is reciprocal."
    ],
    career: [
      "At work you excel in roles that value structure, reliability, and thoughtful optimization. Beneath that competence is curiosity for mastery. The contradiction is sometimes preferring low-risk competence to bold creativity. Seek roles where disciplined craft meets opportunities for meaningful innovation."
    ]
  },
  Libra: {
    personality: [
      "You tend to bring balance, grace, and a calming social intelligence to situations. Beneath that diplomatic skill is a yearning for equitable and aesthetically pleasing harmonies. The tension appears when avoiding conflict undermines decisive action. The useful insight is that clear values let you pursue harmony without sacrificing necessary boundaries."
    ],
    strengths: [
      "Your gifts are in mediation, aesthetic judgment, and making collaborations feel fair. Underneath that diplomacy is a sensitivity to justice and beauty. The contradiction is that seeking balance can lead to indecision. The takeaway is to define core priorities so choices are aligned rather than deferred."
    ],
    challenges: [
      "Indecision or trying to please everyone can stall forward movement. Beneath that is a sincere desire to keep relationships intact. The internal struggle is choosing between immediate harmony and long-term clarity. Growth comes from practicing gentle firmness when necessary."
    ],
    relationships: [
      "People appreciate your grace, fairness, and ability to ease tension. Beneath that charm is a wish for authentic connection beyond polite exchange. The subtle tension is wanting both peace and passion. The recommendation is to invite honest conversation that balances gentleness with clear needs."
    ],
    career: [
      "You thrive where aesthetics, negotiation, and collaboration matter—design, law, or diplomacy fit well. Beneath your sociable approach is a drive to create fair systems. The contradiction is wanting consensus while also needing to make decisive moves. Look for roles that reward both curation and courageous choices."
    ]
  },
  Scorpio: {
    personality: [
      "You often carry an intensity and depth that others sense even if not fully understood. Beneath that intensity is a capacity for transformation and discerning truth. The tension is between guardedness and the desire for deep intimacy. The insight is that selective openness can unlock the trust that your depth craves."
    ],
    strengths: [
      "Your strengths include focus, emotional clarity, and the ability to see beneath surfaces. Underneath this is a talent for renewal and decisive change. The contradiction is that seeking control can sometimes block healing. The practical move is to pair your depth with practices that invite gentle release."
    ],
    challenges: [
      "You may struggle with suspicion or holding onto perceived slights, which can intensify relationships. Beneath that is a fear of betrayal and a strong need for loyalty. The internal tension is balancing intensity with trust. Growth looks like naming expectations clearly and choosing vulnerability with trusted people."
    ],
    relationships: [
      "In relationships you value authenticity and emotional honesty above surface niceties. Beneath your intensity is a longing for soul-level connection. The tension is that depth requires time and safety to develop. The recommendation is to cultivate a small circle of genuine witnesses rather than broad affirmation."
    ],
    career: [
      "You do well in roles that require investigation, strategy, or transformation—where depth matters. Underneath the drive for impact is a preference for meaningful outcomes over superficial success. The contradiction is that intense focus sometimes narrows visible options; seek positions that honor both strategic depth and collaborative input."
    ]
  },
  Sagittarius: {
    personality: [
      "You appear optimistic, inquisitive, and open to big ideas. Beneath that horizon-focused energy is a need for meaning and learning. The tension is between restless seeking and the grounding required to digest experience. The insight is that anchoring some explorations in practice creates stories you can return to and build upon."
    ],
    strengths: [
      "Your gifts include perspective, candidness, and an ability to inspire curiosity. Beneath that are philosophical instincts that want ideas to lead to wiser living. The contradiction is loving freedom while sometimes avoiding necessary constraints. The recommendation is to frame constraints as creative scaffolding rather than limits."
    ],
    challenges: [
      "Restlessness can make it hard to finish what you start, especially projects that require slow, detailed work. Underneath is a yearning for authenticity and direct experience. The internal tension is between exploration and completion. Growth comes from choosing a few meaningful pursuits to carry through."
    ],
    relationships: [
      "People enjoy your optimism and adventurous spirit; you bring a sense of possibility to interactions. Beneath that sociability you want intellectual and philosophical alignment. The tension is wanting both spontaneity and shared depth. The practical move is to invite companions who relish curiosity and also commit to mutual growth."
    ],
    career: [
      "You thrive in roles that allow learning, travel, teaching, or broad synthesis. Beneath the adventurousness is a desire to anchor ideals into practice. The contradiction is that big-picture work needs careful execution; partner with people who translate vision into sustainable steps."
    ]
  },
  Capricorn: {
    personality: [
      "You project seriousness, responsibility, and a steady focus on results. Beneath that disciplined exterior is a private ambition and a reflective patience shaped by long-term thinking. The tension appears when early sacrifices for future gains risk disconnecting you from present enjoyment. The insight is to schedule small, regular pleasures that replenish the stamina your goals require."
    ],
    strengths: [
      "Your strengths lie in planning, reliability, and a capacity to carry weight over time. Beneath that determination is a careful sense of what legacy means to you. The contradiction is that long-term investment sometimes feels lonely; building trusted collaborators makes leadership less isolated and more sustainable."
    ],
    challenges: [
      "You may tighten your focus so much that rest and informal relationships are postponed, which can breed quiet resentment. Underneath is a fear that slowing down will jeopardize progress. The internal tension is balancing ambition with care for the self. Growth comes from small rituals of rest that actually strengthen productivity over the long run."
    ],
    relationships: [
      "Others see you as dependable and solid in partnerships; you bring structure and commitment. Beneath that pragmatic approach you value partners who understand your inner aims. The subtle tension is demonstrating warmth without compromising standards. The practical advice is to let affection be shown in both steady reliability and soft, unplanned moments."
    ],
    career: [
      "Professionally you excel where responsibility, structure, and persistence are rewarded. Beneath your competence is a drive for meaningful, lasting achievement. The contradiction is that large goals require patience that can feel at odds with immediate recognition. The recommendation is to map progress with milestones that celebrate steady wins along the way."
    ]
  },
  Aquarius: {
    personality: [
      "You often appear original, intellectually independent, and oriented toward collective ideals. Beneath that innovation is a careful curiosity about systems and possibility. The tension is between radical thinking and the human work of bringing others along. The useful move is to translate ideas into small experiments that show potential rather than only theory."
    ],
    strengths: [
      "Your strengths include originality, principled thinking, and a talent for imagining better systems. Underneath is a desire for meaningful social contribution. The contradiction is sometimes appearing detached while deeply caring about outcomes. The insight is to pair visionary ideas with clear relational bridges to increase their real-world traction."
    ],
    challenges: [
      "You may feel misunderstood when your ideas outpace those around you, which can create distance. Beneath that is a wish for allies who value your perspective. The internal tension is balancing independence with the patience required to build shared momentum. Growth comes from finding a few trusted collaborators who translate vision into practice."
    ],
    relationships: [
      "People admire your originality and fairness, and you contribute novel frameworks to conversation. Beneath that civic-mindedness is a need for companions who respect autonomy. The subtle contradiction is wanting closeness without losing independence. The recommendation is to cultivate relationships where mutual curiosity and personal space coexist."
    ],
    career: [
      "You do well in roles that reward innovation, systems thinking, and social impact. Beneath your ideas is a practical desire to see change materialize. The tension is between idealism and pragmatic steps; the most satisfying roles let you prototype change in manageable stages."
    ]
  },
  Pisces: {
    personality: [
      "You often present as gentle, imaginative, and attuned to emotional nuance. Beneath that sensitivity is a generous capacity for empathy and a wide inner life. The tension arises when absorption in others' feelings leaves your own boundaries porous. The practical insight is to anchor compassion with practices that protect your energy so empathy remains regenerative."
    ],
    strengths: [
      "Your gifts include creative empathy, intuitive insight, and an ability to translate feeling into art or care. Beneath that receptivity is a deep moral imagination. The contradiction is that high sensitivity sometimes needs firm structure to be sustainable. The takeaway is to pair your openness with daily practices that give form to your compassion."
    ],
    challenges: [
      "You may blur boundaries by taking on others' emotions, which can be both a strength and a cost. Underneath is a yearning for connectedness and meaning. The internal struggle is balancing care with self-preservation. Growth comes from clear rituals of release and replenishment that allow you to keep giving without losing yourself."
    ],
    relationships: [
      "Others value your tender presence and capacity to understand beneath-the-surface feelings. Beneath that warmth is a need for partners who offer gentle consistency. The tension is between being attracted to deep emotional resonance and needing reassurance about boundaries. The practical step is to ask for steady, small signs of care that sustain long-term closeness."
    ],
    career: [
      "You flourish in roles that allow imagination, care, or healing—where meaning is prioritized over mere output. Beneath that calling is a practical need for structure to transform empathy into impact. The recommendation is to pair creative compassion with systems or collaborators who help it scale responsibly."
    ]
  }
}

function getZodiacSign(dateStr) {
  try {
    const d = new Date(dateStr)
    const m = d.getUTCMonth() + 1
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

function pickTemplate(sign, field, seed) {
  const generic = TEMPLATES.generic[field]
  const overrides = SIGN_OVERRIDES[sign]
  const list = (overrides && overrides[field]) ? overrides[field].concat(generic) : generic
  return list[Math.abs(seed) % list.length]
}

function generateLocalReading(birthDate, birthTime, birthLocation) {
  const sign = getZodiacSign(birthDate)
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

function isQuotaError(error) {
  if (!error) return false
  const msg = (error.message || '') + ' ' + (error.response?.status || '')
  return /quota|rate limit|rate_limit|insufficient_quota|429/i.test(msg)
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      if (!body) return resolve({})
      try {
        resolve(JSON.parse(body))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({ error: 'POST with birth data required' })
    return
  }

  let body
  try {
    body = await parseJsonBody(req)
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON body' })
    return
  }

  const { birthDate, birthTime, birthLocation } = body || {}

  if (!openai) {
    const local = generateLocalReading(birthDate, birthTime, birthLocation)
    res.setHeader('X-Reading-Source', 'local')
    res.status(200).json(local)
    return
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

    if (!result.personality || !result.strengths || !result.challenges || !result.relationships || !result.career) {
      throw new Error('Response missing required fields')
    }

    res.setHeader('X-Reading-Source', 'openai')
    res.status(200).json(result)
  } catch (error) {
    if (isQuotaError(error)) {
      const local = generateLocalReading(birthDate, birthTime, birthLocation)
      res.setHeader('X-Reading-Source', 'local')
      res.status(200).json(local)
      return
    }
    res.status(500).json({
      error: 'Failed to generate reading',
      message: error.message || String(error)
    })
  }
}

module.exports = handler
