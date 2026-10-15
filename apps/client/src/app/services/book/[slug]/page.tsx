import { getServerSession } from "next-auth/next"
import { notFound, redirect } from "next/navigation"

import { authOptions } from "@repo/services/auth"
import { prisma as db } from "@repo/db"
import { AddressRepository } from "@repo/services/repositories/address"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { BookingForm } from "@repo/ui/components/shop/booking-form"

export const metadata = {
  title: "Book Service",
}

export default async function BookServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/login?callbackUrl=/services/book/${resolvedParams.slug}`)
  }

  const service = await db.service.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 }
    }
  })

  if (!service || !service.isActive) {
    notFound()
  }

  const addresses = await AddressRepository.getUserAddresses(session.user.id)

  return (
    <div className="bg-background min-h-screen pb-12">
      <Container className="py-6">
        <Breadcrumbs items={[
          { title: "Services", href: "/services" },
          { title: service.name, href: `/services/${service.slug}` },
          { title: "Book Now" }
        ]} />
      </Container>
      
      <Section className="pt-0">
        <Container>
          <div className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight">Book {service.name}</h1>
            <p className="text-muted-foreground mt-2">Fill out the details below to schedule your service. A technician will be assigned to you soon.</p>
          </div>

          <BookingForm service={service} addresses={addresses} />
        </Container>
      </Section>
    </div>
  )
}
