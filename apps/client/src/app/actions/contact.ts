"use server"

import { prisma as db } from "@repo/db"
import { contactSchema } from "@repo/services/validations/contact"
import { checkActionRateLimit } from "@repo/services/action-rate-limit"
import { headers } from "next/headers"
import { LoggerService } from "@repo/services/services/logger.service"


export async function submitContactForm(data: unknown) {
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "anonymous"
    
    // 1. Rate limiting (max 5 requests per 15 mins per IP)
    const isAllowed = checkActionRateLimit(ip, "contact_form", 5, 900000)
    if (!isAllowed) {
      LoggerService.info("Rate limit hit for contact form", { ip })
      return { success: false, error: "Too many requests. Please try again later." }
    }

    // 2. Validate input
    const validatedData = contactSchema.safeParse(data)
    
    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Invalid form data. Please check your inputs." 
      }
    }
    
    const { name, email, subject, message, honeypot } = validatedData.data

    // 3. Honeypot check for bots
    if (honeypot && honeypot.length > 0) {
      LoggerService.info("Honeypot filled on contact form", { ip, name })
      return { success: true }
    }

    // 4. Save to Database
    const newContactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      }
    })

    // 5. Send Emails via NotificationService
    const { NotificationService } = await import("@repo/services/services/notification")
    
    // Notify admin
    await NotificationService.notifyContactMessage({
      name,
      email,
      subject,
      message
    })

    // Log the successful action
    await LoggerService.audit({
      action: "SUBMIT_CONTACT_FORM",
      entity: "ContactMessage",
      entityId: newContactMessage.id,
      ipAddress: ip,
      details: { email, subject }
    })

    return { success: true }

  } catch (error) {
    LoggerService.error("Error submitting contact form:", error)
    return { success: false, error: "An unexpected error occurred. Please try again later." }
  }
}
