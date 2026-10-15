import * as React from "react"
import { siteConfig } from "@repo/ui/config/site"
import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Preview,
  Section,
  Text,
  Img
} from "@react-email/components"

interface BookingConfirmationEmailProps {
  bookingNumber: string
  customerName: string
  serviceName: string
  scheduledDate: string
}

export function BookingConfirmationEmail({
  bookingNumber,
  customerName,
  serviceName,
  scheduledDate,
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your service booking {bookingNumber} is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmed</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for booking with {siteConfig.name}! Your service request has been received and confirmed.
          </Text>
          
          <Section style={detailsContainer}>
            <Text style={detailsText}><strong>Booking #:</strong> {bookingNumber}</Text>
            <Text style={detailsText}><strong>Service:</strong> {serviceName}</Text>
            <Text style={detailsText}><strong>Scheduled Date & Time:</strong> {scheduledDate}</Text>
          </Section>

          <Text style={text}>
            Our technician will be assigned shortly, and we will keep you updated.
            You can view your booking details in your account dashboard.
          </Text>

          <Text style={footer}>
            Need help? Reply to this email or contact support.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 24px",
  margin: "30px 0",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  padding: "0 24px",
}

const detailsContainer = {
  padding: "24px",
  margin: "24px",
  backgroundColor: "#f4f4f5",
  borderRadius: "4px",
}

const detailsText = {
  margin: "0 0 10px 0",
  fontSize: "14px",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  padding: "0 24px",
  marginTop: "48px",
}
