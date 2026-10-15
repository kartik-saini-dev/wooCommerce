import Link from "next/link"
import { prisma as db } from "@repo/db"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { ProductCard } from "@repo/ui/components/shop/product-card"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { getTranslation } from "@repo/services/i18n/server"

export const metadata = {
  title: "Shop Products",
  description: "Browse our extensive catalog of electrical spare parts and tools.",
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    q?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { t } = await getTranslation()
  const resolvedSearchParams = await searchParams
  const { category, q, sort } = resolvedSearchParams

  const where: any = { isActive: true }
  
  if (category) {
    where.category = { slug: category }
  }
  if (q) {
    where.name = { contains: q, mode: "insensitive" }
  }

  let orderBy: any = { createdAt: "desc" }
  if (sort === "price_asc") orderBy = { price: "asc" }
  if (sort === "price_desc") orderBy = { price: "desc" }
  if (sort === "name_asc") orderBy = { name: "asc" }

  let products: any[] = []
  let categories: any[] = []
  let dbError = false
  
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        include: {
          images: true,
          category: true,
        }
      }),
      db.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" }
      })
    ])
    products = productsRes.map((p: any) => ({
      ...p,
      price: p.price ? Number(p.price) : 0,
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      discount: p.discount ? Number(p.discount) : null,
    }))
    categories = categoriesRes
  } catch (error) {
    console.error("Failed to load data:", error)
    dbError = true
  }

  return (
    <div className="bg-muted/10 dark:bg-background min-h-screen pb-12">
      <Container className="py-6">
        <Breadcrumbs 
          items={[
            { title: t("nav.products") || "Products", href: "/products" },
            ...(category ? [{ title: category.charAt(0).toUpperCase() + category.slice(1) }] : []),
          ]} 
        />
      </Container>
      
      <Section className="pt-0">
        <Container>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / Filters */}
            <div className="w-full md:w-64 shrink-0 space-y-6">
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="font-semibold mb-4 text-lg border-b pb-2">{t("shop.categories") || "Categories"}</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/products" 
                      className={`block text-sm transition-colors hover:text-primary ${!category ? 'font-medium text-primary' : 'text-muted-foreground'}`}
                    >
                      {t("shop.allProducts") || "All Products"}
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link 
                        href={`/products?category=${cat.slug}`} 
                        className={`block text-sm transition-colors hover:text-primary ${category === cat.slug ? 'font-medium text-primary' : 'text-muted-foreground'}`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                  {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : (t("shop.allProducts") || "All Products")}
                </h1>
                <span className="text-muted-foreground text-sm">{products.length} {t("shop.results") || "Results"}</span>
              </div>

              {dbError ? (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-destructive/10 border-destructive/20 text-destructive">
                  <h3 className="text-xl font-bold mb-2">Unable to connect</h3>
                  <p className="text-sm opacity-90">We're having trouble connecting to our database right now. Please try again later.</p>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card border-dashed">
                  <h3 className="text-xl font-bold mb-2">{t("shop.noProducts") || "No products found"}</h3>
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
