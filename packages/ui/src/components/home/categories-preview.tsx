import Link from "next/link"
import { ArrowRight, Lightbulb, Plug, Wrench, Battery, Cable } from "lucide-react"

import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Card, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/ui/card"
import { Button } from "@repo/ui/components/ui/button"

const categories = [
  { name: "Wiring & Cables", icon: Cable, href: "/products?category=wiring" },
  { name: "Lighting", icon: Lightbulb, href: "/products?category=lighting" },
  { name: "Tools & Equipment", icon: Wrench, href: "/products?category=tools" },
  { name: "Switches & Sockets", icon: Plug, href: "/products?category=switches" },
  { name: "Power Backup", icon: Battery, href: "/products?category=power" },
]

export function CategoriesPreview() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground mt-2">Find exactly what you need from our extensive catalog.</p>
          </div>
          <Link href="/categories" className="group/button shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground h-8 px-2.5 hidden md:inline-flex">
            View All Categories <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md dark:hover:shadow-primary/5">
                <CardHeader className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-slate-100 p-4 transition-colors group-hover:bg-primary/10 dark:bg-slate-800 dark:group-hover:bg-primary/20">
                    <category.icon className="h-8 w-8 text-slate-700 transition-colors group-hover:text-primary dark:text-slate-300" />
                  </div>
                  <CardTitle className="text-sm font-medium sm:text-base">{category.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        
        <Link href="/categories" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted h-8 px-2.5 w-full mt-8 md:hidden">
          View All Categories <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Container>
    </Section>
  )
}
