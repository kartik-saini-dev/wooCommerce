import { Resend } from "resend"
import * as React from "react"
import { LoggerService } from "./logger.service"

import { BookingConfirmationEmail } from "@repo/ui/components/emails/booking-confirmation"
import { OrderReceiptEmail } from "@repo/ui/components/emails/order-receipt"
import { StatusUpdateEmail } from "@repo/ui/components/emails/status-update"

// We will import these new templates once they are created
import { WelcomeEmail } from "@repo/ui/components/emails/welcome"
import { PasswordResetEmail } from "@repo/ui/components/emails/password-reset"
import { ContactConfirmationEmail } from "@repo/ui/components/emails/contact-confirmation"
import { siteConfig } from "@repo/ui/config/site"

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')
const DEFAULT_FROM = process.env.EMAIL_FROM || `${siteConfig.name} <onboarding@resend.dev>`

export class NotificationService {
  
  private static async sendEmailSafely(options: { to: string, subject: string, react: React.ReactElement, text?: string }) {
    try {
      if (!process.env.RESEND_API_KEY) {
        LoggerService.info(`Mock Email Sent to ${options.to}`, { subject: options.subject })
        return { success: true, mocked: true }
      }

      const data = await resend.emails.send({
        from: DEFAULT_FROM,
        to: options.to,
        subject: options.subject,
        react: options.react,
      })

      if (data.error) {
        throw data.error;
      }

      LoggerService.info(`Email Sent successfully to ${options.to}`, { subject: options.subject, id: data.data?.id })
      return { success: true, data: data.data }
    } catch (error) {
      LoggerService.error(`Failed to send email to ${options.to}`, error, { subject: options.subject })
      
      // Fallback: If Resend fails (e.g. invalid key or unverified domain), print it to console so the user can still proceed locally!
      console.log("\n====== EMAIL SENDING FAILED: FALLBACK MOCK ======")
      console.log(`TO: ${options.to}`)
      console.log(`SUBJECT: ${options.subject}`)
      if (options.react && (options.react as any).props && (options.react as any).props.resetLink) {
         console.log(`RESET LINK: ${(options.react as any).props.resetLink}`)
      }
      console.log("=================================================\n")
      
      return { success: false, error }
    }
  }

  static async sendWelcomeEmail(email: string, name: string) {
    return this.sendEmailSafely({
      to: email,
      subject: `Welcome to ${siteConfig.name}!`,
      react: React.createElement(WelcomeEmail, { name }),
    })
  }

  static async sendOrderConfirmation(email: string, orderNumber: string, customerName: string, totalAmount: string, paymentMethod: string) {
    return this.sendEmailSafely({
      to: email,
      subject: `Order Confirmation #${orderNumber}`,
      react: React.createElement(OrderReceiptEmail, { orderNumber, customerName, totalAmount, paymentMethod }),
    })
  }

  static async sendOrderStatusUpdate(email: string, orderNumber: string, customerName: string, status: string, message: string) {
    return this.sendEmailSafely({
      to: email,
      subject: `Order Status Update: #${orderNumber}`,
      react: React.createElement(StatusUpdateEmail, { customerName, type: "Order", referenceNumber: orderNumber, newStatus: status }),
    })
  }

  static async sendBookingConfirmation(email: string, bookingNumber: string, customerName: string, serviceName: string, scheduledDate: string) {
    return this.sendEmailSafely({
      to: email,
      subject: `Service Booking Confirmed: #${bookingNumber}`,
      react: React.createElement(BookingConfirmationEmail, { bookingNumber, customerName, serviceName, scheduledDate }),
    })
  }

  static async sendBookingStatusUpdate(email: string, bookingNumber: string, customerName: string, status: string, message: string) {
    return this.sendEmailSafely({
      to: email,
      subject: `Booking Status Update: #${bookingNumber}`,
      react: React.createElement(StatusUpdateEmail, { customerName, type: "Booking", referenceNumber: bookingNumber, newStatus: status }),
    })
  }

  static async sendPasswordReset(email: string, resetLink: string) {
    return this.sendEmailSafely({
      to: email,
      subject: `Reset your ${siteConfig.name} password`,
      react: React.createElement(PasswordResetEmail, { resetLink }),
    })
  }

  static async sendContactFormConfirmation(email: string, name: string, subject: string) {
    return this.sendEmailSafely({
      to: email,
      subject: `We've received your message - ${siteConfig.name}`,
      react: React.createElement(ContactConfirmationEmail, { name, querySubject: subject }),
    })
  }

  static async notifyAdminContactForm(adminEmail: string, name: string, email: string, subject: string, message: string) {
    // Sending a raw HTML email for admin notifications
    try {
      if (!process.env.RESEND_API_KEY) {
        LoggerService.info(`Mock Admin Email Sent`, { subject })
        return { success: true }
      }
      await resend.emails.send({
        from: DEFAULT_FROM,
        to: adminEmail,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h3>New message from ${siteConfig.name} Contact Form</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `
      })
      return { success: true }
    } catch (error) {
      LoggerService.error(`Failed to notify admin via email`, error)
      return { success: false, error }
    }
  }
}
