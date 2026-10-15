import { prisma as db } from "@repo/db"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { ServiceCard } from "@repo/ui/components/shop/service-card"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { getTranslation } from "@repo/services/i18n/server"

export const metadata = {
  title: "Professional Services",
  description: "Book certified electricians for your repair and installation needs.",
}

interface ServicesPageProps {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { t } = await getTranslation()
  const resolvedSearchParams = await searchParams
  const { category, q } = resolvedSearchParams

  const where: any = { isActive: true }

  if (category) {
    where.category = { slug: category }
  }
  if (q) {
    where.name = { contains: q, mode: "insensitive" }
  }

  let services: any[] = []

  try {
      const servicesRes = await db.service.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        category: true,
      }
    })
    services = servicesRes.map((s: any) => ({
      ...s,
      basePrice: s.basePrice ? Number(s.basePrice) : 0,
      comparePrice: s.comparePrice ? Number(s.comparePrice) : null,
      discount: s.discount ? Number(s.discount) : null,
    }))
  } catch (error) {
    console.error("Failed to load services:", error)
  }

  return (
    <div className="bg-background min-h-screen pb-12">
      <Container className="py-6">
        <Breadcrumbs
          items={[
            { title: t("nav.services") || "Services", href: "/services" },
            ...(category ? [{ title: category.charAt(0).toUpperCase() + category.slice(1) }] : []),
          ]}
        />
      </Container>

      <Section className="pt-0">
        <Container>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-8 max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} ${t("nav.services") || "Services"}` : (t("home.featuredServices") || "Professional Services")}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {t("home.featuredServicesDesc") || "Book certified electricians for reliable repairs, installations, and maintenance."}
                </p>
              </div>

              {services.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card border-dashed">
                  <h3 className="text-xl font-bold mb-2">{t("shop.noServices") || "No services found"}</h3>
                  <p className="text-muted-foreground">{t("shop.noProductsDesc") || "Try adjusting your filters or search query."}</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
