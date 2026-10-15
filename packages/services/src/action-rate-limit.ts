const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

/**
 * A lightweight, in-memory rate limiter for server actions.
 * Limits the number of times a specific user can perform an action within a time window.
 * 
 * @param userId - The ID of the user performing the action
 * @param actionType - A unique string identifying the action (e.g., 'checkout', 'booking')
 * @param maxAttempts - Maximum allowed attempts within the window
 * @param windowMs - Time window in milliseconds
 * @returns boolean - true if allowed, false if rate limited
 */
export function checkActionRateLimit(
  userId: string, 
  actionType: string, 
  maxAttempts: number = 5, 
  windowMs: number = 60000 // 1 minute default
): boolean {
  const key = `${userId}:${actionType}`
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || record.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxAttempts) {
    return false
  }

  record.count++
  return true
}
