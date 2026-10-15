import { notFound } from "next/navigation"
import Image from "next/image"
import { Metadata } from "next"
import { Calendar, Clock, MapPin, Shield, Zap } from "lucide-react"

import { siteConfig } from "@repo/ui/config/site"
import { prisma as db } from "@repo/db"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { Button } from "@repo/ui/components/ui/button"
import { Badge } from "@repo/ui/components/ui/badge"

interface ServiceDetailsPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ServiceDetailsPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const service = await db.service.findUnique({ 
      where: { slug: resolvedParams.slug },
      include: { images: true }
    })
    
    if (!service) return { title: "Service Not Found" }
    
    const title = service.seoTitle || service.name
    const description = service.seoDescription || service.shortDescription || "View our service"
    const imageUrl = service.images[0]?.url || "/placeholder-image.jpg"
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [{ url: imageUrl }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      }
    }
  } catch (error) {
    return { title: "Service Not Found" }
  }
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const resolvedParams = await params
  let service = null

  try {
    service = await db.service.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      }
    })
  } catch (error) {
    console.error("Failed to load service details:", error)
  }

  if (!service || !service.isActive) {
    notFound()
  }

  const primaryImage = service.images.find(img => img.isPrimary) || service.images[0]

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(service.basePrice))

  return (
    <div className="bg-background min-h-screen pb-12">
      <Container className="py-6">
        <Breadcrumbs
          items={[
            { title: "Services", href: "/services" },
            ...(service.category ? [{ title: service.category.name, href: `/services?category=${service.category.slug}` }] : []),
            { title: service.name }
          ]}
        />
      </Container>

      <Section className="pt-4">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Details */}
            <div className="flex flex-col order-2 lg:order-1">
              {service.category && (
                <div className="text-sm font-semibold text-primary mb-3 tracking-wider uppercase">
                  {service.category.name}
                </div>
              )}

              <h1 className="text-4xl font-bold tracking-tight mb-4">{service.name}</h1>

              <div className="flex items-center gap-2 mb-6">
                {service.isEmergency && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-white gap-1">
                    <Zap className="h-3 w-3" /> Emergency 24/7
                  </Badge>
                )}
                {service.isHomeVisit && (
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="h-3 w-3" /> Home Visit
                  </Badge>
                )}
              </div>

              <div className="flex flex-col gap-1 mb-8 pb-6 border-b">
                <span className="text-sm text-muted-foreground">Starting from</span>
                <span className="text-3xl font-bold">{formattedPrice}</span>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {service.estimatedHrs && (
                  <div className="flex flex-col gap-1 p-4 rounded-xl border bg-muted/50 dark:bg-muted/10">
                    <Clock className="h-5 w-5 text-primary mb-2" />
                    <span className="font-semibold">Estimated Time</span>
                    <span className="text-sm text-muted-foreground">~{service.estimatedHrs} Hours</span>
                  </div>
                )}
                <div className="flex flex-col gap-1 p-4 rounded-xl border bg-muted/50 dark:bg-muted/10">
                  <Shield className="h-5 w-5 text-primary mb-2" />
                  <span className="font-semibold">Guarantee</span>
                  <span className="text-sm text-muted-foreground">30-Day Service</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1 text-base h-14">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-4 order-1 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted border">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.altText || service.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
                )}
              </div>
              {service.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {service.images.map((img, i) => (
                    <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted border cursor-pointer hover:border-primary transition-colors">
                      <Image src={img.url} alt={img.altText || `${service.name} ${i}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.shortDescription || service.description,
            provider: {
              "@type": "LocalBusiness",
              name: siteConfig.name,
            },
            offers: {
              "@type": "Offer",
              price: service.basePrice,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
            image: primaryImage?.url,
          }),
        }}
      />
    </div>
  )
}
