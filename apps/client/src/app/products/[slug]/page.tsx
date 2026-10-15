import { notFound } from "next/navigation"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { Metadata } from "next"
import { ShoppingCart, CheckCircle2, AlertCircle } from "lucide-react"

import { prisma as db } from "@repo/db"
import { getTranslation } from "@repo/services/i18n/server"
import { siteConfig } from "@repo/ui/config/site"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { Button } from "@repo/ui/components/ui/button"
import { Badge } from "@repo/ui/components/ui/badge"
import { AddToCartButton } from "@repo/ui/components/shop/add-to-cart-button"

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const product = await db.product.findUnique({ 
      where: { slug: resolvedParams.slug },
      include: { images: true }
    })
    
    if (!product) return { title: "Product Not Found" }
    
    const title = product.seoTitle || product.name
    const description = product.seoDescription || product.shortDescription || "View our product"
    const imageUrl = product.images[0]?.url || "/placeholder-image.jpg"
    
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
    return { title: "Product Not Found" }
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const resolvedParams = await params
  let product = null
  
  try {
    product = await db.product.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        category: true,
        brand: true,
        inventory: true,
        images: { orderBy: { sortOrder: 'asc' } },
      }
    })
  } catch (error) {
    console.error("Failed to load product details:", error)
  }

  if (!product || !product.isActive) {
    notFound()
  }

  const { t } = await getTranslation()
  const images = Array.isArray(product?.images) ? product.images : []
  const primaryImage = images.find(img => img.isPrimary) || images[0]
  
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(product.price))
  
  const formattedComparePrice = product.comparePrice 
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(product.comparePrice))
    : null

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || siteConfig.url
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: primaryImage?.url,
    description: product.seoDescription || product.shortDescription || product.description,
    sku: product.sku,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand.name
    } : undefined,
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inventory && product.inventory.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    }
  }

  return (
    <div className="bg-background min-h-screen pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="py-6">
        <Breadcrumbs 
          items={[
            { title: t("nav.products") || "Products", href: "/products" },
            ...(product.category ? [{ title: product.category.name, href: `/products?category=${product.category.slug}` }] : []),
            { title: product.name }
          ]} 
        />
      </Container>
      
      <Section className="pt-4">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square max-h-[500px] mx-auto overflow-hidden rounded-2xl bg-card border border-muted-foreground/20 shadow-sm flex items-center justify-center p-4">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.altText || product.name}
                    fill
                    className="object-contain p-4 transition-transform hover:scale-105 duration-500"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">{t("shop.noImage") || "No image"}</div>
                )}
              </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img, i) => (
                      <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-card border border-muted-foreground/20 shadow-sm cursor-pointer hover:border-primary hover:shadow-md transition-all">
                        <Image src={img.url} alt={img.altText || `${product.name} ${i}`} fill className="object-contain p-2" />
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {product.category && (
                <div className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
                  {product.category.name}
                </div>
              )}
              
              <h1 className="text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
              
              <div className="flex items-end gap-4 mb-8 pb-8 border-b">
                <span className="text-4xl font-bold text-foreground">{formattedPrice}</span>
                {formattedComparePrice && (
                  <span className="text-2xl text-muted-foreground line-through mb-1">
                    {formattedComparePrice}
                  </span>
                )}
                {product.discount && Number(product.discount) > 0 && (
                  <Badge className="mb-2 bg-destructive/10 text-destructive border-destructive/20 px-3 py-1 text-sm font-bold">
                    {Number(product.discount)}% OFF
                  </Badge>
                )}
              </div>

              {product.shortDescription && (
                <div className="mb-6">
                  <p className="text-muted-foreground text-xl leading-relaxed italic border-l-4 border-primary/40 pl-4">
                    {product.shortDescription}
                  </p>
                </div>
              )}

              <div className="space-y-6 mb-10 prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-loose">
                {product.description ? (
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                ) : (
                  <p>{t("shop.noDescription") || "No detailed description available."}</p>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-8">
                {product.inventory && product.inventory.quantity > 0 ? (
                  <div className="flex items-center text-green-600 dark:text-green-500 font-medium">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    {t("shop.inStock") || "In Stock"} ({product.inventory.quantity} {t("shop.available") || "available"})
                  </div>
                ) : (
                  <div className="flex items-center text-destructive font-medium">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {t("shop.outOfStock") || "Out of Stock"}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <AddToCartButton 
                  product={{
                    ...product,
                    price: Number(product.price),
                    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
                    discount: product.discount ? Number(product.discount) : null,
                  }}
                  productId={product.id}
                  isOutOfStock={!product.inventory || product.inventory.quantity === 0}
                  size="lg" 
                  className="flex-1 text-base h-14" 
                />
              </div>
              
              {/* Extra Info */}
              <div className="mt-12 pt-8 border-t space-y-4 text-sm text-muted-foreground">
                <p><strong>{t("shop.sku") || "SKU"}:</strong> {product.sku}</p>
                {product.brand && <p><strong>{t("shop.brand") || "Brand"}:</strong> {product.brand.name}</p>}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
