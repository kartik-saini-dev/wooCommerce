import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"
import * as React from "react"
import { siteConfig } from "@repo/ui/config/site"

interface ContactConfirmationEmailProps {
  name: string
  querySubject: string
}

export const ContactConfirmationEmail = ({ name, querySubject }: ContactConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>We&apos;ve received your message - {siteConfig.name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Message Received</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          Thank you for contacting {siteConfig.name}. We have successfully received your message regarding <strong>&quot;{querySubject}&quot;</strong>.
        </Text>
        <Text style={text}>
          Our support team is reviewing your inquiry and will get back to you as soon as possible, usually within 1-2 business days.
        </Text>
        <Text style={footer}>
          Best regards,<br />
          The {siteConfig.name} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ContactConfirmationEmail

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}
const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 48px",
}
const text = {
  color: "#333",
  fontSize: "16px",
  padding: "0 48px",
  lineHeight: "24px",
}
const footer = {
  color: "#8898aa",
  fontSize: "14px",
  padding: "0 48px",
  marginTop: "30px",
}
