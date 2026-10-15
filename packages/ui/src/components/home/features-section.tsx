import { ShieldCheck, Zap, Clock, Truck } from "lucide-react"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Card, CardContent } from "@repo/ui/components/ui/card"

import { getTranslation } from "@repo/services/i18n/server"

export async function FeaturesSection() {
  const { t } = await getTranslation()
  
  const features = [
    {
      title: t("home.feature1Title") || "Genuine Quality",
      description: t("home.feature1Desc") || "100% authentic parts sourced directly from manufacturers with full warranty.",
      icon: ShieldCheck,
    },
    {
      title: t("home.feature2Title") || "Fast Delivery",
      description: t("home.feature2Desc") || "Same-day or next-day delivery options available for critical spare parts.",
      icon: Truck,
    },
    {
      title: t("home.feature3Title") || "Expert Technicians",
      description: t("home.feature3Desc") || "Certified and background-checked professionals ready to fix your issues.",
      icon: Zap,
    },
    {
      title: t("home.feature4Title") || "24/7 Support",
      description: t("home.feature4Desc") || "Round-the-clock customer service to assist with your emergency needs.",
      icon: Clock,
    },
  ]
  return (
    <Section className="bg-muted/50 dark:bg-muted/10">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Card key={i} className="border-none shadow-none bg-transparent">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
