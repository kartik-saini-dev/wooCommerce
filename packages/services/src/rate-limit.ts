import { prisma } from "./db"

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes

export async function checkRateLimit(ipAddress: string, email: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const attempt = await prisma.loginAttempt.findUnique({
      where: {
        ipAddress_email: {
          ipAddress,
          email,
        }
      }
    })

    if (!attempt) {
      return { allowed: true, remaining: MAX_ATTEMPTS }
    }

    if (attempt.lockUntil && attempt.lockUntil > new Date()) {
      return { allowed: false, remaining: 0 }
    }

    // Reset attempts if lockout has expired
    if (attempt.lockUntil && attempt.lockUntil <= new Date()) {
      await prisma.loginAttempt.update({
        where: { id: attempt.id },
        data: { attempts: 0, lockUntil: null }
      })
      return { allowed: true, remaining: MAX_ATTEMPTS }
    }

    const remaining = Math.max(0, MAX_ATTEMPTS - attempt.attempts)
    return { allowed: attempt.attempts < MAX_ATTEMPTS, remaining }
  } catch (error) {
    console.error("Rate limit check failed:", error)
    // Fail open or closed? Fail open to prevent complete denial of service if DB is flaky, 
    // but log the error heavily.
    return { allowed: true, remaining: 1 }
  }
}

export async function recordLoginAttempt(ipAddress: string, email: string, successful: boolean): Promise<void> {
  try {
    if (successful) {
      await prisma.loginAttempt.deleteMany({
        where: { ipAddress, email }
      })
      return
    }

    const attempt = await prisma.loginAttempt.findUnique({
      where: {
        ipAddress_email: {
          ipAddress,
          email,
        }
      }
    })

    if (!attempt) {
      await prisma.loginAttempt.create({
        data: {
          ipAddress,
          email,
          attempts: 1,
        }
      })
      return
    }

    const newAttempts = attempt.attempts + 1
    const lockUntil = newAttempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null

    await prisma.loginAttempt.update({
      where: { id: attempt.id },
      data: {
        attempts: newAttempts,
        lockUntil
      }
    })
  } catch (error) {
    console.error("Failed to record login attempt:", error)
  }
}
