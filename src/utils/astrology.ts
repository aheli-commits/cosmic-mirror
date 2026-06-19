/**
 * Simplified moon sign calculation based on birth date and time
 * Note: For production, consider using a proper ephemeris library
 */

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

export function getSunSign(dateStr: string): string {
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

export function getMoonSign(dateStr: string, timeStr: string = '12:00'): string {
  try {
    const d = new Date(dateStr)
    const month = d.getUTCMonth() + 1
    const day = d.getUTCDate()
    const year = d.getUTCFullYear()
    
    // Parse time
    const [hours, minutes] = timeStr.split(':').map(Number)
    const adjustedHour = hours + minutes / 60
    
    // Simple deterministic calculation based on date and time
    // Moon moves approximately 12-13 degrees per day through zodiac
    // This creates a distributed pattern of moon signs
    let daysSinceEpoch = Math.floor((d.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24))
    let timeInfluence = Math.floor(adjustedHour * 2)
    
    let seed = (daysSinceEpoch + timeInfluence) % 360
    let moonSignIndex = Math.floor(seed / 30)
    
    return ZODIAC_SIGNS[moonSignIndex % 12]
  } catch (e) {
    return 'Unknown'
  }
}

export const SIGN_DESCRIPTIONS: Record<string, { short: string; long: string }> = {
  Aries: {
    short: 'Fiery pioneer and courageous trailblazer',
    long: 'Represents action, courage, and pioneering spirit'
  },
  Taurus: {
    short: 'Grounded, sensual, and steadfastly loyal',
    long: 'Represents stability, sensuality, and material security'
  },
  Gemini: {
    short: 'Quick-witted communicator and curious learner',
    long: 'Represents curiosity, communication, and adaptability'
  },
  Cancer: {
    short: 'Nurturing protector with deep intuition',
    long: 'Represents emotions, nurturing, and emotional security'
  },
  Leo: {
    short: 'Confident creator and generous-hearted leader',
    long: 'Represents creativity, confidence, and self-expression'
  },
  Virgo: {
    short: 'Practical analyst with keen discernment',
    long: 'Represents analysis, service, and refinement'
  },
  Libra: {
    short: 'Diplomatic harmonizer seeking balance',
    long: 'Represents balance, harmony, and aesthetic appreciation'
  },
  Scorpio: {
    short: 'Intense transformer with penetrating vision',
    long: 'Represents transformation, depth, and emotional power'
  },
  Sagittarius: {
    short: 'Adventurous seeker of truth and wisdom',
    long: 'Represents exploration, philosophy, and expansion'
  },
  Capricorn: {
    short: 'Ambitious builder with unwavering discipline',
    long: 'Represents achievement, responsibility, and structure'
  },
  Aquarius: {
    short: 'Visionary innovator with humanitarian ideals',
    long: 'Represents innovation, community, and progress'
  },
  Pisces: {
    short: 'Imaginative dreamer with boundless compassion',
    long: 'Represents imagination, spirituality, and intuition'
  },
  Unknown: {
    short: 'Your celestial essence',
    long: 'Awaiting cosmic alignment'
  }
}

export const SUN_DESCRIPTION = 'Represents your core identity, ego, and outward self.'
export const MOON_DESCRIPTION = 'Represents your emotional world, instincts, and inner self.'
