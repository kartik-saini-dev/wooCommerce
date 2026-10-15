import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"

import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Card, CardContent } from "@repo/ui/components/ui/card"
import { prisma as db } from "@repo/db"

export async function ServicesPreview() {
  const services = await db.service.findMany({
    where: { isActive: true },
    take: 3,
  })

  return (
    <Section className="bg-muted/50 dark:bg-muted/10">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Professional Repair & Installation
            </h2>
            <p className="text-lg text-muted-foreground">
              Don&apos;t compromise on safety. Our network of certified electricians and technicians are ready to solve your electrical problems quickly and efficiently.
            </p>
            
            <ul className="space-y-4">
              {[
                "Background-checked & certified technicians",
                "Upfront pricing with no hidden fees",
                "30-day service guarantee",
                "Emergency 24/7 availability"
              ].map((item, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-4">
              <Link href="/services" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none bg-primary text-primary-foreground hover:bg-primary/80 h-9 px-4 gap-2">
            View All Services
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl transform -rotate-6" />
            <Card className="relative overflow-hidden border-2 rounded-2xl bg-background/80 backdrop-blur">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-muted relative">
                  {/* Image Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-800">
                    <span className="text-slate-400 font-medium">Repair Service Image Placeholder</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  )
}
