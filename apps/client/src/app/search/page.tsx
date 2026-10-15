import { prisma as db } from "@repo/db"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { ProductCard } from "@repo/ui/components/shop/product-card"
import { ServiceCard } from "@repo/ui/components/shop/service-card"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { Search } from "lucide-react"

export const metadata = {
  title: "Search Results",
  description: "Search for electrical parts and professional services.",
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams
  const q = resolvedSearchParams.q || ""

  let products: any[] = []
  let services: any[] = []

  if (q.trim()) {
    try {
      const [productsRes, servicesRes] = await Promise.all([
        db.product.findMany({
          where: {
            isActive: true,
            name: { contains: q, mode: "insensitive" }
          },
          orderBy: { createdAt: "desc" },
          include: {
            images: true,
            category: true,
          }
        }),
        db.service.findMany({
          where: {
            isActive: true,
            name: { contains: q, mode: "insensitive" }
          },
          orderBy: { createdAt: "desc" },
          include: {
            images: true,
            category: true,
          }
        })
      ])
      products = productsRes.map((p: any) => ({
        ...p,
        price: p.price ? Number(p.price) : 0,
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        discount: p.discount ? Number(p.discount) : null,
      }))
      services = servicesRes.map((s: any) => ({
        ...s,
        basePrice: s.basePrice ? Number(s.basePrice) : 0,
        comparePrice: s.comparePrice ? Number(s.comparePrice) : null,
        discount: s.discount ? Number(s.discount) : null,
      }))
    } catch (error) {
      console.error("Failed to load search results:", error)
    }
  }

  const hasResults = products.length > 0 || services.length > 0

  return (
    <div className="bg-background min-h-screen pb-12">
      <Container className="py-6">
        <Breadcrumbs 
          items={[
            { title: "Search", href: "/search" },
            ...(q ? [{ title: `"${q}"` }] : []),
          ]} 
        />
      </Container>
      
      <Section className="pt-0">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Search Results
            </h1>
            {q ? (
              <p className="text-muted-foreground">
                Showing results for <span className="font-semibold text-foreground">"{q}"</span>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Enter a search term to find products and services.
              </p>
            )}
          </div>

          {!q.trim() ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card border-dashed">
              <Search className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-bold mb-2">Start Searching</h3>
              <p className="text-muted-foreground">Type above to find parts or book repairs.</p>
            </div>
          ) : !hasResults ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card border-dashed">
              <Search className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground">We couldn't find anything matching "{q}".</p>
            </div>
          ) : (
            <div className="space-y-12">
              {products.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Products <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{products.length}</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {services.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Services <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{services.length}</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>
    </div>
  )
}
