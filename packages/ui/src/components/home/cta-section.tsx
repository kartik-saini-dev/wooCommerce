import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Button } from "@repo/ui/components/ui/button"
import { getTranslation } from "@repo/services/i18n/server"

export async function CtaSection() {
  const { t } = await getTranslation()
  return (
    <Section className="border-t bg-background">
      <Container>
        <div className="rounded-3xl bg-primary px-6 py-16 sm:p-16 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg')] opacity-10 mix-blend-overlay bg-cover bg-center" />
          
          <div className="relative z-10 mx-auto max-w-2xl text-primary-foreground">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("home.ctaTitle") || "Ready to upgrade your experience?"}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
              {t("home.ctaDesc") || "Join thousands of satisfied customers who trust us for their shopping and professional service needs."}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/services" className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 gap-2">
                {t("home.ctaButton1") || "Book a Repair"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="text-sm font-semibold leading-6 text-primary-foreground hover:underline underline-offset-4">
                {t("home.ctaButton2") || "Contact Sales"} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
