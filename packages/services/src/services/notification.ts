import { Resend } from "resend"
import { OrderReceiptEmail } from "@repo/ui/components/emails/order-receipt"
import * as React from "react"
import { siteConfig } from "@repo/ui/config/site"

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || siteConfig.contact.email
const DEFAULT_FROM = process.env.EMAIL_FROM || `${siteConfig.name} <onboarding@resend.dev>`

export const NotificationService = {
  /**
   * Notify customer and admin about a new order
   */
  async notifyOrderPlaced({
    orderNumber,
    customerName,
    customerEmail,
    totalAmount,
    paymentMethod,
  }: {
    orderNumber: string
    customerName: string
    customerEmail: string
    totalAmount: string
    paymentMethod: string
  }) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[MOCK EMAIL] Order Placed: #${orderNumber} | Customer: ${customerEmail} | Admin: ${ADMIN_EMAIL}`)
      return { success: true }
    }

    try {
      // 1. Send to Customer
      await resend.emails.send({
        from: DEFAULT_FROM,
        to: customerEmail,
        subject: `Order Confirmation #${orderNumber}`,
        react: OrderReceiptEmail({
          orderNumber,
          customerName,
          totalAmount,
          paymentMethod,
        }) as React.ReactElement,
      })

      // 2. Send to Admin
      await resend.emails.send({
        from: DEFAULT_FROM,
        to: ADMIN_EMAIL,
        subject: `New Order Received #${orderNumber}`,
        html: `
          <h1>New Order Alert</h1>
          <p>Order Number: <strong>${orderNumber}</strong></p>
          <p>Customer: ${customerName} (${customerEmail})</p>
          <p>Total: ${totalAmount}</p>
          <p>Payment Method: ${paymentMethod}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders">View in Admin Panel</a>
        `,
      })
      
      return { success: true }
    } catch (error) {
      console.error("Failed to send order notifications:", error)
      return { success: false, error }
    }
  },

  /**
   * Notify customer and admin about a service booking
   */
  async notifyServiceBooked({
    bookingId,
    serviceName,
    customerName,
    customerEmail,
    date,
  }: {
    bookingId: string
    serviceName: string
    customerName: string
    customerEmail: string
    date: string
  }) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[MOCK EMAIL] Service Booked: ${serviceName} | Customer: ${customerEmail} | Admin: ${ADMIN_EMAIL}`)
      return { success: true }
    }

    try {
      // Customer
      await resend.emails.send({
        from: DEFAULT_FROM,
        to: customerEmail,
        subject: `Service Booking Confirmed: ${serviceName}`,
        html: `
          <h1>Booking Confirmed</h1>
          <p>Hi ${customerName},</p>
          <p>Your booking for <strong>${serviceName}</strong> on ${date} has been confirmed.</p>
          <p>Our technician will contact you shortly.</p>
        `,
      })

      // Admin
      await resend.emails.send({
        from: DEFAULT_FROM,
        to: ADMIN_EMAIL,
        subject: `New Service Booking: ${serviceName}`,
        html: `
          <h1>New Service Booking</h1>
          <p>Service: <strong>${serviceName}</strong></p>
          <p>Customer: ${customerName} (${customerEmail})</p>
          <p>Date requested: ${date}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/services">View in Admin Panel</a>
        `,
      })
      
      return { success: true }
    } catch (error) {
      console.error("Failed to send service booking notifications:", error)
      return { success: false, error }
    }
  },

  /**
   * Notify admin about a contact form message
   */
  async notifyContactMessage({
    name,
    email,
    subject,
    message,
  }: {
    name: string
    email: string
    subject: string
    message: string
  }) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[MOCK EMAIL] Contact Message: ${subject} | From: ${email} | Admin: ${ADMIN_EMAIL}`)
      return { success: true }
    }

    try {
      await resend.emails.send({
        from: DEFAULT_FROM,
        to: ADMIN_EMAIL,
        subject: `New Contact Message: ${subject}`,
        html: `
          <h1>New Message from ${name}</h1>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message}</p>
        `,
      })
      
      return { success: true }
    } catch (error) {
      console.error("Failed to send contact notification:", error)
      return { success: false, error }
    }
  }
}
