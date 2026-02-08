// Simple in-memory rate limiter for brute force protection
// In production, use Redis or database-backed rate limiting

const loginAttempts = new Map()
const blockedIPs = new Set()

const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 60 * 60 * 1000, // 1 hour block
}

export function isBlocked(ip) {
  // Clean up expired blocks
  const now = Date.now()
  for (const [blockedIp, unblockTime] of blockedIPs.entries()) {
    if (now > unblockTime) {
      blockedIPs.delete(blockedIp)
      loginAttempts.delete(blockedIp)
    }
  }

  return blockedIPs.has(ip)
}

export function recordAttempt(ip) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT.windowMs

  // Get or create attempts array
  let attempts = loginAttempts.get(ip) || []
  
  // Remove old attempts outside window
  attempts = attempts.filter(time => time > windowStart)
  
  // Add current attempt
  attempts.push(now)
  loginAttempts.set(ip, attempts)

  // Check if should block
  if (attempts.length >= RATE_LIMIT.maxAttempts) {
    blockedIPs.set(ip, now + RATE_LIMIT.blockDurationMs)
    return { blocked: true, remaining: 0 }
  }

  return {
    blocked: false,
    remaining: RATE_LIMIT.maxAttempts - attempts.length,
    attempts: attempts.length,
  }
}

export function getClientIP(request) {
  // Try various headers in order of preference
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export function sanitizeInput(input, maxLength = 500) {
  if (typeof input !== 'string') return ''
  return input.trim().slice(0, maxLength)
}

export function validateEmail(email) {
  const sanitized = sanitizeInput(email, 254)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(sanitized) ? sanitized : null
}

export function validateSlug(slug) {
  const sanitized = sanitizeInput(slug, 200)
  // Only allow alphanumeric, hyphens, underscores
  const slugRegex = /^[a-zA-Z0-9_-]+$/
  return slugRegex.test(sanitized) ? sanitized : null
}

export function validateId(id) {
  const num = Number(id)
  if (isNaN(num) || num < 1 || num > 2147483647) return null
  return num
}

export function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Content Security Policy helper
export function generateCSP() {
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Required for some Next.js features
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'img-src': ["'self'", "data:", "blob:", "https:"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'connect-src': ["'self'"],
    'media-src': ["'self'", "https:"],
    'frame-src': ["'self'", "https://www.youtube.com", "https://player.vimeo.com"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  }
  
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

// Validate redirect URL to prevent open redirects
export function validateRedirect(url) {
  if (!url || typeof url !== 'string') return null
  
  // Only allow internal paths (starting with /)
  if (!url.startsWith('/')) return null
  
  // Block protocol-relative URLs and javascript:
  if (url.startsWith('//') || url.toLowerCase().startsWith('javascript:')) return null
  
  // Block URLs with @ symbol (user info) or multiple slashes (path traversal)
  if (url.includes('@') || url.includes('/../') || url.includes('/./')) return null
  
  // Only allow alphanumeric, hyphens, underscores, forward slashes, and URL encoding
  const validPathRegex = /^\/[a-zA-Z0-9_\-\/\?\=\&\%\#\.]*$/
  return validPathRegex.test(url) ? url : '/admin'
}
