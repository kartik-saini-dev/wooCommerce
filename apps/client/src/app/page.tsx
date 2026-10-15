import { prisma as db } from "@repo/db"

import { HeroSection } from "@repo/ui/components/home/hero-section"
import { FeaturesSection } from "@repo/ui/components/home/features-section"
import { FeaturedCategories } from "@repo/ui/components/home/featured-categories"
import { FeaturedProducts } from "@repo/ui/components/home/featured-products"
import { FeaturedServices } from "@repo/ui/components/home/featured-services"
import { CtaSection } from "@repo/ui/components/home/cta-section"
import { featuresConfig } from "@repo/ui/config/features"
import { showcaseCategories, showcaseProducts, showcaseServices } from "@repo/ui/config/demo-data"

export default async function HomePage() {
  let categories: any[] = []
  let products: any[] = []
  let services: any[] = []

  try {
    const results = await Promise.all([
      db.category.findMany({
        where: { isActive: true },
        take: 5,
        orderBy: { sortOrder: 'asc' },
      }),
      db.product.findMany({
        where: { isActive: true, isFeatured: true },
        take: 8,
        include: { images: true, category: true },
        orderBy: { createdAt: 'desc' },
      }),
      db.service.findMany({
        where: { isActive: true, isFeatured: true },
        take: 6,
        include: { images: true, category: true },
        orderBy: { createdAt: 'desc' },
      })
    ])
    categories = results[0]
    products = results[1].map((p: any) => ({
      ...p,
      price: p.price ? Number(p.price) : 0,
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      discount: p.discount ? Number(p.discount) : null,
    }))
    services = results[2].map((s: any) => ({
      ...s,
      basePrice: s.basePrice ? Number(s.basePrice) : 0,
      comparePrice: s.comparePrice ? Number(s.comparePrice) : null,
      discount: s.discount ? Number(s.discount) : null,
    }))
  } catch (error) {
    console.error("Failed to load homepage data:", error)
  }

  // Gracefully fall back to showcase data so deployed site is always rich and professional
  const displayCategories = categories.length > 0 ? categories : showcaseCategories
  const displayProducts = products.length > 0 ? products : showcaseProducts
  const displayServices = services.length > 0 ? services : showcaseServices

  return (
    <>
      {featuresConfig.homepageSections.hero && <HeroSection />}
      <FeaturesSection />
      {featuresConfig.homepageSections.categories && <FeaturedCategories categories={displayCategories} />}
      {featuresConfig.homepageSections.featuredProducts && <FeaturedProducts products={displayProducts} />}
      {featuresConfig.homepageSections.servicesPreview && featuresConfig.enableServices && <FeaturedServices services={displayServices} />}
      {featuresConfig.homepageSections.cta && <CtaSection />}
    </>
  )
}
