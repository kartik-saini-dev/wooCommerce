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
    <Section className="bg-muted/40 dark:bg-muted/10 border-y py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="border border-border/70 bg-card/70 backdrop-blur-sm rounded-2xl shadow-xs hover:shadow-md hover:border-primary/40 transition-all">
              <CardContent className="flex flex-col items-start gap-4 p-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground">{feature.title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
