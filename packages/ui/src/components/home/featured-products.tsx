import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { ProductCard } from "@repo/ui/components/shop/product-card"
import { getTranslation } from "@repo/services/i18n/server"

interface FeaturedProductsProps {
  products: (import("@prisma/client").Product & { 
    category?: import("@prisma/client").Category | null; 
    images: import("@prisma/client").ProductImage[];
  })[]
}

export async function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = await getTranslation()
  if (!products?.length) return null

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("home.featuredProducts") || "Featured Products"}</h2>
            <p className="text-muted-foreground mt-2">{t("home.featuredProductsDesc") || "Discover our hand-picked selection of premium electrical parts."}</p>
          </div>
          <Link href="/products" className="group/button shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground h-8 px-2.5 hidden md:inline-flex">
            {t("home.viewAllProducts") || "View All Products"} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
        
        <Link href="/products" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted h-8 px-2.5 w-full mt-8 md:hidden">
          {t("home.viewAllProducts") || "View All Products"} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Container>
    </Section>
  )
}
