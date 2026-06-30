import { describe, it, expect } from 'vitest'

// ── Health check response shape tests ────────────────────────────────────────
describe('health check response', () => {
  // Test the shape of the health response without spinning up Fastify
  function buildHealthResponse() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? 'development',
      version: '1.0.0',
    }
  }

  it('returns status ok', () => {
    const res = buildHealthResponse()
    expect(res.status).toBe('ok')
  })

  it('returns a valid ISO timestamp', () => {
    const res = buildHealthResponse()
    expect(() => new Date(res.timestamp)).not.toThrow()
    expect(new Date(res.timestamp).toISOString()).toBe(res.timestamp)
  })

  it('returns version 1.0.0', () => {
    const res = buildHealthResponse()
    expect(res.version).toBe('1.0.0')
  })

  it('includes environment field', () => {
    const res = buildHealthResponse()
    expect(res).toHaveProperty('environment')
  })

  it('has all required fields', () => {
    const res = buildHealthResponse()
    expect(Object.keys(res)).toEqual(
      expect.arrayContaining(['status', 'timestamp', 'environment', 'version'])
    )
  })
})

// ── CORS origin configuration tests ──────────────────────────────────────────
describe('CORS origin configuration', () => {
  function parseCorsOrigins(corsOriginEnv?: string) {
    if (corsOriginEnv) {
      return corsOriginEnv.split(',').map((o) => o.trim())
    }
    return [
      process.env.WEB_URL ?? 'http://localhost:3000',
      process.env.ADMIN_URL ?? 'http://localhost:3002',
      /\.carrymate\.io$/,
    ]
  }

  it('parses comma-separated CORS_ORIGIN env var', () => {
    const origins = parseCorsOrigins('https://staging.carrymate.io,https://admin.carrymate.io')
    expect(origins).toHaveLength(2)
    expect(origins[0]).toBe('https://staging.carrymate.io')
    expect(origins[1]).toBe('https://admin.carrymate.io')
  })

  it('includes localhost:3000 in default origins', () => {
    const origins = parseCorsOrigins(undefined)
    expect(origins).toContain('http://localhost:3000')
  })

  it('includes localhost:3002 in default origins', () => {
    const origins = parseCorsOrigins(undefined)
    expect(origins).toContain('http://localhost:3002')
  })

  it('includes carrymate.io regex in default origins', () => {
    const origins = parseCorsOrigins(undefined)
    const regex = origins.find((o) => o instanceof RegExp) as RegExp
    expect(regex).toBeDefined()
    expect(regex.test('https://staging.carrymate.io')).toBe(true)
    expect(regex.test('https://admin.carrymate.io')).toBe(true)
    expect(regex.test('https://evil.com')).toBe(false)
  })

  it('staging.carrymate.io matches carrymate.io regex', () => {
    const origins = parseCorsOrigins(undefined)
    const regex = origins.find((o) => o instanceof RegExp) as RegExp
    expect(regex.test('https://staging.carrymate.io')).toBe(true)
  })

  it('admin.carrymate.io matches carrymate.io regex', () => {
    const origins = parseCorsOrigins(undefined)
    const regex = origins.find((o) => o instanceof RegExp) as RegExp
    expect(regex.test('https://admin.carrymate.io')).toBe(true)
  })

  it('trims whitespace from comma-separated origins', () => {
    const origins = parseCorsOrigins('  https://staging.carrymate.io , https://admin.carrymate.io  ')
    expect(origins[0]).toBe('https://staging.carrymate.io')
    expect(origins[1]).toBe('https://admin.carrymate.io')
  })
})
