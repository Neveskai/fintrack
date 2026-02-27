import { createRateLimiter } from './rate-limiter'

describe('createRateLimiter', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('allows requests up to maxRequests', () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 })
    expect(limiter.allow()).toBe(true)
    expect(limiter.allow()).toBe(true)
    expect(limiter.allow()).toBe(true)
    expect(limiter.allow()).toBe(false)
  })

  it('returns remaining count correctly', () => {
    const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 })
    expect(limiter.remaining()).toBe(5)
    limiter.allow()
    expect(limiter.remaining()).toBe(4)
    limiter.allow()
    limiter.allow()
    expect(limiter.remaining()).toBe(2)
  })

  it('reset clears timestamps', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60_000 })
    limiter.allow()
    limiter.allow()
    expect(limiter.allow()).toBe(false)
    limiter.reset()
    expect(limiter.allow()).toBe(true)
    expect(limiter.remaining()).toBe(1)
  })

  it('sliding window: old requests free capacity', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 1000 })
    limiter.allow()
    limiter.allow()
    expect(limiter.allow()).toBe(false)
    jest.advanceTimersByTime(1001)
    expect(limiter.allow()).toBe(true)
  })
})
