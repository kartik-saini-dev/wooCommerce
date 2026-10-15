import { Metadata } from "next"

import { siteConfig } from "@repo/ui/config/site"

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: `Shipping Policy for ${siteConfig.name}.`,
}

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Shipping Policy</h1>
        
        <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold text-foreground mt-8">Order Processing Time</h2>
          <p>
            All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">Shipping Rates & Delivery Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout. Delivery delays can occasionally occur based on courier availability and remote locations.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8">Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8">Damages</h2>
          <p>
            {siteConfig.name} is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
          </p>
        </div>
      </div>
    </div>
  )
}
