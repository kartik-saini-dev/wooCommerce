import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"
import { siteConfig } from "@repo/ui/config/site"

interface OrderReceiptEmailProps {
  orderNumber: string
  customerName: string
  totalAmount: string
  paymentMethod: string
}

export const OrderReceiptEmail = ({
  orderNumber,
  customerName,
  totalAmount,
  paymentMethod,
}: OrderReceiptEmailProps) => (
  <Html>
    <Head />
    <Preview>Your {siteConfig.name} Order #{orderNumber} has been received.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Order Received</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          Thank you for shopping with {siteConfig.name}! We have received your order 
          <strong>#{orderNumber}</strong> and it is currently being processed.
        </Text>
        
        <Section style={orderBox}>
          <Text style={text}><strong>Total Amount:</strong> {totalAmount}</Text>
          <Text style={text}><strong>Payment Method:</strong> {paymentMethod}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          If you have any questions about your order, please reply to this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default OrderReceiptEmail

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

const orderBox = {
  backgroundColor: "#f4f4f5",
  borderRadius: "4px",
  padding: "24px 48px",
  margin: "24px 0",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  padding: "0 48px",
}
