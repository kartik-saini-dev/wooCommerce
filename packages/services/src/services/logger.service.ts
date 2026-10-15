import { prisma } from "@repo/db"

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'creditCard', 'cardNumber', 'cvv']

export class LoggerService {
  /**
   * Masks sensitive information in an object before logging
   */
  private static maskSensitiveData(data: unknown): unknown {
    if (!data) return data
    if (typeof data !== 'object') return data

    const maskedData = Array.isArray(data) ? [...data] : { ...(data as Record<string, unknown>) }

    for (const key in maskedData) {
      if (Object.prototype.hasOwnProperty.call(maskedData, key)) {
        if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
          (maskedData as Record<string, unknown>)[key] = '***MASKED***'
        } else if (typeof (maskedData as Record<string, unknown>)[key] === 'object') {
          (maskedData as Record<string, unknown>)[key] = this.maskSensitiveData((maskedData as Record<string, unknown>)[key])
        }
      }
    }
    return maskedData
  }

  /**
   * Standard info log
   */
  static info(message: string, context?: unknown) {
    const maskedContext = context ? this.maskSensitiveData(context) : undefined
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, maskedContext || '')
  }

  /**
   * Standard error log
   */
  static error(message: string, error?: unknown, context?: unknown) {
    const maskedContext = context ? this.maskSensitiveData(context) : undefined
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error, maskedContext || '')
  }

  /**
   * Audit log - Saves to the database
   */
  static async audit({
    userId,
    action,
    entity,
    entityId,
    details,
    ipAddress,
  }: {
    userId?: string
    action: string
    entity: string
    entityId?: string
    details?: unknown
    ipAddress?: string
  }) {
    try {
      const maskedDetails = details ? this.maskSensitiveData(details) : undefined
      const detailsString = maskedDetails ? JSON.stringify(maskedDetails) : null

      await prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          details: detailsString,
          ipAddress,
        }
      })

      this.info(`Audit Log: ${action} on ${entity} ${entityId || ''}`)
    } catch (error) {
      // Don't crash the app if audit logging fails, just log to console
      console.error("FAILED TO WRITE AUDIT LOG:", error)
    }
  }
}
