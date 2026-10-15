import { describe, it, expect } from 'vitest'
import { LoggerService } from '../src/lib/services/logger.service'

describe('LoggerService', () => {
  it('should mask sensitive keys in objects', () => {
    const payload = {
      user: 'test_user',
      password: 'super_secret_password_123',
      creditCard: '4111-1111-1111-1111',
      safeData: {
        amount: 100
      }
    }

    // @ts-ignore - Accessing private method for testing purposes
    const masked = LoggerService.maskSensitiveData(payload)

    expect(masked.user).toBe('test_user')
    expect(masked.safeData.amount).toBe(100)
    expect(masked.password).toBe('***MASKED***')
    expect(masked.creditCard).toBe('***MASKED***')
  })

  it('should handle null or undefined payloads', () => {
    // @ts-ignore
    expect(LoggerService.maskSensitiveData(null)).toBe(null)
    // @ts-ignore
    expect(LoggerService.maskSensitiveData(undefined)).toBe(undefined)
  })
})
