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

interface WelcomeEmailProps {
  name: string
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to {siteConfig.name}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to {siteConfig.name}</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          Thank you for joining {siteConfig.name}. We&apos;re excited to have you on board!
          You can now seamlessly browse and purchase high-quality products, 
          or book certified professionals for any service needs.
        </Text>
        <Text style={text}>
          If you have any questions, feel free to reply to this email or contact our support team.
        </Text>
        <Text style={footer}>
          Welcome to the family!<br />
          The {siteConfig.name} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

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
