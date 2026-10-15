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
} from "@react-email/components"

interface StatusUpdateEmailProps {
  referenceNumber: string
  customerName: string
  type: "Order" | "Booking"
  newStatus: string
}

export function StatusUpdateEmail({
  referenceNumber,
  customerName,
  type,
  newStatus,
}: StatusUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Update regarding your {type.toLowerCase()} {referenceNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{type} Status Update</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            There is an update regarding your {type.toLowerCase()} <strong>{referenceNumber}</strong>.
          </Text>
          
          <Section style={detailsContainer}>
            <Text style={statusText}>
              New Status: <span style={highlight}>{newStatus}</span>
            </Text>
          </Section>

          <Text style={text}>
            You can track the progress and view more details by logging into your account dashboard.
          </Text>

          <Text style={footer}>
            Thank you for choosing {siteConfig.name}!
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
  textAlign: "center" as const,
}

const statusText = {
  margin: "0",
  fontSize: "18px",
  color: "#333",
}

const highlight = {
  fontWeight: "bold",
  color: "#0284c7",
  backgroundColor: "#e0f2fe",
  padding: "4px 8px",
  borderRadius: "4px",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  padding: "0 24px",
  marginTop: "48px",
}
