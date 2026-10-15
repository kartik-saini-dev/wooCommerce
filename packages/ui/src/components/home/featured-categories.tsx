import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Package } from "lucide-react"
import { Category } from "@prisma/client"

import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Card, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { getTranslation } from "@repo/services/i18n/server"

interface FeaturedCategoriesProps {
  categories: Category[]
}

export async function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const { t } = await getTranslation()
  if (!categories?.length) return null

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("home.shopByCategory") || "Shop by Category"}</h2>
            <p className="text-muted-foreground mt-2">{t("home.shopByCategoryDesc") || "Find exactly what you need from our extensive catalog."}</p>
          </div>
          <Link href="/products" className="group/button shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground h-8 px-2.5 hidden md:inline-flex">
            {t("home.viewAllProducts") || "View All Products"} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md">
                <div className="relative h-32 w-full bg-muted">
                  {category.imageUrl ? (
                     <Image
                       src={category.imageUrl}
                       alt={category.name}
                       fill
                       className="object-cover transition-transform group-hover:scale-105"
                     />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-100 group-hover:bg-primary/10 transition-colors">
                      <Package className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                  )}
                </div>
                <CardHeader className="p-4 text-center">
                  <CardTitle className="text-sm font-medium sm:text-base group-hover:text-primary transition-colors">{category.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        
      </Container>
    </Section>
  )
}
