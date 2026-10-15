import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { ServiceCard } from "@repo/ui/components/shop/service-card"
import { getTranslation } from "@repo/services/i18n/server"

interface FeaturedServicesProps {
  services: (import("@prisma/client").Service & { 
    category?: import("@prisma/client").ServiceCategory | null; 
    images: import("@prisma/client").ServiceImage[];
  })[]
}

export async function FeaturedServices({ services }: FeaturedServicesProps) {
  const { t } = await getTranslation()
  if (!services?.length) return null

  return (
    <Section className="bg-muted/50 dark:bg-muted/10">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("home.featuredServices") || "Expert Repair Services"}</h2>
            <p className="text-muted-foreground mt-2">{t("home.featuredServicesDesc") || "Professional installation and repair by certified technicians."}</p>
          </div>
          <Link href="/services" className="group/button shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground h-8 px-2.5 hidden md:inline-flex">
            {t("home.viewAllServices") || "View All Services"} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service as any} />
          ))}
        </div>
        
        <Link href="/services" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted h-8 px-2.5 w-full mt-8 md:hidden">
          {t("home.viewAllServices") || "View All Services"} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Container>
    </Section>
  )
}
