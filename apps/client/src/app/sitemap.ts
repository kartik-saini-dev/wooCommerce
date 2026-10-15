import { MetadataRoute } from 'next'
import { prisma } from '@repo/db'
import { siteConfig } from '@repo/ui/config/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  try {
    // Fetch dynamic routes
    const [products, services] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.service.findMany({ select: { slug: true, updatedAt: true } })
    ])

    const productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const serviceUrls = services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const staticRoutes = [
      '',
      '/products',
      '/services',
      '/about',
      '/contact',
      '/faq',
      '/privacy-policy',
      '/terms-conditions',
      '/shipping-policy',
      '/return-policy',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.5,
    }))

    return [...staticRoutes, ...productUrls, ...serviceUrls]
  } catch (error) {
    console.error("Failed to generate full sitemap", error)
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 }
    ]
  }
}
