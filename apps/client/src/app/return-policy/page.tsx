import { Metadata } from "next"

import { siteConfig } from "@repo/ui/config/site"

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: `Return & Refund Policy for ${siteConfig.name}.`,
}

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Return & Refund Policy</h1>
        
        <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
          <p>Thank you for shopping at {siteConfig.name}.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">Returns</h2>
          <p>
            You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging and needs to have the receipt or proof of purchase.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">Refunds</h2>
          <p>
            Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your original method of payment.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8">Shipping</h2>
          <p>
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8">Contact Us</h2>
          <p>
            If you have any questions on how to return your item to us, please contact us through our Contact page.
          </p>
        </div>
      </div>
    </div>
  )
}
