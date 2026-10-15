import { Metadata } from "next"
import { siteConfig } from "@repo/ui/config/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}.`,
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Privacy Policy</h1>
        
        <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
          <p>Last updated: August 1, 2026</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">2. How We Use Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request, and develop new features.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8">3. Sharing of Information</h2>
          <p>
            We do not share your personal information with third parties except as described in this privacy policy, such as with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8">4. Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
          </p>
        </div>
      </div>
    </div>
  )
}
