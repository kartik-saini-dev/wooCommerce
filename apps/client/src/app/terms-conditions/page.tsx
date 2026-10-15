import { Metadata } from "next"
import { siteConfig } from "@repo/ui/config/site"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms & Conditions for ${siteConfig.name}.`,
}

export default function TermsConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Terms & Conditions</h1>
        
        <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
          <p>Last updated: August 1, 2026</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on {siteConfig.name}'s website for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8">3. Disclaimer</h2>
          <p>
            The materials on {siteConfig.name}'s website are provided on an 'as is' basis. {siteConfig.name} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8">4. Limitations</h2>
          <p>
            In no event shall {siteConfig.name} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on {siteConfig.name}'s website.
          </p>
        </div>
      </div>
    </div>
  )
}
